import { Request, Response } from 'express';
import {
  createGroup,
  addGroupMember,
  removeGroupMember,
  getGroupPosts,
  searchGroups
} from '../services/group.service';
import { sendNotification } from '../services/notification.service';

export const create = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const group = await createGroup(req.user.id_usuario, name, description);
  res.status(201).json(group);
};

export const addMember = async (req: Request, res: Response) => {
  const { userId, role = 'MEMBER' } = req.body;
  const membership = await addGroupMember(
    parseInt(req.params.groupId),
    parseInt(userId),
    role
  );
  res.status(201).json(membership);
};

export const removeMember = async (req: Request, res: Response) => {
  await removeGroupMember(
    parseInt(req.params.groupId),
    parseInt(req.params.userId)
  );
  res.status(204).end();
};

export const getPosts = async (req: Request, res: Response) => {
  const { page = '1', limit = '10' } = req.query;
  const posts = await getGroupPosts(
    parseInt(req.params.groupId),
    parseInt(page as string),
    parseInt(limit as string)
  );
  res.json(posts);
};

export const search = async (req: Request, res: Response) => {
  const { q, page = '1', limit = '10' } = req.query;
  if (!q || typeof q !== 'string') {
    res.status(400).json({ error: 'Parâmetro de busca inválido' });
    return;
  }
  const groups = await searchGroups(
    q,
    parseInt(page as string),
    parseInt(limit as string)
  );
  res.json(groups);
};
