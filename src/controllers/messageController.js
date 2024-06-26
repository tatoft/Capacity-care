const Message = require('../models/Message');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  const { sender_id, receiver_id, message_content } = req.body;

  try {
    const newMessage = new Message({ sender_id, receiver_id, message_content });
    await newMessage.save();
    res.status(200).json({ message: 'Mensaje enviado exitosamente!' });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
};

exports.getConversation = async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender_id: userId1, receiver_id: userId2 },
        { sender_id: userId2, receiver_id: userId1 }
      ]
    }).populate('sender_id', 'name').populate('receiver_id', 'name');
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
};
