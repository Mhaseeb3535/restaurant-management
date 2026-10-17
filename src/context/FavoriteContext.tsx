import { createContext, useContext, useState, type ReactNode } from "react";

export interface FavoriteItem {
  favoriteId: string;
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
}

interface FavoriteContextType {
  favorites: FavoriteItem[];
  favoriteCount: number;
  isFavorite: (favoriteId: string) => boolean;
  toggleFavorite: (item: FavoriteItem) => void;
  removeFavorite: (favoriteId: string) => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

const FAVORITE_STORAGE_KEY = "favoriteItems";

function loadFavorites(): FavoriteItem[] {
  try {
    const stored = localStorage.getItem(FAVORITE_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(loadFavorites);

  const saveFavorites = (items: FavoriteItem[]) => {
    setFavorites(items);
    localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(items));
  };

  const isFavorite = (favoriteId: string) =>
    favorites.some((item) => item.favoriteId === favoriteId);

  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.favoriteId)) {
      saveFavorites(favorites.filter((favorite) => favorite.favoriteId !== item.favoriteId));
      return;
    }

    saveFavorites([...favorites, item]);
  };

  const removeFavorite = (favoriteId: string) => {
    saveFavorites(favorites.filter((item) => item.favoriteId !== favoriteId));
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        favoriteCount: favorites.length,
        isFavorite,
        toggleFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoriteProvider");
  }
  return context;
}
