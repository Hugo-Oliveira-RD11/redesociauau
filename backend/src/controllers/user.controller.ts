import { Request, Response, RequestHandler, NextFunction } from 'express';
import {
  getUserById,
  updateUserProfile,
  followUser,
  unfollowUser,
  getUserConnections,
  updateUserProfilePicture,
  searchUsers,
  getUserGroups
} from '../services/user.service';
import { upload } from '../utils/fileUpload';
import { sendNotification } from '../services/notification.service';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(parseInt(req.params.userId));

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const [connections, groups] = await Promise.all([
      getUserConnections(parseInt(req.params.userId)),
      getUserGroups(parseInt(req.params.userId))
    ]);

    res.json({
      ...user,
      following: connections.following,
      followers: connections.followers,
      groups
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updatedUser = await updateUserProfile(req.user.id_usuario, req.body);
    res.json(updatedUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const updatedUser = await updateUserProfilePicture(req.user.id_usuario, imagePath);

    res.json(updatedUser);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const follow = async (req: Request, res: Response) => {
  try {
    await followUser(req.user.id_usuario, parseInt(req.params.userId));

    // Notificar o usuário seguido
    await sendNotification(
      parseInt(req.params.userId),
      `${req.user.nome_usuario} começou a te seguir`,
      { type: 'follow', userId: req.user.id_usuario }
    );

    res.status(204).end();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const unfollow = async (req: Request, res: Response) => {
  try {
    await unfollowUser(req.user.id_usuario, parseInt(req.params.userId));
    res.status(204).end();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
};

export const search: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, page = '1', limit = '10' } = req.query;

    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'Parâmetro de busca inválido' });
      return;
    }

    const users = await searchUsers(q, parseInt(page as string), parseInt(limit as string));
    res.json(users);
  } catch (error) {
    next(error);
  }
};
