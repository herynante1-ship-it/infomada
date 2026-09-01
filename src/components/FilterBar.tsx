import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES, CITIES, STATES, ListingCategory, ListingState } from '../types';

interface FilterBarProps {
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: ListingCategory | undefined) => void;
  onStateChange: (state: ListingState | undefined) => void;
  onCityChange: (city: string | undefined) => void;
  onSortChange: (sort: 'price-asc' | 'price-desc' | 'date-desc') => void;
  selectedCategory?: ListingCategory;
  selectedState?: ListingState;
  selectedCity?: string;
}

export const FilterBar = ({
  onSearchChange,
  onCategoryChange,
  onStateChange,
  onCityChange,
  onSortChange,
  selectedCategory,
  selectedState,
  selectedCity,
}: FilterBarProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearchChange(value);
  };

  const handleCategoryClick = (category: ListingCategory | undefined) => {
    onCategoryChange(category);
  };

  const clearFilters = () => {
    setSearchValue('');
    onSearchChange('');
    onCategoryChange(undefined);
    onStateChange(undefined);
    onCityChange(undefined);
  };

  const hasActiveFilters = selectedCategory || selectedState || selectedCity || searchValue;

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher par mot-clé..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg border transition-colors ${
            showFilters
              ? 'bg-primary text-white border-primary'
              : 'border-gray-300 hover:border-primary hover:text-primary'
          }`}
        >
          <Filter size={20} />
        </button>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="space-y-4 border-t pt-4">
          {/* Categories */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Catégories
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() =>
                    handleCategoryClick(selectedCategory === cat.value ? undefined : cat.value)
                  }
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* States */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              État du produit
            </label>
            <div className="flex flex-wrap gap-2">
              {STATES.map((state) => (
                <button
                  key={state.value}
                  onClick={() =>
                    onStateChange(selectedState === state.value ? undefined : state.value)
                  }
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedState === state.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {state.label}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ville
            </label>
            <select
              value={selectedCity || ''}
              onChange={(e) => onCityChange(e.target.value || undefined)}
              className="input-field"
            >
              <option value="">Toutes les villes</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Trier par
            </label>
            <select onChange={(e) => onSortChange(e.target.value as any)} className="input-field">
              <option value="date-desc">Les plus récents</option>
              <option value="price-asc">Prix: bas à élevé</option>
              <option value="price-desc">Prix: élevé à bas</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg font-medium transition-colors"
            >
              <X size={16} /> Réinitialiser les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
};
