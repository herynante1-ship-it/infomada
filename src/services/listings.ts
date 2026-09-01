import { db, storage } from '../config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Query,
  QueryConstraint,
  Timestamp,
  getDoc,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Listing, ListingState, ListingCategory } from '../types';

export const uploadImage = async (
  file: File,
  listingId: string,
  index: number
): Promise<string> => {
  const filename = `${Date.now()}-${index}`;
  const storageRef = ref(storage, `listings/${listingId}/${filename}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const deleteImage = async (url: string): Promise<void> => {
  try {
    const imageRef = ref(storage, url);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

export const createListing = async (
  data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const docRef = await addDoc(collection(db, 'listings'), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const updateListing = async (id: string, data: Partial<Listing>): Promise<void> => {
  await updateDoc(doc(db, 'listings', id), {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteListing = async (id: string): Promise<void> => {
  // Delete images first
  const listing = await getListing(id);
  if (listing) {
    for (const photoUrl of listing.photos) {
      await deleteImage(photoUrl);
    }
  }
  await deleteDoc(doc(db, 'listings', id));
};

export const getListing = async (id: string): Promise<Listing | null> => {
  const docRef = doc(db, 'listings', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  } as Listing;
};

interface ListingsFilters {
  search?: string;
  category?: ListingCategory;
  state?: ListingState;
  city?: string;
  userId?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'date-desc';
}

export const getListings = async (filters: ListingsFilters = {}): Promise<Listing[]> => {
  const constraints: QueryConstraint[] = [];

  if (filters.category) {
    constraints.push(where('category', '==', filters.category));
  }

  if (filters.state) {
    constraints.push(where('state', '==', filters.state));
  }

  if (filters.city) {
    constraints.push(where('city', '==', filters.city));
  }

  if (filters.userId) {
    constraints.push(where('userId', '==', filters.userId));
  }

  // Default sort by date descending
  constraints.push(orderBy('createdAt', 'desc'));

  const q = query(collection(db, 'listings'), ...constraints);
  const querySnapshot = await getDocs(q);

  let listings = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Listing;
  });

  // Client-side filtering for search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    listings = listings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower)
    );
  }

  // Client-side sorting
  if (filters.sortBy === 'price-asc') {
    listings.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price-desc') {
    listings.sort((a, b) => b.price - a.price);
  }

  return listings;
};

export const getSimilarListings = async (
  listing: Listing,
  limit: number = 4
): Promise<Listing[]> => {
  const listings = await getListings({
    category: listing.category,
  });

  return listings.filter((l) => l.id !== listing.id).slice(0, limit);
};
