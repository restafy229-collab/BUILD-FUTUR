import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { pb, type Session, type Quiz, type Question, type Participant } from '../lib/pocketbase'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export default function SessionLive() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  
  const [session, setSession] = useState<Session | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20)
  const [isHost, setIsHost] = useState(false)
  const [view, setView] = useState<'waiting' | 'question' | 'result' | 'leaderboard'>('waiting')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<Toast | null>(null)
  
  const timerRef = useRef<NodeJS.Timeout>()

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    setToast({ id: Date.now().toString(), message, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    loadSession()
    return () => {
      pb.collection('sessions').unsubscribe()
    }
  }, [id])

  useEffect(() => {
    if (view === 'question' && isHost && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current)
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [view, isHost])

  const loadSession = async () => {
    if (!id) return
    
    setLoading(true)
    
    try {
      const s = await pb.collection('sessions').getOne<Session>(id)
      setSession(s)
      
      if (!s) {
        showToast('Session introuvable', 'error')
        navigate('/dashboard')
        return
      }
      
      // Check auth
      if (!pb.authStore.isValid) {
        sessionStorage.setItem('pending_session', id)
        navigate('/login')
        return
      }
      
      const [q, qs, ps] = await Promise.all([
        pb.collection('quizzes').getOne<Quiz>(s.quiz),
        pb.collection('questions').getFullList<Question>({ filter: `quiz="${s.quiz}"`, sort: 'order' }),
        pb.collection('participants').getFullList<Participant>({ filter: `session="${s.id}"`, sort: '-score' }),
      ])
      
      setQuiz(q)
      setQuestions(qs)
      setParticipants(ps)
      
      // Check host
      if (pb.authStore.model?.id === s.host) {
        setIsHost(true)
      }
      
      // Set view based on session status
      if (s.status === 'active') {
        setView('question')
        setCurrentQIndex(s.current_question || 0)
        setTimeLeft(qs[s.current_question || 0]?.time_limit || 20)
      } else if (s.status === 'ended') {
        setView('leaderboard')
      }
      
      // Subscribe to realtime
      pb.collection('sessions').subscribe('*', ({ action, record }) => {
        if ((record as Session).id === id && action === 'update') {
          const updated = record as Session
          if (updated.status === 'active') {
            setView('question')
            setCurrentQIndex(updated.current_question || 0)
          } else if (updated.status === 'ended') {
            setView('leaderboard')
          }
        }
      })
      
      showToast('Connecté !', 'success')
    } catch (e: any) {
      console.error(e)
      showToast('Erreur: ' + (e.message || 'Session introuvable'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const startSession = async () => {
    if (!id || !isHost) return
    
    try {
      await pb.collection('sessions').update(id, { 
        status: 'active', 
        started: new Date().toISOString() 
      })
      setView('question')
      setTimeLeft(questions[0]?.time_limit || 20)
    } catch (e: any) {
      showToast('Erreur: ' + e.message, 'error')
    }
  }

  const nextQuestion = async () => {
    if (!isHost || !id) return
    
    if (currentQIndex < questions.length - 1) {
      const nextIndex = currentQIndex + 1
      setCurrentQIndex(nextIndex)
      await pb.collection('sessions').update(id, { current_question: nextIndex })
      setSelectedAnswer(null)
      setShowResult(false)
      setTimeLeft(questions[nextIndex]?.time_limit || 20)
    } else {
      endSession()
    }
  }

  const endSession = async () => {
    if (!id || !isHost) return
    
    try {
      await pb.collection('sessions').update(id, { status: 'ended' })
      setView('leaderboard')
    } catch (e: any) {
      showToast('Erreur: ' + e.message, 'error')
    }
  }

  const handleAnswer = async (index: number) => {
    if (selectedAnswer !== null || !user) return
    
    setSelectedAnswer(index)
    setShowResult(true)
    
    const q = questions[currentQIndex]
    const isCorrect = index === q.correct_index
    const points = isCorrect ? q.points : 0
    
    try {
      await pb.collection('responses').create({
        session: id,
        participant: user.id,
        question: q.id,
        answer_index: index,
        response_ms: (20 - timeLeft) * 1000,
        points,
        is_correct: isCorrect,
      })
    } catch (e) {
      console.error(e)
    }
  }

  const currentQuestion = questions[currentQIndex]
  const myScore = participants.find(p => p.user === user?.id)?.score || 0
  const myPosition = participants.findIndex(p => p.user === user?.id) + 1

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-kif-orange border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Connexion à la session...</p>
        </div>
      </div>
    )
  }

  // Waiting View
  if (view === 'waiting') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md w-full">
          <div className="text-6xl mb-6">⏳</div>
          <h2 className="text-2xl font-bold mb-2">
            {isHost ? 'Prêt à lancer' : 'En attente...'}
          </h2>
          <p className="text-gray-500 mb-6">
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </p>
          
          {/* Session Code for Host */}
          {isHost && session && (
            <div className="bg-gray-900 text-white p-4 rounded-xl mb-6">
              <p className="text-sm text-gray-400 mb-1">Code de session</p>
              <p className="text-3xl font-mono font-bold tracking-widest">{session.code}</p>
            </div>
          )}
          
          {isHost ? (
            <button onClick={startSession} className="btn-primary text-lg px-8">
              🚀 Lancer le quiz
            </button>
          ) : (
            <p className="text-gray-400">L'hôte va bientôt démarrer...</p>
          )}
          
          {/* Participant list */}
          <div className="mt-8 text-left">
            <h3 className="font-semibold mb-3">Participants</h3>
            <div className="space-y-2">
              {participants.slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span>Participant {i + 1}</span>
                  <span className="ml-auto font-medium">{p.score} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Question View
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
              ← Quitter
            </Link>
            <h1 className="font-bold">{quiz?.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {isHost ? `Participants: ${participants.length}` : `Rang: #${myPosition}`}
            </p>
            <p className="font-bold text-kif-orange">{myScore} pts</p>
          </div>
        </div>

        {/* Timer (Host only) */}
        {isHost && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                Q{currentQIndex + 1}/{questions.length}
              </span>
              <span className={`text-3xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-kif-orange'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-kif-orange transition-all duration-1000"
                style={{ width: `${(timeLeft / (currentQuestion?.time_limit || 20)) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question */}
        {currentQuestion && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
            <h2 className="text-xl font-semibold mb-6 text-center">{currentQuestion.text}</h2>
            
            {/* Choices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.choices?.map((choice, i) => {
                const isSelected = selectedAnswer === i
                const isCorrect = currentQuestion.correct_index === i
                const showCorrect = showResult && isCorrect
                const showWrong = showResult && isSelected && !isCorrect
                
                return (
                  <button
                    key={i}
                    onClick={() => isHost && handleAnswer(i)}
                    disabled={selectedAnswer !== null || !isHost}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      showCorrect ? 'border-green-500 bg-green-50' :
                      showWrong ? 'border-red-500 bg-red-50' :
                      isSelected ? 'border-kif-orange bg-orange-50' :
                      'border-gray-200 hover:border-kif-orange'
                    }`}
                  >
                    <span className="font-mono font-bold mr-2">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {choice}
                  </button>
                )
              })}
            </div>

            {/* Result */}
            {showResult && (
              <div className={`mt-4 p-4 rounded-xl text-center ${
                selectedAnswer === currentQuestion.correct_index
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {selectedAnswer === currentQuestion.correct_index 
                  ? `✓ Correct ! +${currentQuestion.points} pts`
                  : `✗ La réponse était ${String.fromCharCode(65 + currentQuestion.correct_index)}`
                }
              </div>
            )}
          </div>
        )}

        {/* Host Controls */}
        {isHost && showResult && (
          <div className="flex justify-center gap-3">
            <button onClick={nextQuestion} className="btn-primary">
              {currentQIndex < questions.length - 1 ? 'Question suivante →' : '🏆 Terminer'}
            </button>
          </div>
        )}

        {/* Leaderboard */}
        {(view === 'leaderboard' || showResult) && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold mb-4">🏆 Classement</h3>
            <div className="space-y-2">
              {participants.slice(0, 10).map((p, i) => (
                <div 
                  key={p.id} 
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    p.user === user?.id ? 'bg-kif-orange/10 border border-kif-orange' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                      i === 0 ? 'bg-yellow-400 text-yellow-900' :
                      i === 1 ? 'bg-gray-300' :
                      i === 2 ? 'bg-orange-300' : 'bg-gray-200'
                    }`}>
                      {i + 1}
                    </span>
                    <span className="font-medium">
                      {p.user === user?.id ? 'Vous' : `Participant ${i + 1}`}
                    </span>
                  </div>
                  <span className="font-bold">{p.score} pts</span>
                </div>
              ))}
            </div>
            
            {view === 'leaderboard' && (
              <button onClick={() => navigate('/dashboard')} className="btn-primary w-full mt-4">
                Retour au dashboard
              </button>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg ${
          toast.type === 'success' ? 'bg-green-500' :
          toast.type === 'error' ? 'bg-red-500' : 'bg-gray-800'
        } text-white`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}