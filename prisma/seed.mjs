import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import pg from "pg";
import { schools } from "./schools.mjs";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const defaultPassword = "David2004";

async function main() {
  for (const school of schools) {
    await prisma.school.upsert({
      where: { id: school.id },
      update: school,
      create: school,
    });
  }

  const users = [
    {
      id: "user-alice",
      name: "Alice Chen",
      email: "alice@nyu.edu",
      schoolId: "nyu",
      phone: "917-555-1001",
      wechat: "alice-nyu",
      role: "USER",
      verificationStatus: "SCHOOL_VERIFIED",
      passwordHash: await hash(defaultPassword, 12),
    },
    {
      id: "user-bob",
      name: "Bob Lin",
      email: "bob@ucla.edu",
      schoolId: "ucla",
      phone: "310-555-2203",
      wechat: "bob-westwood",
      role: "USER",
      verificationStatus: "VERIFIED",
      passwordHash: await hash(defaultPassword, 12),
    },
    {
      id: "admin-1",
      name: "Platform Admin",
      email: "xz4052@nyu.edu",
      role: "ADMIN",
      verificationStatus: "VERIFIED",
      passwordHash: await hash(defaultPassword, 12),
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user,
    });
  }

  await prisma.listingImage.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.report.deleteMany();
  await prisma.contactRecord.deleteMany();
  await prisma.adminReview.deleteMany();
  await prisma.roommatePost.deleteMany();
  await prisma.listing.deleteMany();

  await prisma.listing.create({
    data: {
      id: "listing-1",
      title: "NYU 步行 8 分钟一室一厅转租",
      description: "带基础家具和独立卫浴，适合暑期实习或新学期过渡入住。",
      city: "New York",
      area: "Manhattan",
      address: "W 3rd St, Manhattan, NY",
      schoolId: "nyu",
      rent: 2450,
      distanceToSchool: 0.6,
      deposit: 1200,
      moveInDate: new Date("2026-05-01"),
      availableUntil: new Date("2026-08-31"),
      leaseMonths: 4,
      bedrooms: 1,
      bathrooms: 1,
      furnishing: true,
      allowsPets: false,
      type: "SUBLET",
      status: "APPROVED",
      contactMethod: "微信 alice-nyu / 邮箱 alice@nyu.edu",
      publisherId: "user-alice",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
            sortOrder: 0,
          },
        ],
      },
    },
  });

  await prisma.listing.create({
    data: {
      id: "listing-2",
      title: "UCLA 附近 Westwood 合租次卧",
      description: "近校车站，客厅采光好，可拎包入住，适合学生合租。",
      city: "Los Angeles",
      area: "Westwood",
      address: "Kelton Ave, Los Angeles, CA",
      schoolId: "ucla",
      rent: 1450,
      distanceToSchool: 1.1,
      deposit: 800,
      moveInDate: new Date("2026-06-15"),
      availableUntil: new Date("2027-06-14"),
      leaseMonths: 12,
      bedrooms: 1,
      bathrooms: 1,
      furnishing: true,
      allowsPets: true,
      type: "SHARED",
      status: "PENDING",
      contactMethod: "微信 bob-westwood / 电话 310-555-2203",
      publisherId: "user-bob",
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
            sortOrder: 0,
          },
        ],
      },
    },
  });

  await prisma.roommatePost.create({
    data: {
      id: "roommate-1",
      userId: "user-bob",
      schoolId: "ucla",
      title: "找 1 位爱干净室友一起租 Westwood 2B2B",
      city: "Los Angeles",
      area: "Westwood",
      budget: 1600,
      moveInDate: new Date("2026-06-15"),
      genderPreference: "不限",
      lifestyle: "作息规律，可接受做饭",
      description: "希望一起在 UCLA 周边找两居，预算 1600 左右。",
    },
  });

  await prisma.favorite.upsert({
    where: {
      userId_listingId: {
        userId: "user-alice",
        listingId: "listing-1",
      },
    },
    update: {},
    create: {
      userId: "user-alice",
      listingId: "listing-1",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
