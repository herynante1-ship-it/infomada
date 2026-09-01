import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterBar } from '../components/FilterBar';
import { ListingCard } from '../components/ListingCard';
import { getListings } from '../services/listings';
import { Listing, ListingCategory, ListingState } from '../types';
import { Loader } from 'lucide-react';

export const HomePage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState<ListingCategory | undefined>(
    (searchParams.get('category') as ListingCategory) || undefined
  );
  const [state, setState] = useState<ListingState | undefined>(
    (searchParams.get('state') as ListingState) || undefined
  );
  const [city, setCity] = useState<string | undefined>(
    searchParams.get('city') || undefined
  );
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'date-desc'>(
    (searchParams.get('sort') as any) || 'date-desc'
  );

  // Load listings on mount
  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        const data = await getListings({
          category,
          state,
          city,
          sortBy: sort,
          search,
        });
        setListings(data);
        setFilteredListings(data);
      } catch (error) {
        console.error('Error loading listings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [category, state, city, sort, search]);

  // Update URL with current filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (state) params.set('state', state);
    if (city) params.set('city', city);
    if (sort !== 'date-desc') params.set('sort', sort);
    setSearchParams(params);
  }, [search, category, state, city, sort, setSearchParams]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleCategoryChange = (cat: ListingCategory | undefined) => {
    setCategory(cat);
  };

  const handleStateChange = (s: ListingState | undefined) => {
    setState(s);
  };

  const handleCityChange = (c: string | undefined) => {
    setCity(c);
  };

  const handleSortChange = (s: 'price-asc' | 'price-desc' | 'date-desc') => {
    setSort(s);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">InfoMada</h1>
          <p className="text-lg opacity-90">
            Trouvez du matériel informatique neuf ou d'occasion à Madagascar
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <FilterBar
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onStateChange={handleStateChange}
            onCityChange={handleCityChange}
            onSortChange={handleSortChange}
            selectedCategory={category}
            selectedState={state}
            selectedCity={city}
          />
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {filteredListings.length === 0 && !loading
              ? 'Aucune annonce trouvée'
              : `${filteredListings.length} annonce${filteredListings.length !== 1 ? 's' : ''} trouvée${filteredListings.length !== 1 ? 's' : ''}`}
          </h2>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader className="animate-spin text-primary" size={32} />
          </div>
        )}

        {/* Listings Grid */}
        {!loading && filteredListings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                city={listing.city}
                state={listing.state}
                photo={listing.photos[0]}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredListings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">
              Pas d'annonces correspondant à votre recherche
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategory(undefined);
                setState(undefined);
                setCity(undefined);
                setSort('date-desc');
              }}
              className="btn-primary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
