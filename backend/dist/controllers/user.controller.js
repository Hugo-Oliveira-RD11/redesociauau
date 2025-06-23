"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.unfollow = exports.follow = exports.uploadProfilePicture = exports.updateProfile = exports.getProfile = void 0;
const user_service_1 = require("../services/user.service");
const notification_service_1 = require("../services/notification.service");
const getProfile = async (req, res) => {
    try {
        const user = await (0, user_service_1.getUserById)(parseInt(req.params.userId));
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const [connections, groups] = await Promise.all([
            (0, user_service_1.getUserConnections)(parseInt(req.params.userId)),
            (0, user_service_1.getUserGroups)(parseInt(req.params.userId))
        ]);
        res.json({
            ...user,
            following: connections.following,
            followers: connections.followers,
            groups
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const updatedUser = await (0, user_service_1.updateUserProfile)(req.user.id_usuario, req.body);
        res.json(updatedUser);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
};
exports.updateProfile = updateProfile;
const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhuma imagem enviada' });
        }
        const imagePath = `/uploads/${req.file.filename}`;
        const updatedUser = await (0, user_service_1.updateUserProfilePicture)(req.user.id_usuario, imagePath);
        res.json(updatedUser);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
};
exports.uploadProfilePicture = uploadProfilePicture;
const follow = async (req, res) => {
    try {
        await (0, user_service_1.followUser)(req.user.id_usuario, parseInt(req.params.userId));
        // Notificar o usuário seguido
        await (0, notification_service_1.sendNotification)(parseInt(req.params.userId), `${req.user.nome_usuario} começou a te seguir`, { type: 'follow', userId: req.user.id_usuario });
        res.status(204).end();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
};
exports.follow = follow;
const unfollow = async (req, res) => {
    try {
        await (0, user_service_1.unfollowUser)(req.user.id_usuario, parseInt(req.params.userId));
        res.status(204).end();
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        }
        else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
};
exports.unfollow = unfollow;
const search = async (req, res, next) => {
    try {
        const { q, page = '1', limit = '10' } = req.query;
        if (!q || typeof q !== 'string') {
            res.status(400).json({ error: 'Parâmetro de busca inválido' });
            return;
        }
        const users = await (0, user_service_1.searchUsers)(q, parseInt(page), parseInt(limit));
        res.json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.search = search;
