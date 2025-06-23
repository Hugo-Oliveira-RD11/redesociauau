"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const app_1 = require("../app");
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({
            error: 'Não autorizado',
            message: 'Token de acesso não fornecido'
        });
        return;
    }
    jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET, (err, decoded) => {
        if (err) {
            handleJwtError(err, res);
            return;
        }
        const { userId } = decoded;
        app_1.prisma.usuario.findUnique({
            where: { id_usuario: userId }
        }).then((user) => {
            if (!user) {
                res.status(401).json({
                    error: 'Não autorizado',
                    message: 'Usuário não encontrado'
                });
                return;
            }
            req.user = user;
            next();
        })
            .catch((error) => {
            console.error('Erro na autenticação:', error);
            res.status(500).json({
                error: 'Erro interno',
                message: 'Ocorreu um erro durante a autenticação'
            });
        });
    });
};
exports.authenticate = authenticate;
function handleJwtError(err, res) {
    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            error: 'Não autorizado',
            message: 'Token expirado'
        });
    }
    else if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            error: 'Não autorizado',
            message: 'Token inválido'
        });
    }
    else {
        console.error('Erro na verificação do token:', err);
        res.status(500).json({
            error: 'Erro interno',
            message: 'Erro ao verificar token'
        });
    }
}
