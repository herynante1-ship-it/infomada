import { LogOut, Home, Plus, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-primary text-white rounded flex items-center justify-center">
              💻
            </div>
            <span>InfoMada</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4 ml-auto">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="btn-secondary text-sm"
                >
                  Se connecter
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-sm"
                >
                  S'inscrire
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`p-2 rounded-lg transition-colors ${
                    isActive('/') ? 'text-primary' : 'text-gray-600 hover:text-primary'
                  }`}
                  title="Accueil"
                >
                  <Home size={20} />
                </Link>
                <Link
                  to="/create"
                  className={`p-2 rounded-lg transition-colors ${
                    isActive('/create') ? 'text-primary' : 'text-gray-600 hover:text-primary'
                  }`}
                  title="Publier une annonce"
                >
                  <Plus size={20} />
                </Link>
                <Link
                  to="/my-listings"
                  className={`p-2 rounded-lg transition-colors ${
                    isActive('/my-listings') ? 'text-primary' : 'text-gray-600 hover:text-primary'
                  }`}
                  title="Mes annonces"
                >
                  <User size={20} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-600 hover:text-red-600 transition-colors"
                  title="Se déconnecter"
                >
                  <LogOut size={20} />
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
