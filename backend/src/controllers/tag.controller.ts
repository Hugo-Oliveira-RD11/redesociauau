import { Request, Response } from 'express';
import {
  addUserTag,
  removeUserTag,
  getUserTags,
  searchByTags,
  getPopularTags
} from '../services/tag.service';

export const addTag = async (req: Request, res: Response) => {
  try {
    const { tagName } = req.body;
    const userTag = await addUserTag(req.user.id_usuario, tagName);
    res.status(201).json(userTag);
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const removeTag = async (req: Request, res: Response) => {
  try {
    await removeUserTag(req.user.id_usuario, parseInt(req.params.tagId));
    res.status(204).end();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};

export const getUserTagController = async (req: Request, res: Response) => {
  try {
    const tags = await getUserTags(parseInt(req.params.userId));
    res.json(tags);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

// tag.controller.ts
export const search = async (req: Request, res: Response): Promise<void> => {
  const { tags, page = '1', limit = '10' } = req.query;
  if (!tags || typeof tags !== 'string') {
    res.status(400).json({ error: 'Parâmetro de tags inválido' });
    return;
  }
  const tagArray = tags.split(',');
  const pageNumber = parseInt(page as string) || 1;
  const limitNumber = parseInt(limit as string) || 10;

  const users = await searchByTags(tagArray, pageNumber, limitNumber);

  res.json({
    data: users,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      totalResults: users.length
    }
  });
};

export const popular = async (req: Request, res: Response) => {
  try {
    const { limit = '10' } = req.query;
    const tags = await getPopularTags(parseInt(limit as string));
    res.json(tags);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};
