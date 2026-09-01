import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AlertCircle, Loader } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('Cet utilisateur n\'existe pas');
      } else if (err.code === 'auth/wrong-password') {
        setError('Mot de passe incorrect');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide');
      } else {
        setError('Erreur de connexion. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Se connecter</h1>

          {error && (
            <div className="mb-6 flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
              {loading && <Loader size={18} className="animate-spin" />}
              Se connecter
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Pas encore inscrit?{' '}
            <a href="/signup" className="text-primary hover:underline font-medium">
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
