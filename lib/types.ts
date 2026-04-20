export type UserRole = "guest" | "user" | "admin";
export type VerificationStatus = "unverified" | "school_verified" | "verified";
export type ListingStatus = "pending" | "approved" | "flagged" | "rejected" | "removed";
export type ListingType = "entire" | "shared" | "sublet";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type School = {
  id: string;
  name: string;
  city: string;
  area: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  schoolId?: string;
  phone?: string;
  wechat?: string;
  role: Exclude<UserRole, "guest">;
  verificationStatus: VerificationStatus;
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  city: string;
  area: string;
  address: string;
  schoolId: string;
  rent: number;
  distanceToSchool?: number;
  deposit: number;
  moveInDate: string;
  availableUntil?: string;
  leaseMonths: number;
  bedrooms: number;
  bathrooms: number;
  furnishing: boolean;
  allowsPets: boolean;
  type: ListingType;
  status: ListingStatus;
  contactMethod: string;
  publisherId: string;
  images: string[];
  createdAt: string;
};

export type RoommatePost = {
  id: string;
  userId: string;
  schoolId?: string;
  title: string;
  city: string;
  area: string;
  budget: number;
  moveInDate: string;
  genderPreference?: string;
  lifestyle?: string;
  description: string;
  createdAt: string;
};

export type Favorite = {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
};

export type Report = {
  id: string;
  userId: string;
  listingId: string;
  reason: string;
  createdAt: string;
};

export type ContactRecord = {
  id: string;
  listingId: string;
  userId: string;
  message: string;
  createdAt: string;
};

export type AdminReview = {
  id: string;
  listingId: string;
  reviewerId: string;
  status: ListingStatus;
  note?: string;
  createdAt: string;
};
