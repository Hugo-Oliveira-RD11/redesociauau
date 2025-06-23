"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.react = exports.feed = exports.list = exports.uploadImagePost = exports.create = void 0;
const post_service_1 = require("../services/post.service");
const create = async (req, res) => {
    try {
        const { content, type, groupId } = req.body;
        const post = await (0, post_service_1.createPost)({
            postado_por: req.user.id_usuario,
            conteudo: content,
            tipo: type,
            id_grupo: groupId ? parseInt(groupId) : null,
            midia: req.file ? `/uploads/${req.file.filename}` : null
        });
        res.status(201).json(post);
    }
    catch (error) {
        const err = error;
        res.status(400).json({ error: err.message });
    }
};
exports.create = create;
const uploadImagePost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada' });
        }
        const imagePath = `/uploads/${req.file.filename}`;
        const post = await (0, post_service_1.createPost)({
            postado_por: req.user.id_usuario,
            conteudo: req.body.content || '',
            tipo: 'image',
            id_grupo: req.body.groupId ? parseInt(req.body.groupId) : null,
            midia: req.file ? `/uploads/${req.file.filename}` : null
        });
        res.status(201).json(post);
    }
    catch (error) {
        const err = error;
        res.status(400).json({ error: err.message });
    }
};
exports.uploadImagePost = uploadImagePost;
const list = async (req, res) => {
    try {
        const { page = '1', limit = '10', groupId } = req.query;
        const posts = await (0, post_service_1.getPosts)({
            userId: req.user.id_usuario, // Se precisar filtrar por usuário
            groupId: groupId ? parseInt(groupId) : undefined,
            page: parseInt(page),
            limit: parseInt(limit)
        });
        res.json(posts);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.list = list;
const feed = async (req, res) => {
    try {
        const { page = '1', limit = '10' } = req.query;
        const posts = await (0, post_service_1.getFeed)(req.user.id_usuario, parseInt(page), parseInt(limit));
        res.json(posts);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.feed = feed;
const react = async (req, res) => {
    try {
        const { reaction } = req.body;
        const post = await (0, post_service_1.reactToPost)(req.user.id_usuario, parseInt(req.params.postId), reaction);
        res.json(post);
    }
    catch (error) {
        const err = error;
        res.status(400).json({ error: err.message });
    }
};
exports.react = react;
const remove = async (req, res) => {
    try {
        await (0, post_service_1.deletePost)(req.user.id_usuario, parseInt(req.params.postId));
        res.status(204).end();
    }
    catch (error) {
        const err = error;
        res.status(400).json({ error: err.message });
    }
};
exports.remove = remove;
