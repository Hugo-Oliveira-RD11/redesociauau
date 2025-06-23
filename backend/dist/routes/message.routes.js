"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const message_controller_1 = require("../controllers/message.controller");
const router = express_1.default.Router();
router.post('/:userId', auth_middleware_1.authenticate, message_controller_1.send);
router.get('/:userId', auth_middleware_1.authenticate, message_controller_1.conversation);
router.get('/', auth_middleware_1.authenticate, message_controller_1.conversations);
exports.default = router;
