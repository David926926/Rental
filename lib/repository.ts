import { prisma } from "@/lib/prisma";
import { defaultSchools } from "@/lib/default-schools";
import type {
  AdminReview,
  ContactRecord,
  Favorite,
  Listing,
  ListingStatus,
  Report,
  RoommatePost,
  School,
  User,
} from "@/lib/types";

type ListingFilters = {
  schoolId?: string;
  city?: string;
  area?: string;
  minRent?: number;
  maxRent?: number;
  leaseType?: string;
  moveInDate?: string;
  listingType?: string;
  housingType?: string;
  sort?: string;
  status?: ListingStatus;
};

export type UserAuthRecord = User & {
  passwordHash?: string;
};

function mapUserRole(role: "USER" | "ADMIN"): User["role"] {
  return role === "ADMIN" ? "admin" : "user";
}

function mapVerificationStatus(status: "UNVERIFIED" | "SCHOOL_VERIFIED" | "VERIFIED"): User["verificationStatus"] {
  if (status === "SCHOOL_VERIFIED") return "school_verified";
  if (status === "VERIFIED") return "verified";
  return "unverified";
}

function mapListingStatus(
  status: "PENDING" | "APPROVED" | "FLAGGED" | "REJECTED" | "REMOVED",
): ListingStatus {
  return status.toLowerCase() as ListingStatus;
}

function mapListingType(type: "ENTIRE" | "SHARED" | "SUBLET"): Listing["type"] {
  return type.toLowerCase() as Listing["type"];
}

function toDbListingStatus(status: ListingStatus) {
  return status.toUpperCase() as "PENDING" | "APPROVED" | "FLAGGED" | "REJECTED" | "REMOVED";
}

function toDbListingType(type: Listing["type"]) {
  return type.toUpperCase() as "ENTIRE" | "SHARED" | "SUBLET";
}

function mapSchool(school: { id: string; name: string; city: string; area: string }): School {
  return {
    id: school.id,
    name: school.name,
    city: school.city,
    area: school.area,
  };
}

function mapUser(user: {
  id: string;
  email: string;
  name: string;
  schoolId: string | null;
  phone: string | null;
  wechat: string | null;
  role: "USER" | "ADMIN";
  verificationStatus: "UNVERIFIED" | "SCHOOL_VERIFIED" | "VERIFIED";
}): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    schoolId: user.schoolId ?? undefined,
    phone: user.phone ?? undefined,
    wechat: user.wechat ?? undefined,
    role: mapUserRole(user.role),
    verificationStatus: mapVerificationStatus(user.verificationStatus),
  };
}

function mapUserAuth(user: {
  id: string;
  email: string;
  name: string;
  schoolId: string | null;
  phone: string | null;
  wechat: string | null;
  role: "USER" | "ADMIN";
  verificationStatus: "UNVERIFIED" | "SCHOOL_VERIFIED" | "VERIFIED";
  passwordHash: string | null;
}): UserAuthRecord {
  return {
    ...mapUser(user),
    passwordHash: user.passwordHash ?? undefined,
  };
}

function mapListing(listing: {
  id: string;
  title: string;
  description: string;
  city: string;
  area: string;
  address: string;
  schoolId: string;
  rent: number;
  distanceToSchool: number | null;
  housingType: string | null;
  officialSublease: string | null;
  acceptableMinPrice: number | null;
  acceptableMaxPrice: number | null;
  petPolicy: string | null;
  deposit: number;
  moveInDate: Date;
  availableUntil: Date | null;
  leaseMonths: number;
  bedrooms: number;
  bathrooms: number;
  furnishing: boolean;
  allowsPets: boolean;
  type: "ENTIRE" | "SHARED" | "SUBLET";
  status: "PENDING" | "APPROVED" | "FLAGGED" | "REJECTED" | "REMOVED";
  contactMethod: string;
  publisherId: string;
  createdAt: Date;
  images?: Array<{ url: string }>;
}): Listing {
  return {
    id: listing.id,
    title: listing.title,
    description: listing.description,
    city: listing.city,
    area: listing.area,
    address: listing.address,
    schoolId: listing.schoolId,
    rent: listing.rent,
    distanceToSchool: listing.distanceToSchool ?? undefined,
    housingType: listing.housingType ?? undefined,
    officialSublease: listing.officialSublease ?? undefined,
    acceptableMinPrice: listing.acceptableMinPrice ?? undefined,
    acceptableMaxPrice: listing.acceptableMaxPrice ?? undefined,
    petPolicy: listing.petPolicy ?? undefined,
    deposit: listing.deposit,
    moveInDate: listing.moveInDate.toISOString(),
    availableUntil: listing.availableUntil?.toISOString(),
    leaseMonths: listing.leaseMonths,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    furnishing: listing.furnishing,
    allowsPets: listing.allowsPets,
    type: mapListingType(listing.type),
    status: mapListingStatus(listing.status),
    contactMethod: listing.contactMethod,
    publisherId: listing.publisherId,
    images: listing.images?.map((image) => image.url) ?? [],
    createdAt: listing.createdAt.toISOString(),
  };
}

