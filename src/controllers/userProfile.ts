import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserProfileController {
  public getProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const profile = await prisma.userProfile.findUnique({
        where: { userId },
        include: {
          user: true,
          selectedTitle: true,
          selectedIconFrame: true,
          selectedVoiceStyle: true,
        },
      });
      if (!profile) {
        res.status(404).json({ error: "プロフィールが見つかりません" });
        return;
      }
      // パスワードやcreatedAtなどを除外
      const { password, createdAt, updatedAt, deletedAt, ...userSafe } = profile.user;
      res.json({
        ...profile,
        user: userSafe,
      });
      return;
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
  };

  public updateName = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { userName } = req.body;
    if (typeof userName !== "string" || !userName) {
      res.status(400).json({ error: "userNameは必須です" });
      return;
    }
    try {
      await prisma.user.update({ where: { id: userId }, data: { userName } });
      res.status(200).json({ message: "名前を更新しました" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public updateTitle = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { selectedTitleId } = req.body;
    if (selectedTitleId === undefined || selectedTitleId === null) {
      res.status(400).json({ error: "selectedTitleIdは必須です" });
      return;
    }
    const titleIdNum = Number(selectedTitleId);
    if (isNaN(titleIdNum)) {
      res.status(400).json({ error: "selectedTitleIdは数値で指定してください" });
      return;
    }
    try {
      // 所有チェック
      const owned = await prisma.userTitle.findUnique({
        where: { userId_titleId: { userId: String(userId), titleId: titleIdNum } },
      });
      if (!owned) {
        res.status(400).json({ error: "所有していない称号は設定できません" });
        return;
      }
      await prisma.userProfile.update({ where: { userId }, data: { selectedTitleId: titleIdNum } });
      res.status(200).json({ message: "称号を更新しました" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public updateVoice = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { selectedVoiceStyleId } = req.body;
    if (selectedVoiceStyleId === undefined || selectedVoiceStyleId === null) {
      res.status(400).json({ error: "selectedVoiceStyleIdは必須です" });
      return;
    }
    const voiceStyleIdNum = Number(selectedVoiceStyleId);
    if (isNaN(voiceStyleIdNum)) {
      res.status(400).json({ error: "selectedVoiceStyleIdは数値で指定してください" });
      return;
    }
    try {
      // 所有チェック
      const owned = await prisma.userVoiceStyle.findUnique({
        where: { userId_voiceStyleId: { userId: String(userId), voiceStyleId: voiceStyleIdNum } },
      });
      if (!owned) {
        res.status(400).json({ error: "所有していないボイスは設定できません" });
        return;
      }
      await prisma.userProfile.update({ where: { userId }, data: { selectedVoiceStyleId: voiceStyleIdNum } });
      res.status(200).json({ message: "ボイスを更新しました" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public updateIconFrame = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { selectedIconFrameId } = req.body;
    if (selectedIconFrameId === undefined || selectedIconFrameId === null) {
      res.status(400).json({ error: "selectedIconFrameIdは必須です" });
      return;
    }
    const iconFrameIdNum = Number(selectedIconFrameId);
    if (isNaN(iconFrameIdNum)) {
      res.status(400).json({ error: "selectedIconFrameIdは数値で指定してください" });
      return;
    }
    try {
      // 所有チェック
      const owned = await prisma.userIconFrame.findUnique({
        where: { userId_iconFrameId: { userId: String(userId), iconFrameId: iconFrameIdNum } },
      });
      if (!owned) {
        res.status(400).json({ error: "所有していないアイコンフレームは設定できません" });
        return;
      }
      await prisma.userProfile.update({ where: { userId }, data: { selectedIconFrameId: iconFrameIdNum } });
      res.status(200).json({ message: "アイコンフレームを更新しました" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public updateIcon = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { userIconUrl } = req.body;
    if (typeof userIconUrl !== "string" || !userIconUrl) {
      res.status(400).json({ error: "userIconUrlは必須です" });
      return;
    }
    try {
      await prisma.user.update({ where: { id: userId }, data: { userIconUrl } });
      res.status(200).json({ message: "アイコン画像を更新しました" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public updateMonthlyGoal = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { monthlyMileageGoal } = req.body;
    if (monthlyMileageGoal === undefined || monthlyMileageGoal === null) {
      res.status(400).json({ error: "monthlyMileageGoalは必須です" });
      return;
    }
    const goalNum = Number(monthlyMileageGoal);
    if (isNaN(goalNum)) {
      res.status(400).json({ error: "monthlyMileageGoalは数値で指定してください" });
      return;
    }
    try {
      await prisma.userProfile.update({ where: { userId }, data: { monthlyMileageGoal: goalNum } });
      res.status(200).json({ message: "月目標を更新しました" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public getUserTitles = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const userTitles = await prisma.userTitle.findMany({
        where: { userId },
        include: {
          title: true,
        },
      });
      const result = userTitles.map((ut) => ({
        id: ut.title.id,
        name: ut.title.name,
        description: ut.title.description,
        createdAt: ut.title.createdAt,
        updatedAt: ut.title.updatedAt,
      }));
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching user titles:", error);
      res.status(500).json({ error: "Failed to fetch user titles" });
    }
  };

  public getUserIconFrames = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const userIconFrames = await prisma.userIconFrame.findMany({
        where: { userId },
        include: {
          iconFrame: true,
        },
      });
      const result = userIconFrames.map((uf) => ({
        id: uf.iconFrame.id,
        name: uf.iconFrame.name,
        imgUrl: uf.iconFrame.imgUrl,
        createdAt: uf.iconFrame.createdAt,
        updatedAt: uf.iconFrame.updatedAt,
      }));
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching user icon frames:", error);
      res.status(500).json({ error: "Failed to fetch user icon frames" });
    }
  };

  public getUserVoiceStyles = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const userVoiceStyles = await prisma.userVoiceStyle.findMany({
        where: { userId },
        include: {
          voiceStyle: true,
        },
      });
      const result = userVoiceStyles.map((uv) => ({
        id: uv.voiceStyle.id,
        name: uv.voiceStyle.name,
        ttsVoiceId: uv.voiceStyle.ttsVoiceId,
        createdAt: uv.voiceStyle.createdAt,
        updatedAt: uv.voiceStyle.updatedAt,
      }));
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching user voice styles:", error);
      res.status(500).json({ error: "Failed to fetch user voice styles" });
    }
  };
} 