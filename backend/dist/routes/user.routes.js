"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const fileUpload_1 = require("../utils/fileUpload");
const wrap_1 = require("../utils/wrap");
const router = express_1.default.Router();
router.get('/:userId', auth_middleware_1.authenticate, (0, wrap_1.wrap)(user_controller_1.getProfile));
router.put('/profile', auth_middleware_1.authenticate, (0, wrap_1.wrap)(user_controller_1.updateProfile));
router.post('/profile/picture', auth_middleware_1.authenticate, fileUpload_1.upload.single('image'), (0, wrap_1.wrap)(user_controller_1.uploadProfilePicture));
router.post('/:userId/follow', auth_middleware_1.authenticate, (0, wrap_1.wrap)(user_controller_1.follow));
router.delete('/:userId/follow', auth_middleware_1.authenticate, (0, wrap_1.wrap)(user_controller_1.unfollow));
router.get('/search', auth_middleware_1.authenticate, (0, wrap_1.wrap)(user_controller_1.search));
exports.default = router;
