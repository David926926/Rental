import type {
  AdminReview,
  ContactRecord,
  Favorite,
  Listing,
  Report,
  RoommatePost,
  School,
  User,
} from "@/lib/types";

export const schools: School[] = [
  { id: "nyu", name: "New York University", city: "New York", area: "Manhattan" },
  { id: "ucla", name: "UCLA", city: "Los Angeles", area: "Westwood" },
  { id: "ubc", name: "University of British Columbia", city: "Vancouver", area: "Point Grey" },
];

export const users: User[] = [
  {
    id: "user-alice",
    name: "Alice Chen",
    email: "alice@nyu.edu",
    schoolId: "nyu",
    phone: "917-555-1001",
    wechat: "alice-nyu",
    role: "user",
    verificationStatus: "school_verified",
  },
  {
    id: "user-bob",
    name: "Bob Lin",
    email: "bob@ucla.edu",
    schoolId: "ucla",
    phone: "310-555-2203",
    wechat: "bob-westwood",
    role: "user",
    verificationStatus: "verified",
  },
  {
    id: "admin-1",
    name: "Platform Admin",
    email: "admin@rentbridge.local",
    role: "admin",
    verificationStatus: "verified",
  },
];

export const listings: Listing[] = [
  {
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
    moveInDate: "2026-05-01",
    availableUntil: "2026-08-31",
    leaseMonths: 4,
    bedrooms: 1,
    bathrooms: 1,
    furnishing: true,
    allowsPets: false,
    type: "sublet",
    status: "approved",
    contactMethod: "微信 alice-nyu / 邮箱 alice@nyu.edu",
    publisherId: "user-alice",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    ],
    createdAt: "2026-04-10T08:00:00.000Z",
  },
  {
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
    moveInDate: "2026-06-15",
    availableUntil: "2027-06-14",
    leaseMonths: 12,
    bedrooms: 1,
    bathrooms: 1,
    furnishing: true,
    allowsPets: true,
    type: "shared",
    status: "pending",
    contactMethod: "微信 bob-westwood / 电话 310-555-2203",
    publisherId: "user-bob",
    images: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    ],
    createdAt: "2026-04-12T09:00:00.000Z",
  },
];

export const roommatePosts: RoommatePost[] = [
  {
    id: "roommate-1",
    userId: "user-bob",
    schoolId: "ucla",
    title: "找 1 位爱干净室友一起租 Westwood 2B2B",
    city: "Los Angeles",
    area: "Westwood",
    budget: 1600,
    moveInDate: "2026-06-15",
    genderPreference: "不限",
    lifestyle: "作息规律，可接受做饭",
    description: "希望一起在 UCLA 周边找两居，预算 1600 左右。",
    createdAt: "2026-04-11T08:30:00.000Z",
  },
];

export const favorites: Favorite[] = [
  {
    id: "favorite-1",
    userId: "user-alice",
    listingId: "listing-1",
    createdAt: "2026-04-12T10:00:00.000Z",
  },
];

export const reports: Report[] = [];
export const contactRecords: ContactRecord[] = [];
export const adminReviews: AdminReview[] = [];
