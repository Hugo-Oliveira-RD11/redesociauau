"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const tag_controller_1 = require("../controllers/tag.controller");
const wrap_1 = require("../utils/wrap");
const router = express_1.default.Router();
router.post('/', auth_middleware_1.authenticate, (0, wrap_1.wrap)(tag_controller_1.addTag));
router.delete('/:tagId', auth_middleware_1.authenticate, (0, wrap_1.wrap)(tag_controller_1.removeTag));
router.get('/user/:userId', auth_middleware_1.authenticate, (0, wrap_1.wrap)(tag_controller_1.getUserTagsController));
router.get('/search', auth_middleware_1.authenticate, (0, wrap_1.wrap)(tag_controller_1.search));
router.get('/popular', auth_middleware_1.authenticate, (0, wrap_1.wrap)(tag_controller_1.popular));
exports.default = router;
