import { Request, Response, RequestHandler, NextFunction } from "express";
import {
  getUserById,
  updateUserProfile,
  followUser,
  unfollowUser,
  getUserConnections,
  updateUserProfilePicture,
  searchUsers,
  getUserGroups,
} from "../services/user.service";
import { upload } from "../utils/fileUpload";
import { sendNotification } from "../services/notification.service";
import { IRequest } from "@/types";

export const getProfile = async (
  req: IRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await getUserById(parseInt(req.params.userId));

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    const [connections, groups] = await Promise.all([
      getUserConnections(parseInt(req.params.userId)),
      getUserGroups(parseInt(req.params.userId)),
    ]);

    res.json({
      ...user,
      following: connections.following,
      followers: connections.followers,
      groups,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ error: error.message });
    } else {
      console.error("Unknown profile fetch error:", error);
      res.status(500).json({ error: "Erro desconhecido ao buscar perfil" });
    }
  }
};

export const updateProfile = async (req: IRequest, res: Response) => {
  try {
    const updatedUser = await updateUserProfile(req.user.id_usuario, req.body);
    res.json(updatedUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export const uploadProfilePicture = async (
  req: IRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Nenhuma imagem enviada" });
      return;
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const updatedUser = await updateUserProfilePicture(
      req.user.id_usuario,
      imagePath
    );

    res.json(updatedUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Profile picture upload error:", error);
      res.status(400).json({ error: error.message });
    } else {
      console.error("Unknown error:", error);
      res
        .status(500)
        .json({ error: "Erro desconhecido ao atualizar foto de perfil" });
    }
  }
};

export const follow = async (req: IRequest, res: Response) => {
  try {
    await followUser(req.user.id_usuario, parseInt(req.params.userId));

    // Notificar o usuário seguido
    await sendNotification(
      parseInt(req.params.userId),
      `${req.user.nome_usuario} começou a te seguir`,
      { type: "follow", userId: req.user.id_usuario }
    );

    res.status(204).end();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export const unfollow = async (req: IRequest, res: Response) => {
  try {
    await unfollowUser(req.user.id_usuario, parseInt(req.params.userId));
    res.status(204).end();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};

export const search = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { q, page = "1", limit = "10" } = req.query;

    if (!q || typeof q !== "string") {
      res.status(400).json({ error: "Parâmetro de busca inválido" });
      return;
    }

    const users = await searchUsers(
      q,
      parseInt(page as string),
      parseInt(limit as string)
    );
    res.json(users);
  } catch (error) {
    next(error);
  }
};
