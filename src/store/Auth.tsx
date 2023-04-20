import { User } from "firebase/auth";
import { create } from "zustand";
import { auth } from "../firebase";

type Props = {
    currentUser: User | null;
};

const useAuthStore = create<Props>((set) => {
    // Listen to the onAuthStateChanged event to update the currentUser state
    auth.onAuthStateChanged((user) => {
        set({ currentUser: user });
    });

    return {
        currentUser: null,
    };
});

export default useAuthStore;
