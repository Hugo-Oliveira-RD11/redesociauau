"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const notification_controller_1 = require("../controllers/notification.controller");
const router = express_1.default.Router();
router.get('/', auth_middleware_1.authenticate, notification_controller_1.list);
router.patch('/:notificationId/read', auth_middleware_1.authenticate, notification_controller_1.markAsRead);
exports.default = router;
