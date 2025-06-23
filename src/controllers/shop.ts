import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

class ShopController {
  private prisma = new PrismaClient();

  public getVoiceStylesStore = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      let ownedVoiceStyleIds = new Set<number>();

      if (userId) {
        const userVoiceStyles = await this.prisma.userVoiceStyle.findMany({
          where: { userId: userId },
          select: { voiceStyleId: true },
        });
        ownedVoiceStyleIds = new Set(
          userVoiceStyles.map((style) => style.voiceStyleId)
        );
      }

      const allVoiceStyles = await this.prisma.voiceStyle.findMany({
        include: {
          price: true,
        },
      });

      const voiceStylesWithOwnership = allVoiceStyles.map((style) => ({
        id: style.id,
        name: style.name,
        ttsVoiceId: style.ttsVoiceId,
        createdAt: style.createdAt,
        updatedAt: style.updatedAt,
        price: style.price?.price ?? null,
        isOwned: ownedVoiceStyleIds.has(style.id),
      }));

      res.status(200).json(voiceStylesWithOwnership);
    } catch (error) {
      console.error('Error fetching voice styles store:', error);
      res.status(500).json({ error: 'Failed to fetch voice styles store' });
    }
  };

  public getIconFramesStore = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      let ownedIconFrameIds = new Set<number>();

      if (userId) {
        const userIconFrames = await this.prisma.userIconFrame.findMany({
          where: { userId: userId },
          select: { iconFrameId: true },
        });
        ownedIconFrameIds = new Set(
          userIconFrames.map((frame) => frame.iconFrameId)
        );
      }

      const allIconFrames = await this.prisma.iconFrame.findMany({
        include: {
          price: true,
        },
      });

      const iconFramesWithOwnership = allIconFrames.map((frame) => ({
        id: frame.id,
        name: frame.name,
        imgUrl: frame.imgUrl,
        createdAt: frame.createdAt,
        updatedAt: frame.updatedAt,
        price: frame.price?.price ?? null,
        isOwned: ownedIconFrameIds.has(frame.id),
      }));

      res.status(200).json(iconFramesWithOwnership);
    } catch (error) {
      console.error('Error fetching icon frames store:', error);
      res.status(500).json({ error: 'Failed to fetch icon frames store' });
    }
  };

  public purchaseIconFrame = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { iconFrameId } = req.body;
    if (!iconFrameId || isNaN(Number(iconFrameId))) {
      res.status(400).json({ error: "iconFrameIdは必須です" });
      return;
    }
    try {
      // アイコンフレームが存在するかチェック
      const iconFrame = await this.prisma.iconFrame.findUnique({ where: { id: Number(iconFrameId) } });
      if (!iconFrame) {
          res.status(404).json({ error: "アイコンフレームが存在しません" });
          return;
      }
      // すでに所有しているかチェック
      const alreadyOwned = await this.prisma.userIconFrame.findUnique({
        where: { userId_iconFrameId: { userId: String(userId), iconFrameId: Number(iconFrameId) } },
      });
      if (alreadyOwned) {
        res.status(400).json({ error: "すでにこのアイコンフレームを所有しています" });
        return;
      }
      // 購入処理（UserIconFrameに追加）
      await this.prisma.userIconFrame.create({
        data: {
          userId: String(userId),
          iconFrameId: Number(iconFrameId),
        },
      });
      res.status(200).json({ message: "アイコンフレームを購入しました" });
    } catch (error) {
      console.error("Error purchasing icon frame:", error);
      res.status(500).json({ error: "Failed to purchase icon frame" });
    }
  };

  public purchaseVoiceStyle = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { voiceStyleId } = req.body;
    if (!voiceStyleId || isNaN(Number(voiceStyleId))) {
      res.status(400).json({ error: "voiceStyleIdは必須です" });
      return;
    }
    try {
      // ボイススタイルが存在するかチェック
      const voiceStyle = await this.prisma.voiceStyle.findUnique({ where: { id: Number(voiceStyleId) } });
      if (!voiceStyle) {
        res.status(404).json({ error: "ボイススタイルが存在しません" });
        return;
      }
      // すでに所有しているかチェック
      const alreadyOwned = await this.prisma.userVoiceStyle.findUnique({
        where: { userId_voiceStyleId: { userId: String(userId), voiceStyleId: Number(voiceStyleId) } },
      });
      if (alreadyOwned) {
        res.status(400).json({ error: "すでにこのボイススタイルを所有しています" });
        return;
      }
      // 購入処理（UserVoiceStyleに追加）
      await this.prisma.userVoiceStyle.create({
        data: {
          userId: String(userId),
          voiceStyleId: Number(voiceStyleId),
        },
      });
      res.status(200).json({ message: "ボイススタイルを購入しました" });
    } catch (error) {
      console.error("Error purchasing voice style:", error);
      res.status(500).json({ error: "Failed to purchase voice style" });
    }
  };
}

export default new ShopController(); 