import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { createVendorProfile } from '../services/vendors';
import { AlertCircle, Loader } from 'lucide-react';

export const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isShop, setIsShop] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create vendor profile
      await createVendorProfile(user.uid, {
        email,
        name,
        phone,
        isShop,
      });

      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide');
      } else {
        setError('Erreur lors de l\'inscription. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Créer un compte</h1>

          {error && (
            <div className="mb-6 flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
                disabled={loading}
              />
            </div>

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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone / WhatsApp
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="+261 32 12 345 67"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isShop"
                type="checkbox"
                checked={isShop}
                onChange={(e) => setIsShop(e.target.checked)}
                className="rounded"
                disabled={loading}
              />
              <label htmlFor="isShop" className="text-sm text-gray-700">
                Je suis une boutique professionnelle
              </label>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
              {loading && <Loader size={18} className="animate-spin" />}
              S'inscrire
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Déjà inscrit?{' '}
            <a href="/login" className="text-primary hover:underline font-medium">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
