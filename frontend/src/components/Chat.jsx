import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

// Initialize Socket.IO connection
const socket = io('http://localhost:8080', {
  transports: ['websocket'], // Ensure WebSocket transport is used
});

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [callOffer, setCallOffer] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);

        // Register user with the server
        socket.emit('register', response.data.email);
      } catch (err) {
        console.error('Error fetching user data', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for incoming messages
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Listen for incoming video call offers
    socket.on('offer', (data) => {
      setCallOffer(data);
    });

    // Listen for answers to video call offers
    socket.on('answer', async (data) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      }
    });

    // Listen for ICE candidates
    socket.on('ice-candidate', async (data) => {
      if (peerConnection.current) {
        await peerConnection.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    });

    // Listen for online users
    socket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('message');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('online-users');
    };
  }, [navigate]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.trim() && user) {
      socket.emit('sendMessage', {
        sender: user.email,
        recipient,
        message,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: user.email, message },
      ]);
      setMessage('');
    }
  };

  const startVideoCall = async (recipientEmail) => {
    setRecipient(recipientEmail); // Set recipient for the video call
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peerConnection.current = new RTCPeerConnection();

      stream.getTracks().forEach((track) =>
        peerConnection.current.addTrack(track, stream)
      );

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { recipient: recipientEmail, candidate: event.candidate });
        }
      };

      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket.emit('offer', { recipient: recipientEmail, offer });
      setIsInCall(true);
    } catch (err) {
      console.error('Error starting video call', err);
    }
  };

  const acceptVideoCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      peerConnection.current = new RTCPeerConnection();

      stream.getTracks().forEach((track) =>
        peerConnection.current.addTrack(track, stream)
      );

      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(callOffer.offer)
      );

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.emit('answer', { recipient: callOffer.sender, answer });

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', {
            recipient: callOffer.sender,
            candidate: event.candidate,
          });
        }
      };

      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      setIsInCall(true);
      setCallOffer(null);
    } catch (err) {
      console.error('Error accepting video call', err);
    }
  };

  const rejectVideoCall = () => {
    setCallOffer(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-lg mx-auto p-6 border bg-white rounded-md shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>

      {user && (
        <div className="mb-4 text-xl font-semibold text-gray-700">
          Logged in as: {user.name}
        </div>
      )}

      {/* Display list of online users */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-2">Online Users</h3>
        <ul>
          {onlineUsers.map((onlineUser, index) => (
            <li
              key={index}
              className="flex items-center justify-between mb-2"
              onClick={() => startVideoCall(onlineUser)}
            >
              <span className="flex items-center">
                <span
                  className="w-3 h-3 bg-green-500 rounded-full mr-2"
                  title="Online"
                />
                {onlineUser}
              </span>
              <button
                onClick={() => startVideoCall(onlineUser)}
                className="text-blue-500 hover:underline"
              >
                Video Call
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Recipient's Email
        </label>
        <input
          type="email"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter recipient's email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
        />
      </div>
      <div className="mb-4 h-64 overflow-y-auto border p-4 bg-gray-100 rounded-md">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.sender === user.email ? 'You' : msg.sender}:</strong>{' '}
            {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <div className="mb-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mt-1"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          disabled={!message.trim() || !recipient}
        >
          Send Message
        </button>
      </form>
      <div className="mt-6">
        <button
          onClick={() => startVideoCall(recipient)}
          className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          disabled={!recipient}
        >
          Start Video Call
        </button>
      </div>
      {callOffer && (
        <div className="mt-6 bg-yellow-100 p-4 rounded-md">
          <p>Incoming call from {callOffer.sender}</p>
          <button onClick={acceptVideoCall} className="px-4 py-2 bg-green-600 text-white rounded-md">Accept</button>
          <button onClick={rejectVideoCall} className="px-4 py-2 bg-red-600 text-white rounded-md">Reject</button>
        </div>
      )}
      {isInCall && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium">You</h3>
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full rounded-md" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Recipient</h3>
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full rounded-md" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
