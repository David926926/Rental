import {
  adminReviews as seedAdminReviews,
  contactRecords as seedContactRecords,
  favorites as seedFavorites,
  listings as seedListings,
  reports as seedReports,
  roommatePosts as seedRoommatePosts,
  schools as seedSchools,
  users as seedUsers,
} from "@/lib/mock-data";
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

type AppStore = {
  schools: School[];
  users: User[];
  listings: Listing[];
  roommatePosts: RoommatePost[];
  favorites: Favorite[];
  reports: Report[];
  contactRecords: ContactRecord[];
  adminReviews: AdminReview[];
};

declare global {
  var __RENT_PLATFORM_STORE__: AppStore | undefined;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function initStore(): AppStore {
  return {
    schools: clone(seedSchools),
    users: clone(seedUsers),
    listings: clone(seedListings),
    roommatePosts: clone(seedRoommatePosts),
    favorites: clone(seedFavorites),
    reports: clone(seedReports),
    contactRecords: clone(seedContactRecords),
    adminReviews: clone(seedAdminReviews),
  };
}

export function getStore(): AppStore {
  if (!global.__RENT_PLATFORM_STORE__) {
    global.__RENT_PLATFORM_STORE__ = initStore();
  }
  return global.__RENT_PLATFORM_STORE__;
}

export function updateListingStatus(listingId: string, status: ListingStatus) {
  const store = getStore();
  const listing = store.listings.find((item) => item.id === listingId);
  if (listing) {
    listing.status = status;
  }
  return listing;
}
