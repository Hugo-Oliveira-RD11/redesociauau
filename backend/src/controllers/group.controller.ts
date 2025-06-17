import { Request, Response } from 'express';
import {
  createGroup,
  joinGroup,
  removeGroupMember,
  getGroupPosts,
  searchGroups
} from '../services/group.service';

import { addGroupMember as serviceAddGroupMember } from '../services/group.service';
import { deleteGroup as serviceDeleteGroup } from '../services/group.service';

export const create = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const group = await createGroup(req.user.id_usuario, name, description);
    res.status(201).json(group);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const join = async (req: Request, res: Response) => {
  try {
    const membership = await joinGroup(
      parseInt(req.params.groupId),
      req.user.id_usuario
    );
    res.status(201).json(membership);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const addMember = async (req: Request, res: Response) => {
  try {
    const { userId, role = 'MEMBER' } = req.body;
    const membership = await serviceAddGroupMember(
      req.user.id_usuario,
      parseInt(req.params.groupId),
      parseInt(userId),
      role
    );
    res.status(201).json(membership);
  } catch (error) {
    const err = error as Error;
    res.status(403).json({ error: err.message });
  }
};

export const removeMember = async (req: Request, res: Response) => {
  try {
    await removeGroupMember(
      req.user.id_usuario,
      parseInt(req.params.groupId),
      parseInt(req.params.userId)
    );
    res.status(204).end();
  } catch (error) {
    const err = error as Error;
    res.status(403).json({ error: err.message });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  try {
    await serviceDeleteGroup(
      req.user.id_usuario,
      parseInt(req.params.groupId)
    );
    res.status(204).end();
  } catch (error) {
    const err = error as Error;
    res.status(403).json({ error: err.message });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10' } = req.query;
    const posts = await getGroupPosts(
      parseInt(req.params.groupId),
      parseInt(page as string),
      parseInt(limit as string)
    );
    res.json(posts);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, page = '1', limit = '10' } = req.query;
    if (!q || typeof q !== 'string') {
      res.status(400).json({ error: 'O parâmetro "q" é obrigatório' });
      return;
    }
    const result = await searchGroups(
      q,
      parseInt(page as string) || 1,
      parseInt(limit as string) || 10
    );
    res.json(result);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Erro na busca' });
  }
};
