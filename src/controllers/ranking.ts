import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { startOfWeek, endOfWeek } from 'date-fns';

class RankingController {
  private prisma = new PrismaClient();

  public getWeeklyFriendRanking = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // 1. 友達リストを取得
      const friendships = await this.prisma.friendship.findMany({
        where: {
          userId: userId,
        },
      });

      const friendIds = friendships.map((f) => f.friendId);
      const userIdsToRank = [...new Set([userId, ...friendIds])];

      // 2. 今週（月曜始まり）のデータを集計
      const now = new Date();
      const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
      const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 });

      const weeklyDistances = await this.prisma.drivingHistory.groupBy({
        by: ['userId'],
        where: {
          userId: { in: userIdsToRank },
          createdAt: {
            gte: startOfThisWeek,
            lte: endOfThisWeek,
          },
        },
        _sum: {
          drivingMileage: true,
        },
      });

      // 3. 走行距離をMapに格納
      const distanceMap = new Map(
        weeklyDistances.map((d) => [d.userId, d._sum.drivingMileage])
      );

      // 4. ランク対象の全ユーザー情報を取得
      const allUsersInRank = await this.prisma.user.findMany({
        where: { id: { in: userIdsToRank } },
        select: { id: true, userName: true, userIconUrl: true },
      });

      // 5. ランキングデータを生成（走行距離0のユーザーも含む）
      const rankedUsers = allUsersInRank
        .map((user) => {
          const distance = distanceMap.get(user.id);
          return {
            user: {
              id: user.id,
              userName: user.userName,
              userIconUrl: user.userIconUrl,
            },
            distance: distance ? Number(distance) : 0,
          };
        })
        .sort((a, b) => b.distance - a.distance);

      // 6. タイ順位で順位を付与
      let prevDistance: number | null = null;
      let prevRank = 0;
      let sameRankCount = 0;
      const ranking = rankedUsers.map((item, index) => {
        if (prevDistance === item.distance) {
          sameRankCount++;
        } else {
          prevRank = prevRank + sameRankCount + 1;
          sameRankCount = 0;
        }
        prevDistance = item.distance;
        return {
          rank: prevRank,
          ...item,
        };
      });

      // 7. 自分のランキング情報を抽出
      const myRank = ranking.find((item) => item.user.id === userId) || null;

      res.status(200).json({ ranking, myRank });
    } catch (error) {
      console.error('Error fetching weekly friend ranking:', error);
      res.status(500).json({ error: 'Failed to fetch weekly friend ranking' });
    }
  };

  public getMonthlyFriendRanking = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      // 1. 友達リストを取得
      const friendships = await this.prisma.friendship.findMany({
        where: {
          userId: userId,
        },
      });
      const friendIds = friendships.map((f) => f.friendId);
      const userIdsToRank = [...new Set([userId, ...friendIds])];

      // 2. 今月の期間を計算
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

      // 3. 月間走行距離を集計
      const monthlyDistances = await this.prisma.drivingHistory.groupBy({
        by: ['userId'],
        where: {
          userId: { in: userIdsToRank },
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: {
          drivingMileage: true,
        },
      });

      // 4. 走行距離をMapに格納
      const distanceMap = new Map(
        monthlyDistances.map((d) => [d.userId, d._sum.drivingMileage])
      );

      // 5. ランク対象の全ユーザー情報を取得
      const allUsersInRank = await this.prisma.user.findMany({
        where: { id: { in: userIdsToRank } },
        select: { id: true, userName: true, userIconUrl: true },
      });

      // 6. ランキングデータを生成（走行距離0のユーザーも含む）
      const rankedUsers = allUsersInRank
        .map((user) => {
          const distance = distanceMap.get(user.id);
          return {
            user: {
              id: user.id,
              userName: user.userName,
              userIconUrl: user.userIconUrl,
            },
            distance: distance ? Number(distance) : 0,
          };
        })
        .sort((a, b) => b.distance - a.distance);

      // 7. タイ順位で順位を付与
      let prevDistance: number | null = null;
      let prevRank = 0;
      let sameRankCount = 0;
      const ranking = rankedUsers.map((item, index) => {
        if (prevDistance === item.distance) {
          sameRankCount++;
        } else {
          prevRank = prevRank + sameRankCount + 1;
          sameRankCount = 0;
        }
        prevDistance = item.distance;
        return {
          rank: prevRank,
          ...item,
        };
      });

      // 8. 自分のランキング情報を抽出
      const myRank = ranking.find((item) => item.user.id === userId) || null;

      res.status(200).json({ ranking, myRank });
    } catch (error) {
      console.error('Error fetching monthly friend ranking:', error);
      res.status(500).json({ error: 'Failed to fetch monthly friend ranking' });
    }
  };
}

export default new RankingController(); 