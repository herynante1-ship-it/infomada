export type ListingState = 'neuf' | 'occasion-bon-etat' | 'pour-pieces';
export type ListingCategory =
  | 'pc-complets'
  | 'unites-centrales'
  | 'ordinateurs-portables'
  | 'ecrans'
  | 'composants'
  | 'imprimantes'
  | 'accessoires';

export interface Listing {
  id: string;
  title: string;
  category: ListingCategory;
  state: ListingState;
  price: number;
  city: string;
  description: string;
  photos: string[];
  vendorPhone: string;
  vendorName: string;
  isVendorShop: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface VendorProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  isShop: boolean;
  createdAt: Date;
}

export const CATEGORIES: { value: ListingCategory; label: string }[] = [
  { value: 'pc-complets', label: 'PC complets' },
  { value: 'unites-centrales', label: 'Unités centrales' },
  { value: 'ordinateurs-portables', label: 'Ordinateurs portables' },
  { value: 'ecrans', label: 'Écrans' },
  { value: 'composants', label: 'Composants (RAM, disque, GPU)' },
  { value: 'imprimantes', label: 'Imprimantes' },
  { value: 'accessoires', label: 'Accessoires' },
];

export const CITIES = [
  'Antananarivo',
  'Toamasina',
  'Antsirabe',
  'Fianarantsoa',
  'Mahajanga',
  'Toliara',
  'Antsiranana',
];

export const STATES: { value: ListingState; label: string; color: string }[] = [
  { value: 'neuf', label: 'Neuf', color: 'success' },
  { value: 'occasion-bon-etat', label: 'Occasion - bon état', color: 'blue-500' },
  { value: 'pour-pieces', label: 'Pour pièces', color: 'warning' },
];

export const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const getStateLabel = (state: ListingState): string => {
  const found = STATES.find((s) => s.value === state);
  return found?.label || state;
};

export const getCategoryLabel = (category: ListingCategory): string => {
  const found = CATEGORIES.find((c) => c.value === category);
  return found?.label || category;
};
