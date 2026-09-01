import { useEffect, useState } from 'react';
import { useAuthStore } from '../store';
import { getVendorProfile } from '../services/vendors';
import { VendorProfile } from '../types';
import { Briefcase } from 'lucide-react';

interface VendorInfoProps {
  userId: string;
  vendorName: string;
}

export const VendorInfo = ({ userId, vendorName }: VendorInfoProps) => {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const vendorProfile = await getVendorProfile(userId);
        setProfile(vendorProfile);
      } catch (error) {
        console.error('Error fetching vendor profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return <div className="text-gray-500">Chargement...</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
        <span className="font-bold text-primary text-lg">
          {vendorName.charAt(0).toUpperCase()}
        </span>
      </div>
      <div>
        <p className="font-semibold text-gray-900">{vendorName}</p>
        {profile?.isShop && (
          <div className="flex items-center gap-1">
            <Briefcase size={14} className="text-primary" />
            <span className="badge-shop">Boutique vérifiée</span>
          </div>
        )}
      </div>
    </div>
  );
};