function mapRoommatePost(post: {
  id: string;
  userId: string;
  schoolId: string | null;
  title: string;
  city: string;
  area: string;
  budget: number;
  moveInDate: Date;
  genderPreference: string | null;
  lifestyle: string | null;
  description: string;
  createdAt: Date;
}): RoommatePost {
  return {
    id: post.id,
    userId: post.userId,
    schoolId: post.schoolId ?? undefined,
    title: post.title,
    city: post.city,
    area: post.area,
    budget: post.budget,
    moveInDate: post.moveInDate.toISOString(),
    genderPreference: post.genderPreference ?? undefined,
    lifestyle: post.lifestyle ?? undefined,
    description: post.description,
    createdAt: post.createdAt.toISOString(),
  };
}

function mapFavorite(favorite: { id: string; userId: string; listingId: string; createdAt: Date }): Favorite {
  return {
    id: favorite.id,
    userId: favorite.userId,
    listingId: favorite.listingId,
    createdAt: favorite.createdAt.toISOString(),
  };
}

function mapContactRecord(record: {
  id: string;
  userId: string;
  listingId: string;
  message: string;
  createdAt: Date;
}): ContactRecord {
  return {
    id: record.id,
    userId: record.userId,
    listingId: record.listingId,
    message: record.message,
    createdAt: record.createdAt.toISOString(),
  };
}

function mapReport(report: { id: string; userId: string; listingId: string; reason: string; createdAt: Date }): Report {
  return {
    id: report.id,
    userId: report.userId,
    listingId: report.listingId,
    reason: report.reason,
    createdAt: report.createdAt.toISOString(),
  };
}

function mapAdminReview(review: {
  id: string;
  reviewerId: string;
  listingId: string;
  status: "PENDING" | "APPROVED" | "FLAGGED" | "REJECTED" | "REMOVED";
  note: string | null;
  createdAt: Date;
}): AdminReview {
  return {
    id: review.id,
    reviewerId: review.reviewerId,
    listingId: review.listingId,
    status: mapListingStatus(review.status),
    note: review.note ?? undefined,
    createdAt: review.createdAt.toISOString(),
  };
}

export async function getSchools(): Promise<School[]> {
  const schools = await prisma.school.findMany({
    orderBy: [{ city: "asc" }, { name: "asc" }],
  });
  const merged = new Map<string, School>();

  for (const school of defaultSchools) {
    merged.set(school.id, school);
  }

  for (const school of schools.map(mapSchool)) {
    merged.set(school.id, school);
  }

  return Array.from(merged.values()).sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
}

async function ensureSchoolExists(schoolId: string) {
  const school = defaultSchools.find((item) => item.id === schoolId);

  if (!school) return;

  await prisma.school.upsert({
    where: { id: school.id },
    update: school,
    create: school,
  });
}

export async function getUsers(): Promise<User[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });
  return users.map(mapUser);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return user ? mapUser(user) : null;
}

export async function getUserWithPasswordByEmail(email: string): Promise<UserAuthRecord | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return user ? mapUserAuth(user) : null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user ? mapUser(user) : null;
}

export async function createUserByEmailPassword(input: {
  name: string;
  email: string;
  passwordHash: string;
}): Promise<User> {
  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      passwordHash: input.passwordHash,
      role: "USER",
      verificationStatus: "UNVERIFIED",
    },
  });

  return mapUser(user);
}

export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const listings = await prisma.listing.findMany({
    where: {
      ...(filters.status ? { status: toDbListingStatus(filters.status) } : {}),
      ...(filters.schoolId ? { schoolId: filters.schoolId } : {}),
      ...(filters.city ? { city: { contains: filters.city, mode: "insensitive" } } : {}),
      ...(filters.area ? { area: { contains: filters.area, mode: "insensitive" } } : {}),
      ...(typeof filters.minRent === "number" && !Number.isNaN(filters.minRent) ? { rent: { gte: filters.minRent } } : {}),
      ...(typeof filters.maxRent === "number" && !Number.isNaN(filters.maxRent) ? { rent: { lte: filters.maxRent } } : {}),
      ...(filters.listingType ? { type: toDbListingType(filters.listingType as Listing["type"]) } : {}),
      ...(filters.housingType ? { housingType: filters.housingType } : {}),
      ...(filters.moveInDate ? { moveInDate: { gte: new Date(filters.moveInDate) } } : {}),
    },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy:
      filters.sort === "rent_asc"
        ? { rent: "asc" }
        : filters.sort === "rent_desc"
          ? { rent: "desc" }
          : filters.sort === "distance_asc"
            ? { distanceToSchool: { sort: "asc", nulls: "last" } }
          : { createdAt: "desc" },
  });

  return listings.map(mapListing);
}

