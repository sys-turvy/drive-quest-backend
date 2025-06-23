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
}

export default new ShopController(); 