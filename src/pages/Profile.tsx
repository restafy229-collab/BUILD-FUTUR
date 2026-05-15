import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { pb, type User } from '../lib/pocketbase'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [stats, setStats] = useState({ quizzes: 0, sessions: 0, participants: 0 })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    setToast({ id: Date.now().toString(), message, type })
    setTimeout(() => setToast(null), 3000)
  }
  
  useEffect(() => {
    loadStats()
  }, [])
  
  const loadStats = async () => {
    if (!user?.id) return
    
    try {
      const [quizzes, sessions, participants] = await Promise.all([
        pb.collection('quizzes').getFullList({ filter: `host="${user.id}"` }),
        pb.collection('sessions').getFullList({ filter: `host="${user.id}"` }),
        pb.collection('participants').getFullList({ filter: `user="${user.id}"` }),
      ])
      
      setStats({
        quizzes: quizzes.length,
        sessions: sessions.length,
        participants: participants.length,
      })
    } catch (e) {
      console.error(e)
    }
  }
  
  const handleLogout = async () => {
    await logout()
    navigate('/')
  }
  
  const handleDeleteAccount = async () => {
    if (!user?.id) return
    
    if (!confirm('Êtes-vous sûr? Cette action est irréversible.')) {
      return
    }
    
    setLoading(true)
    
    try {
      // Delete user's data
      await pb.collection('users').delete(user.id)
      
      showToast('Compte supprimé', 'success')
      handleLogout()
    } catch (e: any) {
      showToast('Erreur: ' + (e.message || 'Impossible de supprimer'), 'error')
    } finally {
      setLoading(false)
    }
  }
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
          <p className="text-gray-500 mb-6">Connectez-vous pour voir votre profil</p>
          <Link to="/login" className="btn-primary">
            Se connecter
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-kif-orange to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-4xl font-bold shadow-lg">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
          <p className="text-gray-500">{user?.email}</p>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-kif-orange">{stats.quizzes}</p>
            <p className="text-sm text-gray-500">Quiz</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-kif-blue">{stats.sessions}</p>
            <p className="text-sm text-gray-500">Sessions</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-kif-purple">{stats.participants}</p>
            <p className="text-sm text-gray-500">Participations</p>
          </div>
        </div>
        
        {/* Menu */}
        <div className="space-y-3">
          <Link 
            to="/dashboard"
            className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-xl">📊</span>
            <span className="font-medium">Mes Quiz</span>
            <span className="ml-auto text-gray-400">→</span>
          </Link>
          
          <Link 
            to="/quiz/new"
            className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="text-xl">➕</span>
            <span className="font-medium">Créer un quiz</span>
            <span className="ml-auto text-gray-400">→</span>
          </Link>
          
          <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xl">🔔</span>
            <span className="font-medium">Notifications</span>
            <span className="ml-auto text-gray-400">Bientôt</span>
          </button>
          
          <button className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xl">⚙️</span>
            <span className="font-medium">Paramètres</span>
            <span className="ml-auto text-gray-400">Bientôt</span>
          </button>
        </div>
        
        {/* Danger Zone */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-500 mb-3">Zone dangereuse</h3>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors mb-3"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium text-yellow-700">Se déconnecter</span>
          </button>
          
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
          >
            <span className="text-xl">🗑️</span>
            <span className="font-medium text-red-700">Supprimer mon compte</span>
          </button>
        </div>
        
        {/* Delete Confirm Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-2">Supprimer le compte?</h3>
              <p className="text-gray-500 mb-4">
                Cette action est irréversible. Toutes vos données seront perdues.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 btn-secondary py-2"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600"
                >
                  {loading ? '...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500' :
          toast.type === 'error' ? 'bg-red-500' : 'bg-gray-800'
        } text-white`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}