import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { users } from "./seed-data/users";
import { iconFrames } from "./seed-data/iconFrames";
import { voiceStyles } from "./seed-data/voiceStyles";
import { titles } from "./seed-data/titles";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // Delete all data
  await prisma.userTitle.deleteMany({});
  await prisma.userVoiceStyle.deleteMany({});
  await prisma.userIconFrame.deleteMany({});
  await prisma.userProfile.deleteMany({});
  await prisma.drivingHistory.deleteMany({});
  await prisma.friendship.deleteMany({});
  await prisma.title.deleteMany({});
  await prisma.voiceStylePrice.deleteMany({});
  await prisma.voiceStyle.deleteMany({});
  await prisma.iconFramePrice.deleteMany({});
  await prisma.iconFrame.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed Users
  const createdUsers: any[] = [];
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createdUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        userName: user.userName,
        password: hashedPassword,
      },
    });
    createdUsers.push(createdUser);
  }
  console.log(`Seeded ${createdUsers.length} users`);

  // Seed IconFrames (1件ずつcreateしてidを取得)
  const createdIconFrames: any[] = [];
  for (const frame of iconFrames) {
    const created = await prisma.iconFrame.create({ data: frame });
    createdIconFrames.push(created);
  }
  console.log(`Seeded ${createdIconFrames.length} icon frames`);

  // Seed IconFramePrices
  const iconFramePrices = [
    { price: 100 },
    { price: 200 },
    { price: 300 },
  ];
  for (let i = 0; i < createdIconFrames.length; i++) {
    await prisma.iconFramePrice.create({
      data: {
        iconFrameId: createdIconFrames[i].id,
        price: iconFramePrices[i].price,
      },
    });
  }
  console.log(`Seeded ${createdIconFrames.length} icon frame prices`);

  // Seed VoiceStyles
  const createdVoiceStyles: any[] = [];
  for (const style of voiceStyles) {
    const created = await prisma.voiceStyle.create({ data: style });
    createdVoiceStyles.push(created);
  }
  console.log(`Seeded ${createdVoiceStyles.length} voice styles`);

  // Seed VoiceStylePrices
  const voiceStylePrices = [
    { price: 0 },
    { price: 250 },
    { price: 250 },
  ];
  for (let i = 0; i < createdVoiceStyles.length; i++) {
    await prisma.voiceStylePrice.create({
      data: {
        voiceStyleId: createdVoiceStyles[i].id,
        price: voiceStylePrices[i].price,
      },
    });
  }
  console.log(`Seeded ${createdVoiceStyles.length} voice style prices`);

  // Seed Titles
  const createdTitles: any[] = [];
  for (const title of titles) {
    const created = await prisma.title.create({ data: title });
    createdTitles.push(created);
  }
  console.log(`Seeded ${createdTitles.length} titles`);

  // Seed User Profiles and Relations
  for (const user of createdUsers) {
    // Create profile
    await prisma.userProfile.create({
      data: {
        userId: user.id,
        monthlyMileageGoal: 100.0,
        selectedTitleId: createdTitles[0].id,
        selectedIconFrameId: createdIconFrames[0].id,
        selectedVoiceStyleId: createdVoiceStyles[0].id,
      },
    });

    // Grant all items to the first user for testing
    if (user.id === createdUsers[0].id) {
      await prisma.userIconFrame.createMany({
        data: createdIconFrames.map((frame) => ({
          userId: user.id,
          iconFrameId: frame.id,
        })),
      });
      await prisma.userVoiceStyle.createMany({
        data: createdVoiceStyles.map((style) => ({
          userId: user.id,
          voiceStyleId: style.id,
        })),
      });
      await prisma.userTitle.createMany({
        data: createdTitles.map((title) => ({
          userId: user.id,
          titleId: title.id,
        })),
      });
      console.log(`Granted all items to ${user.userName}`);
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 