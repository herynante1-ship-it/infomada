import { db } from '../config/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { VendorProfile } from '../types';

export const getVendorProfile = async (userId: string): Promise<VendorProfile | null> => {
  const docRef = doc(db, 'vendors', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    email: data.email,
    name: data.name,
    phone: data.phone,
    isShop: data.isShop,
    createdAt: data.createdAt?.toDate() || new Date(),
  } as VendorProfile;
};

export const createVendorProfile = async (
  userId: string,
  data: Omit<VendorProfile, 'id' | 'createdAt'>
): Promise<void> => {
  await setDoc(doc(db, 'vendors', userId), {
    ...data,
    createdAt: Timestamp.now(),
  });
};

export const updateVendorProfile = async (
  userId: string,
  data: Partial<VendorProfile>
): Promise<void> => {
  await setDoc(doc(db, 'vendors', userId), data, { merge: true });
};
