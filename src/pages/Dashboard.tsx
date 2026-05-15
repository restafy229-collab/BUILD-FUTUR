import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { getQuizzes, getSessions, type Quiz, type Session } from '../lib/pocketbase'

export default function Dashboard() {
  const { user } = useAuthStore()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeTab, setActiveTab] = useState<'quizzes' | 'sessions'>('quizzes')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [q, s] = await Promise.all([
        getQuizzes(),
        getSessions(),
      ])
      // Filter quizzes by current user
      setQuizzes(q.filter((quiz: Quiz) => quiz.host === user?.id))
      setSessions(s)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold">Mon Dashboard</h1>
            <p className="text-gray-600">Bienvenue, {user?.username}</p>
          </div>
          <Link to="/quiz/new" className="btn-primary">
            + Créer un quiz
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'quizzes' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            Mes Quiz ({quizzes.length})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'sessions' ? 'bg-white shadow-sm' : 'text-gray-600'
            }`}
          >
            Sessions ({sessions.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Chargement...</div>
        ) : activeTab === 'quizzes' ? (
          <div>
            {quizzes.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="font-semibold mb-2">Aucun quiz</h3>
                <p className="text-gray-500 mb-4">Créez votre premier quiz !</p>
                <Link to="/quiz/new" className="btn-primary inline-block">
                  Créer un quiz
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizzes.map((quiz) => (
                  <div key={quiz.id} className="card hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        quiz.is_published 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {quiz.is_published ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {quiz.description || 'Aucune description'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Link 
                          to={`/quiz/${quiz.id}/edit`} 
                          className="text-sm text-kif-orange hover:underline"
                        >
                          Modifier
                        </Link>
                        {quiz.is_published && (
                          <button 
                            onClick={() => startSession(quiz.id)}
                            className="text-sm text-kif-blue hover:underline"
                          >
                            Lancer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {sessions.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-4xl mb-4">🎮</div>
                <h3 className="font-semibold mb-2">Aucune session</h3>
                <p className="text-gray-500">Lancez un quiz pour créer une session</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="card flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          session.status === 'active' ? 'bg-green-500 animate-pulse' :
                          session.status === 'waiting' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`} />
                        <span className="font-medium">{session.code}</span>
                        <span className="text-sm text-gray-500">
                          ({session.mode})
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Créé le {new Date(session.created).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <Link 
                      to={`/session/${session.id}`}
                      className="btn-secondary text-sm py-2"
                    >
                      Rejoindre
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

async function startSession(quizId: string) {
  // This would create a session - placeholder for now
  console.log('Starting session for quiz:', quizId)
}