export async function getPublicListings(filters: Omit<ListingFilters, "status"> = {}): Promise<Listing[]> {
  return getListings({ ...filters, status: "approved" });
}

export async function getListingById(listingId: string): Promise<Listing | null> {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  return listing ? mapListing(listing) : null;
}

export async function createListing(
  input: Omit<Listing, "id" | "createdAt" | "status"> & { status?: ListingStatus },
): Promise<Listing> {
  await ensureSchoolExists(input.schoolId);

  const listing = await prisma.listing.create({
    data: {
      title: input.title,
      description: input.description,
      city: input.city,
      area: input.area,
      address: input.address,
      schoolId: input.schoolId,
      rent: input.rent,
      distanceToSchool: input.distanceToSchool ?? null,
      housingType: input.housingType ?? null,
      officialSublease: input.officialSublease ?? null,
      acceptableMinPrice: input.acceptableMinPrice ?? null,
      acceptableMaxPrice: input.acceptableMaxPrice ?? null,
      petPolicy: input.petPolicy ?? null,
      deposit: input.deposit,
      moveInDate: new Date(input.moveInDate),
      availableUntil: input.availableUntil ? new Date(input.availableUntil) : null,
      leaseMonths: input.leaseMonths,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      furnishing: input.furnishing,
      allowsPets: input.allowsPets,
      type: toDbListingType(input.type),
      status: toDbListingStatus(input.status ?? "pending"),
      contactMethod: input.contactMethod,
      publisherId: input.publisherId,
      images: {
        create: input.images.map((url, index) => ({
          url,
          sortOrder: index,
        })),
      },
    },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return mapListing(listing);
}

export async function updateListing(
  listingId: string,
  input: Partial<Pick<Listing, "title" | "description" | "contactMethod" | "rent" | "status">>,
): Promise<Listing | null> {
  const existing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!existing) return null;

  const listing = await prisma.listing.update({
    where: { id: listingId },
    data: {
      ...(input.title ? { title: input.title } : {}),
      ...(input.description ? { description: input.description } : {}),
      ...(input.contactMethod ? { contactMethod: input.contactMethod } : {}),
      ...(typeof input.rent === "number" ? { rent: input.rent } : {}),
      ...(input.status ? { status: toDbListingStatus(input.status) } : {}),
    },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return mapListing(listing);
}

export async function favoriteListing(userId: string, listingId: string): Promise<Favorite> {
  const favorite = await prisma.favorite.upsert({
    where: {
      userId_listingId: {
        userId,
        listingId,
      },
    },
    update: {},
    create: {
      userId,
      listingId,
    },
  });

  return mapFavorite(favorite);
}

export async function getFavoritesByUser(userId: string): Promise<Favorite[]> {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return favorites.map(mapFavorite);
}

export async function createContactRecord(userId: string, listingId: string, message: string): Promise<ContactRecord> {
  const record = await prisma.contactRecord.create({
    data: {
      userId,
      listingId,
      message,
    },
  });
  return mapContactRecord(record);
}

export async function getContactRecordsByUser(userId: string): Promise<ContactRecord[]> {
  const records = await prisma.contactRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return records.map(mapContactRecord);
}

export async function createReport(userId: string, listingId: string, reason: string): Promise<Report> {
  const report = await prisma.report.create({
    data: {
      userId,
      listingId,
      reason,
    },
  });
  return mapReport(report);
}

export async function getReports(): Promise<Report[]> {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
  });
  return reports.map(mapReport);
}

export async function getRoommatePosts(): Promise<RoommatePost[]> {
  const posts = await prisma.roommatePost.findMany({
    orderBy: { createdAt: "desc" },
  });
  return posts.map(mapRoommatePost);
}

export async function createRoommatePost(input: Omit<RoommatePost, "id" | "createdAt">): Promise<RoommatePost> {
  const post = await prisma.roommatePost.create({
    data: {
      userId: input.userId,
      schoolId: input.schoolId ?? null,
      title: input.title,
      city: input.city,
      area: input.area,
      budget: input.budget,
      moveInDate: new Date(input.moveInDate),
      genderPreference: input.genderPreference ?? null,
      lifestyle: input.lifestyle ?? null,
      description: input.description,
    },
  });
  return mapRoommatePost(post);
}

export async function reviewListing(
  reviewerId: string,
  listingId: string,
  status: ListingStatus,
  note?: string,
): Promise<AdminReview | null> {
  const existing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!existing) return null;

  const [, review] = await prisma.$transaction([
    prisma.listing.update({
      where: { id: listingId },
      data: { status: toDbListingStatus(status) },
    }),
    prisma.adminReview.create({
      data: {
        reviewerId,
        listingId,
        status: toDbListingStatus(status),
        note: note ?? null,
      },
    }),
  ]);

  return mapAdminReview(review);
}

export async function getAdminReviews(): Promise<AdminReview[]> {
  const reviews = await prisma.adminReview.findMany({
    orderBy: { createdAt: "desc" },
  });
  return reviews.map(mapAdminReview);
}
