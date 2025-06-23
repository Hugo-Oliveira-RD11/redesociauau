"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const comment_controller_1 = require("../controllers/comment.controller");
const router = express_1.default.Router();
router.post('/:postId', auth_middleware_1.authenticate, comment_controller_1.create);
router.get('/:postId', auth_middleware_1.authenticate, comment_controller_1.list);
router.post('/:commentId/react', auth_middleware_1.authenticate, comment_controller_1.react);
exports.default = router;
