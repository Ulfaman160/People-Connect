import { doc, getDoc } from 'firebase/firestore';
import { create } from 'zustand';
import { db } from './firebase';

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,

    fetchUserInfo: async (uid) => {
        set({ isLoading: true });

        if (!uid) {
            return set({ currentUser: null, isLoading: false });
        }

        try {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            setTimeout(() => {
                if (docSnap.exists()) {
                    set({ currentUser: docSnap.data(), isLoading: false });
                } else {
                    console.warn("User document does not exist.");
                    set({ currentUser: null, isLoading: false });
                }
            }, 2000); // 5 seconds timeout

        } catch (err) {
            console.error("Error fetching user info:", err);
            set({ currentUser: null, isLoading: false });
        }
    }
}));
