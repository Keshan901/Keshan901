import { PrismaClient, Role, Visibility, BlogStatus } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

const categories = ["Tech", "Beauty", "Fitness", "Finance", "Movies", "Gaming", "Sri Lanka Local"];
const platforms = ["TikTok", "Instagram", "Facebook", "YouTube"];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@viralvault.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "ViralVault Admin",
      role: Role.ADMIN,
      passwordHash: await argon2.hash(adminPassword),
    },
  });

  await prisma.dailyTip.deleteMany();
  await prisma.keywordSet.deleteMany();
  await prisma.hashtagSet.deleteMany();
  await prisma.blogPost.deleteMany();

  await prisma.dailyTip.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      title: `Tip ${i + 1}: Hook viewers in 2 seconds`,
      body: "Open with a bold claim, then deliver a concrete value in under 10 seconds.",
      date: new Date(Date.now() - i * 86400000),
    })),
  });

  for (let i = 0; i < 20; i++) {
    await prisma.keywordSet.create({
      data: {
        title: `Trending Keywords #${i + 1}`,
        platform: platforms[i % platforms.length],
        category: categories[i % categories.length],
        language: i % 2 === 0 ? "English" : "Sinhala",
        content: ["growth hacks", "viral strategy", "creator economy", `trend ${i + 1}`],
        visibility: Visibility.PUBLIC,
        authorId: admin.id,
        copyCount: Math.floor(Math.random() * 400),
      },
    });

    await prisma.hashtagSet.create({
      data: {
        title: `Trending Hashtags #${i + 1}`,
        platform: platforms[i % platforms.length],
        category: categories[i % categories.length],
        language: i % 2 === 0 ? "English" : "Tamil",
        content: ["#viral", "#creatorlife", "#trending", `#srilanka${i + 1}`],
        visibility: Visibility.PUBLIC,
        authorId: admin.id,
        copyCount: Math.floor(Math.random() * 400),
      },
    });
  }

  for (let i = 0; i < 6; i++) {
    await prisma.blogPost.create({
      data: {
        slug: `daily-watch-${i + 1}`,
        title: `Daily Watch ${i + 1}`,
        excerpt: "Short daily intelligence for creators and marketers.",
        contentMarkdown: "## What is trending\nCreators using short hooks and data-led storytelling are winning this week.",
        authorId: admin.id,
        status: BlogStatus.PUBLISHED,
        publishedAt: new Date(Date.now() - i * 86400000),
      },
    });
  }

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
