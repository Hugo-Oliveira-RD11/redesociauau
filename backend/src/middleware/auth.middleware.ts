import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { prisma } from '../app';

type Usuario = Awaited<ReturnType<typeof prisma.usuario.findUnique>>;

interface AuthRequest extends Request {
  user?: Usuario;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({
      error: 'Não autorizado',
      message: 'Token de acesso não fornecido'
    });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err: jwt.VerifyErrors | null, decoded: unknown) => {
    if (err) {
      handleJwtError(err, res);
      return;
    }

    const { userId } = decoded as { userId: number };

    prisma.usuario.findUnique({
      where: { id_usuario: userId }
    }).then((user: Usuario) => {
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
    .catch((error: Error) => {
      console.error('Erro na autenticação:', error);
      res.status(500).json({
        error: 'Erro interno',
        message: 'Ocorreu um erro durante a autenticação'
      });
    });
  });
};

function handleJwtError(err: jwt.VerifyErrors, res: Response): void {
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'Não autorizado',
      message: 'Token expirado'
    });
  } else if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'Não autorizado',
      message: 'Token inválido'
    });
  } else {
    console.error('Erro na verificação do token:', err);
    res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao verificar token'
    });
  }
}
