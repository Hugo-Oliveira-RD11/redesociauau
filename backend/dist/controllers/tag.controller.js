"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.popular = exports.search = exports.getUserTagsController = exports.removeTag = exports.addTag = void 0;
const tag_service_1 = require("../services/tag.service");
const addTag = async (req, res) => {
    try {
        const { tagName } = req.body;
        const userTag = await (0, tag_service_1.addUserTag)(req.user.id_usuario, tagName);
        res.status(201).json(userTag);
    }
    catch (error) {
        const err = error;
        res.status(400).json({ error: err.message });
    }
};
exports.addTag = addTag;
const removeTag = async (req, res) => {
    try {
        await (0, tag_service_1.removeUserTag)(req.user.id_usuario, parseInt(req.params.tagId));
        res.status(204).end();
    }
    catch (error) {
        const err = error;
        res.status(400).json({ error: err.message });
    }
};
exports.removeTag = removeTag;
const getUserTagsController = async (req, res) => {
    try {
        const tags = await (0, tag_service_1.getUserTags)(parseInt(req.params.userId));
        res.json(tags);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.getUserTagsController = getUserTagsController;
const search = async (req, res) => {
    try {
        const { tags, page = '1', limit = '10' } = req.query;
        if (!tags || typeof tags !== 'string') {
            return res.status(400).json({ error: 'Parâmetro de tags inválido' });
        }
        const tagArray = tags.split(',');
        const users = await (0, tag_service_1.searchByTags)(tagArray, parseInt(page), parseInt(limit));
        res.json(users);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.search = search;
const popular = async (req, res) => {
    try {
        const { limit = '10' } = req.query;
        const tags = await (0, tag_service_1.getPopularTags)(parseInt(limit));
        res.json(tags);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.popular = popular;
