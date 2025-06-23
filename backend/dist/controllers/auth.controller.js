"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const app_1 = require("../app");
const register = async (req, res) => {
    try {
        const { email, nome, password, birthDate } = req.body;
        // Verificar se usuário já existe
        const existingUser = await app_1.prisma.usuario.findFirst({
            where: { OR: [{ email }, { nome: nome }] },
        });
        if (existingUser)
            res.status(400).json({ error: "Email ou nome de usuário já em uso" });
        const user = await (0, auth_service_1.registerUser)(email, nome, password, new Date(birthDate));
        res.status(201).json({
            id: user.id_usuario,
            nome: user.nome_usuario,
            email: user.email,
        });
    }
    catch (error) {
        const err = error;
        res.status(400).json({ error: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await (0, auth_service_1.loginUser)(email, password);
        res.json({
            user: {
                id: userData.id,
                nome: userData.nome,
                email: userData.email,
                token: userData.token,
            },
        });
    }
    catch (error) {
        const err = error;
        res.status(401).json({ error: err.message });
    }
};
exports.login = login;
const me = async (req, res) => {
    try {
        const user = await app_1.prisma.usuario.findUnique({
            where: { id_usuario: req.user.id_usuario },
            select: {
                id_usuario: true,
                nome_usuario: true,
                email: true,
                foto_perfil: true,
                data_nascimento: true,
                tags: true,
            },
        });
        if (!user)
            res.status(404).json({ error: "Usuário não encontrado" });
        res.json(user);
    }
    catch (error) {
        const err = error;
        res.status(500).json({ error: err.message });
    }
};
exports.me = me;
