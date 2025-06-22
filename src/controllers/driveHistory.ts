import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class DriveHistoryController {
  public getDriveHistory = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const histories = await prisma.drivingHistory.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      const responseHistories = histories.map((history) => ({
        ...history,
        drivingMileage: history.drivingMileage?.toNumber() ?? null,
      }));

      res.status(200).json(responseHistories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public addDriveHistory = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { drivingMileage, durationTime, routeData } = req.body;
    if (drivingMileage == null || durationTime == null) {
      res.status(400).json({ error: "drivingMileageとdurationTimeは必須です" });
      return;
    }
    try {
      const newHistory = await prisma.drivingHistory.create({
        data: {
          userId,
          drivingMileage,
          durationTime,
          routeData: routeData ?? null,
        },
      });
      res.status(201).json(newHistory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
} 