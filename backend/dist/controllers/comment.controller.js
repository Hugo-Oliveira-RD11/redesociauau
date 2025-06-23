"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.react = exports.list = exports.create = void 0;
const comment_service_1 = require("../services/comment.service");
const create = async (req, res) => {
    try {
        const { content, parentId } = req.body;
        const comment = await (0, comment_service_1.createComment)(req.user.id_usuario, parseInt(req.params.postId), content, parentId ? parseInt(parentId) : undefined);
        res.status(201).json(comment);
    }
    catch (error) {
        const err = error;
        res.status(400).json({ error: err.message });
    }
};
exports.create = create;
const list = async (req, res) => {
    try {
        const { page = '1', limit = '10' } = req.query;
        const comments = await (0, comment_service_1.getPostComments)(parseInt(req.params.postId), parseInt(page), parseInt(limit));
        res.json(comments);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.list = list;
const react = async (req, res) => {
    try {
        const { reaction } = req.body;
        const comment = await (0, comment_service_1.reactToComment)(req.user.id_usuario, parseInt(req.params.commentId), reaction);
        res.json(comment);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.react = react;
