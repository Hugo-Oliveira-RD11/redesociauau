"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversations = exports.conversation = exports.send = void 0;
const message_service_1 = require("../services/message.service");
const send = async (req, res) => {
    try {
        const { content } = req.body;
        const message = await (0, message_service_1.sendPrivateMessage)(req.user.id_usuario, parseInt(req.params.userId), content);
        res.status(201).json(message);
    }
    catch (error) {
        const err = error;
        res.status(400).json({ error: err.message });
    }
};
exports.send = send;
const conversation = async (req, res) => {
    try {
        const { page = '1', limit = '20' } = req.query;
        const messages = await (0, message_service_1.getConversation)(req.user.id_usuario, parseInt(req.params.userId), parseInt(page), parseInt(limit));
        res.json(messages);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.conversation = conversation;
const conversations = async (req, res) => {
    try {
        const conversations = await (0, message_service_1.getUserConversations)(req.user.id_usuario);
        res.json(conversations);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.conversations = conversations;
