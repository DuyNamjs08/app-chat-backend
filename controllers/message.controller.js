const messSchema = require('../models/message.model')


const addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body
        const data = await messSchema.create({
            message: { text: message },
            users: [from, to],
            sender: from
        })
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (error) {
        next(error)
    }
}
const getAllMessage = async (req, res, next) => {
    try {
        const { from, to } = req.body
        const messages = await messSchema.find({
            users: {
                $all: [from, to],
            },
        }).sort({ updateAt: 1 });
        const projectedMessages = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() === from,
                message: msg.message.text,
            };
        });
        res.json(projectedMessages)
    } catch (error) {
        next(error)
    }
}


module.exports = { addMessage, getAllMessage }