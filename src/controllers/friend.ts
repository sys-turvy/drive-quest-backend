import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export class FriendController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public addFriend = async (req: Request, res: Response) => {
    const { friendId } = req.body;
    const userId = req.user?.id;

    if (!userId || !friendId) {
      res.status(400).json({ error: "userId and friendId are required" });
      return;
    }

    if (userId === friendId) {
      res.status(400).json({ error: "Cannot add yourself as a friend" });
      return;
    }

    try {
      // ユーザーの存在確認
      const users = await this.prisma.user.findMany({
        where: {
          id: { in: [userId, friendId] },
        },
      });

      if (users.length !== 2) {
        res.status(404).json({ error: "One or both users not found" });
        return;
      }

      // 既存の友達関係を確認
      const existingFriendship = await this.prisma.friendship.findUnique({
        where: {
          userId_friendId: {
            userId,
            friendId,
          },
        },
      });

      if (existingFriendship) {
        res.status(409).json({ error: "Friendship already exists" });
        return;
      }

      // トランザクションで双方向の友達関係を作成
      await this.prisma.$transaction([
        this.prisma.friendship.create({
          data: {
            userId,
            friendId,
          },
        }),
        this.prisma.friendship.create({
          data: {
            userId: friendId,
            friendId: userId,
          },
        }),
      ]);

      res.status(201).json({ message: "Friend added successfully" });
    } catch (error) {
      console.error(error);
      // Prismaのユニーク制約違反エラーをハンドリング
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
        res.status(409).json({ error: "Friendship already exists" });
        return;
      }
      res.status(500).json({ error: "Internal server error" });
    }
  };

  public getFriends = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }

    try {
      const friendships = await this.prisma.friendship.findMany({
        where: {
          userId: userId,
        },
        include: {
          friend: true,
        },
      });

      const friends = friendships.map((f) => f.friend);
      res.status(200).json(friends);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
} 