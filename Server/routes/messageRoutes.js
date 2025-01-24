const express = require('express');
const Message = require('../models/Message');

const router = express.Router();


router.post('/send', async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    const newMessage = new Message({ sender: senderId, receiver: receiverId, message });
    await newMessage.save();
    res.status(200).send('Message sent');
});

router.get('/chat/:userId1/:userId2', async (req, res) => {
    const { userId1, userId2 } = req.params;
    const messages = await Message.find({
        $or: [
            { sender: userId1, receiver: userId2 },
            { sender: userId2, receiver: userId1 },
        ]
    }).sort({ timestamp: 1 });
    res.json(messages);
});

module.exports = router;
