// @ts-nocheck
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { iconFrames } from "./seed-data/iconFrames";
import { voiceStyles } from "./seed-data/voiceStyles";
import { titles } from "./seed-data/titles";

const prisma = new PrismaClient();

async function clearAll() {
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
}

async function seedIconFrames() {
  const createdIconFrames: any[] = [];
  for (const frame of iconFrames) {
    const created = await prisma.iconFrame.create({ data: frame });
    createdIconFrames.push(created);
  }
  console.log(`Seeded ${createdIconFrames.length} icon frames`);
  return createdIconFrames;
}

async function seedIconFramePrices(createdIconFrames: any[]) {
  const iconFramePrices = [
    { price: 100 },
    { price: 200 },
    { price: 300 },
  ];
  for (let i = 0; i < createdIconFrames.length; i++) {
    await prisma.iconFramePrice.create({
      data: {
        iconFrameId: createdIconFrames[i].id,
        price: iconFramePrices[i % iconFramePrices.length].price,
      },
    });
  }
  console.log(`Seeded ${createdIconFrames.length} icon frame prices`);
}

async function seedVoiceStyles() {
  const createdVoiceStyles: any[] = [];
  for (const style of voiceStyles) {
    const created = await prisma.voiceStyle.create({ data: style });
    createdVoiceStyles.push(created);
  }
  console.log(`Seeded ${createdVoiceStyles.length} voice styles`);
  return createdVoiceStyles;
}

async function seedVoiceStylePrices(createdVoiceStyles: any[]) {
  const voiceStylePrices = [
    { price: 0 },
    { price: 250 },
    { price: 250 },
  ];
  for (let i = 0; i < createdVoiceStyles.length; i++) {
    await prisma.voiceStylePrice.create({
      data: {
        voiceStyleId: createdVoiceStyles[i].id,
        price: voiceStylePrices[i % voiceStylePrices.length].price,
      },
    });
  }
  console.log(`Seeded ${createdVoiceStyles.length} voice style prices`);
}

async function seedTitles() {
  const createdTitles: any[] = [];
  for (const title of titles) {
    const created = await prisma.title.create({ data: title });
    createdTitles.push(created);
  }
  console.log(`Seeded ${createdTitles.length} titles`);
  return createdTitles;
}

async function main() {
  console.log("Seeding started...");
  await clearAll();
  const createdIconFrames = await seedIconFrames();
  await seedIconFramePrices(createdIconFrames);
  const createdVoiceStyles = await seedVoiceStyles();
  await seedVoiceStylePrices(createdVoiceStyles);
  await seedTitles();
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