import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

interface FavoritesStore {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => {
  // Load favorites from localStorage on init
  const stored = localStorage.getItem('infomada_favorites');
  const initialFavorites = stored ? JSON.parse(stored) : [];

  return {
    favorites: initialFavorites,
    addFavorite: (id) =>
      set((state) => {
        const updated = [...state.favorites, id];
        localStorage.setItem('infomada_favorites', JSON.stringify(updated));
        return { favorites: updated };
      }),
    removeFavorite: (id) =>
      set((state) => {
        const updated = state.favorites.filter((fav) => fav !== id);
        localStorage.setItem('infomada_favorites', JSON.stringify(updated));
        return { favorites: updated };
      }),
    isFavorite: (id) => get().favorites.includes(id),
  };
});
