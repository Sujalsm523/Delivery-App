// src/services/firestoreService.ts
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, appId } from '../firebase/config';
import type { Package } from '../types';

export const firestoreService = {
  getCollectionPath: (collectionName: string, userId?: string) => {
    return userId
      ? `artifacts/${appId}/users/${userId}/${collectionName}`
      : `artifacts/${appId}/public/data/${collectionName}`;
  },

  listenToPackages: (
    callback: (packages: Package[]) => void,
    options: { userId?: string; forVolunteer?: boolean } = {}
  ) => {
    const { userId, forVolunteer } = options;
    const path = forVolunteer
        ? `artifacts/${appId}/public/data/packages`
        : `artifacts/${appId}/users/${userId}/packages`;

    const colRef = collection(db, path);
    const q = query(colRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const packages = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt.toDate()
        })) as Package[];
        callback(packages);
    }, (error) => {
        console.error(`Error listening to collection at ${path}:`, error);
    });

    return unsubscribe; // Return the unsubscribe function for cleanup
  },

  addDocument: async <T extends object>(collectionName: string, data: T, userId?: string) => {
    const path = firestoreService.getCollectionPath(collectionName, userId);
    const colRef = collection(db, path);
    return await addDoc(colRef, data);
  },
};