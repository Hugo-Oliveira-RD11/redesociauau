"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.list = void 0;
const notification_service_1 = require("../services/notification.service");
const list = async (req, res) => {
    try {
        const { limit = '20' } = req.query;
        const notifications = await (0, notification_service_1.getUserNotifications)(req.user.id_usuario, parseInt(limit));
        res.json(notifications);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.list = list;
const markAsRead = async (req, res) => {
    try {
        await (0, notification_service_1.markNotificationAsRead)(parseInt(req.params.notificationId));
        res.status(204).end();
    }
    catch (error) {
        const err = error;
        res.status(400).json({ error: err.message });
    }
};
exports.markAsRead = markAsRead;
