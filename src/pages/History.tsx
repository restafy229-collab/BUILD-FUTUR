import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { pb, type Response, type Quiz, type Session } from '../lib/pocketbase'

interface HistoryItem {
  id: string
  quiz: Quiz
  session: Session
  score: number
  rank: number
  total: number
  date: string
}

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export default function History() {
  const { user, isAuthenticated } = useAuthStore()
  
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [toast, setToast] = useState<Toast | null>(null)
  const [filter, setFilter] = useState<'all' | 'won' | 'played'>('all')
  
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    setToast({ id: Date.now().toString(), message, type })
    setTimeout(() => setToast(null), 3000)
  }
  
  useEffect(() => {
    loadHistory()
  }, [])
  
  const loadHistory = async () => {
    if (!user?.id) return
    
    setLoading(true)
    
    try {
      // Get user's participation history
      const participations = await pb.collection('participants').getFullList({
        filter: `user="${user.id}"`,
        sort: '-joined',
      })
      
      // Get quiz and session details for each
      const items = await Promise.all(
        participations.map(async (p: any) => {
          const [quiz, session] = await Promise.all([
            pb.collection('quizzes').getOne(p.quiz),
            pb.collection('sessions').getOne(p.session),
          ])
          
          // Get rank
          const allParticipants = await pb.collection('participants').getFullList({
            filter: `session="${p.session}"`,
            sort: '-score',
          })
          
          const rank = allParticipants.findIndex((pp: any) => pp.id === p.id) + 1
          
          return {
            id: p.id,
            quiz,
            session,
            score: p.score,
            rank,
            total: allParticipants.length,
            date: p.joined,
          }
        })
      )
      
      setHistory(items)
    } catch (e: any) {
      showToast('Erreur: ' + e.message, 'error')
    } finally {
      setLoading(false)
    }
  }
  
  const filteredHistory = history.filter(h => {
    if (filter === 'won') return h.rank === 1
    return true
  })
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-semibold mb-2">Connexion requise</h2>
          <p className="text-gray-500 mb-6">Connectez-vous pour voir votre historique</p>
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historique</h1>
            <p className="text-gray-500">Vos parties jouées</p>
          </div>
          <Link to="/dashboard" className="btn-secondary">
            ← Dashboard
          </Link>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === 'all' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            Tout
          </button>
          <button
            onClick={() => setFilter('played')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === 'played' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            Joués
          </button>
          <button
            onClick={() => setFilter('won')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === 'won' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            Victoires
          </button>
        </div>
        
        {/* History List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-kif-orange border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="font-semibold mb-2">Aucune partie</h3>
            <p className="text-gray-500 mb-4">Rejoignez une session pour jouer!</p>
            <Link to="/join" className="btn-primary">
              Rejoindre
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      item.rank === 1 ? 'bg-yellow-400' :
                      item.rank === 2 ? 'bg-gray-300' :
                      item.rank === 3 ? 'bg-orange-300' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {item.rank}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.quiz?.title || 'Quiz'}</p>
                      <p className="text-sm text-gray-500">{item.session?.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-kif-orange">{item.score}</p>
                    <p className="text-sm text-gray-500">pts</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(item.date).toLocaleDateString('fr')}</span>
                  <span>{item.rank}/{item.total} place{item.total !== 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
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