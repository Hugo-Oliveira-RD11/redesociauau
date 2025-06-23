"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.getPosts = exports.removeMember = exports.addMember = exports.create = void 0;
const group_service_1 = require("../services/group.service");
const create = async (req, res) => {
    const { name, description } = req.body;
    const group = await (0, group_service_1.createGroup)(req.user.id_usuario, name, description);
    res.status(201).json(group);
};
exports.create = create;
const addMember = async (req, res) => {
    const { userId, role = 'MEMBER' } = req.body;
    const membership = await (0, group_service_1.addGroupMember)(parseInt(req.params.groupId), parseInt(userId), role);
    res.status(201).json(membership);
};
exports.addMember = addMember;
const removeMember = async (req, res) => {
    await (0, group_service_1.removeGroupMember)(parseInt(req.params.groupId), parseInt(req.params.userId));
    res.status(204).end();
};
exports.removeMember = removeMember;
const getPosts = async (req, res) => {
    const { page = '1', limit = '10' } = req.query;
    const posts = await (0, group_service_1.getGroupPosts)(parseInt(req.params.groupId), parseInt(page), parseInt(limit));
    res.json(posts);
};
exports.getPosts = getPosts;
const search = async (req, res) => {
    const { q, page = '1', limit = '10' } = req.query;
    if (!q || typeof q !== 'string') {
        res.status(400).json({ error: 'Parâmetro de busca inválido' });
        return;
    }
    const groups = await (0, group_service_1.searchGroups)(q, parseInt(page), parseInt(limit));
    res.json(groups);
};
exports.search = search;
