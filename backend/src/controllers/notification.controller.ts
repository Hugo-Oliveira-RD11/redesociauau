import { Request, Response } from "express";
import {
  getUserNotifications,
  markNotificationAsRead,
} from "../services/notification.service";
import { IRequest } from "@/types";

export const list = async (req: IRequest, res: Response) => {
  try {
    const { limit = "20" } = req.query;
    const notifications = await getUserNotifications(
      req.user.id_usuario,
      parseInt(limit as string)
    );

    res.json(notifications);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req: IRequest, res: Response) => {
  try {
    await markNotificationAsRead(parseInt(req.params.notificationId));
    res.status(204).end();
  } catch (error) {
    const err = error as Error;
    res.status(400).json({ error: err.message });
  }
};
