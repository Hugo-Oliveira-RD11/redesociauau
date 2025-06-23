"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const post_controller_1 = require("../controllers/post.controller");
const fileUpload_1 = require("../utils/fileUpload");
const wrap_1 = require("../utils/wrap");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.authenticate, (0, wrap_1.wrap)(post_controller_1.create));
router.post('/upload', auth_middleware_1.authenticate, fileUpload_1.upload.single('image'), (0, wrap_1.wrap)(post_controller_1.uploadImagePost));
router.get('/', auth_middleware_1.authenticate, (0, wrap_1.wrap)(post_controller_1.list));
router.get('/feed', auth_middleware_1.authenticate, (0, wrap_1.wrap)(post_controller_1.feed));
router.post('/:postId/react', auth_middleware_1.authenticate, (0, wrap_1.wrap)(post_controller_1.react));
router.delete('/:postId', auth_middleware_1.authenticate, (0, wrap_1.wrap)(post_controller_1.remove));
exports.default = router;
