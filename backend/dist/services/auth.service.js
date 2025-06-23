"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
const config_1 = require("../config");
const registerUser = async (email, nome, password, birthDate) => {
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    return app_1.prisma.usuario.create({
        data: {
            email,
            nome: nome,
            data_nascimento: birthDate,
            tags: "",
            foto_perfil: "default.jpg",
            password: hashedPassword,
        },
    });
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await app_1.prisma.usuario.findUnique({ where: { email } });
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id_usuario }, config_1.JWT_SECRET, {
        expiresIn: "24h",
    });
    return {
        id: user.id_usuario,
        nome: user.nome,
        email: user.email,
        token,
    };
};
exports.loginUser = loginUser;
