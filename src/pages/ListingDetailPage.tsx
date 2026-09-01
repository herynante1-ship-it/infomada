import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListing, getSimilarListings } from '../services/listings';
import { Listing } from '../types';
import { ImageGallery } from '../components/ImageGallery';
import { ContactButtons } from '../components/ContactButtons';
import { VendorInfo } from '../components/VendorInfo';
import { FavoriteButton } from '../components/FavoriteButton';
import { ListingCard } from '../components/ListingCard';
import { formatPrice, getStateLabel, getCategoryLabel } from '../types';
import { Loader, ArrowLeft } from 'lucide-react';

export const ListingDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [similarListings, setSimilarListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadListing = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getListing(id);
        if (!data) {
          setError('Annonce non trouvée');
          return;
        }
        setListing(data);

        // Load similar listings
        const similar = await getSimilarListings(data);
        setSimilarListings(similar);
      } catch (err) {
        console.error('Error loading listing:', err);
        setError('Erreur lors du chargement de l\'annonce');
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft size={20} /> Retour aux annonces
          </button>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
            <p className="text-gray-600 mb-6">L'annonce que vous cherchez n'existe pas ou a été supprimée.</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Retourner à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-primary hover:underline mb-8 font-medium"
        >
          <ArrowLeft size={20} /> Retour aux annonces
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <ImageGallery images={listing.photos} title={listing.title} />
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                  <p className="text-gray-600">{listing.description}</p>
                </div>
                <FavoriteButton listingId={listing.id} className="flex-shrink-0" />
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Catégorie</p>
                  <p className="font-semibold text-gray-900">{getCategoryLabel(listing.category)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">État</p>
                  <p className="font-semibold text-gray-900">{getStateLabel(listing.state)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ville</p>
                  <p className="font-semibold text-gray-900">📍 {listing.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Publié</p>
                  <p className="font-semibold text-gray-900">
                    {listing.createdAt.toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Price and Contact */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-24">
              <p className="text-sm text-gray-500 mb-2">Prix</p>
              <p className="text-4xl font-bold text-primary mb-6">
                {formatPrice(listing.price)}
                <span className="text-sm text-gray-500 ml-2">Ar</span>
              </p>

              {/* Vendor Info */}
              <div className="mb-6 pb-6 border-b">
                <p className="text-sm text-gray-500 mb-3">Vendeur</p>
                <VendorInfo userId={listing.userId} vendorName={listing.vendorName} />
              </div>

              {/* Contact Buttons */}
              <ContactButtons
                phoneNumber={listing.vendorPhone}
                vendorName={listing.vendorName}
              />
            </div>
          </div>
        </div>

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Annonces similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarListings.map((l) => (
                <ListingCard
                  key={l.id}
                  id={l.id}
                  title={l.title}
                  price={l.price}
                  city={l.city}
                  state={l.state}
                  photo={l.photos[0]}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
