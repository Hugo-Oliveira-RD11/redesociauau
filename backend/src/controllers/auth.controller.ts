import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { sendNotification } from "../services/notification.service";
import { prisma } from "../app";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, nome, password, birthDate } = req.body;

    // Verificar se usuário já existe
    const existingUser = await prisma.usuario.findFirst({
      where: { OR: [{ email }, { nome: nome }] },
    });

    if (existingUser)
      res.status(400).json({ error: "Email ou nome de usuário já em uso" });

    const user = await registerUser(email, nome, password, new Date(birthDate));

    res.status(201).json({
      id: user.id_usuario,
      nome: user.nome_usuario,
      email: user.email,
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userData = await loginUser(email, password);

    res.json({
      user: {
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        token: userData.token,
      },
    });
  } catch (error) {
    const err = error as Error;
    res.status(401).json({ error: err.message });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const user = await prisma.usuario.findUnique({
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

    if (!user) res.status(404).json({ error: "Usuário não encontrado" });

    res.json(user);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};
