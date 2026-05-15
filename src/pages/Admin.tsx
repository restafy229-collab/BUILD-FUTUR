import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { pb, type User as PBUser, type Quiz, type Session } from '../lib/pocketbase'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface AdminStats {
  users: number
  quizzes: number
  sessions: number
  participants: number
}

export default function Admin() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats>({ users: 0, quizzes: 0, sessions: 0, participants: 0 })
  const [users, setUsers] = useState<PBUser[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'quizzes' | 'sessions'>('overview')
  const [toast, setToast] = useState<Toast | null>(null)
  
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    setToast({ id: Date.now().toString(), message, type })
    setTimeout(() => setToast(null), 3000)
  }
  
  // Check admin role (only admins can access)
  useEffect(() => {
    if (user?.role !== 'admin') {
      showToast('Accès administrateur requis', 'error')
      navigate('/dashboard')
      return
    }
    loadData()
  }, [user])
  
  const loadData = async () => {
    setLoading(true)
    
    try {
      const [allUsers, allQuizzes, allSessions, allParticipants] = await Promise.all([
        pb.collection('users').getFullList<PBUser>(),
        pb.collection('quizzes').getFullList<Quiz>(),
        pb.collection('sessions').getFullList<Session>(),
        pb.collection('participants').getFullList(),
      ])
      
      setUsers(allUsers)
      setStats({
        users: allUsers.length,
        quizzes: allQuizzes.length,
        sessions: allSessions.length,
        participants: allParticipants.length,
      })
    } catch (e: any) {
      showToast('Erreur: ' + e.message, 'error')
    } finally {
      setLoading(false)
    }
  }
  
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Supprimer cet utilisateur?')) return
    
    try {
      await pb.collection('users').delete(userId)
      showToast('Utilisateur supprimé', 'success')
      loadData()
    } catch (e: any) {
      showToast('Erreur: ' + e.message, 'error')
    }
  }
  
  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Supprimer ce quiz?')) return
    
    try {
      await pb.collection('quizzes').delete(quizId)
      showToast('Quiz supprimé', 'success')
      loadData()
    } catch (e: any) {
      showToast('Erreur: ' + e.message, 'error')
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-kif-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Administration</h1>
            <p className="text-gray-500">Gestion de la plateforme</p>
          </div>
          <Link to="/dashboard" className="btn-secondary">
            ← Dashboard
          </Link>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg overflow-x-auto">
          {['overview', 'users', 'quizzes', 'sessions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'overview' && '📊 Aperçu'}
              {tab === 'users' && `👥 Utilisateurs (${stats.users})`}
              {tab === 'quizzes' && `📝 Quiz (${stats.quizzes})`}
              {tab === 'sessions' && `🎮 Sessions (${stats.sessions})`}
            </button>
          ))}
        </div>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-3xl font-bold text-kif-orange">{stats.users}</p>
              <p className="text-gray-500">Utilisateurs</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-3xl font-bold text-kif-blue">{stats.quizzes}</p>
              <p className="text-gray-500">Quiz</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-3xl font-bold text-kif-purple">{stats.sessions}</p>
              <p className="text-gray-500">Sessions</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-3xl font-bold text-green-500">{stats.participants}</p>
              <p className="text-gray-500">Participations</p>
            </div>
          </div>
        )}
        
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Utilisateur</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Rôle</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Créé le</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{u.username}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          u.role === 'host' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {u.role || 'participant'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(u.created).toLocaleDateString('fr')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-gray-500 text-center py-8">
              Liste des quiz - cliquez sur un utilisateur pour voir ses quiz
            </p>
          </div>
        )}
        
        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-gray-500 text-center py-8">
              Liste des sessions actives
            </p>
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