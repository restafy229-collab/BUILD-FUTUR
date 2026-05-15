import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, logout } = useAuthStore()

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-kif-orange to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">⚡</span>
            </div>
            <span className="font-display font-bold text-xl">KifLearn</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">Accueil</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">Dashboard</Link>
            )}
          </nav>
          
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user?.username}</span>
                <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2">Se connecter</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Commencer</Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}