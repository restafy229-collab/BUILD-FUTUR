import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { 
  getQuiz, getQuestions, createQuiz, updateQuiz, 
  createQuestion, updateQuestion, deleteQuestion,
  type Quiz, type Question 
} from '../lib/pocketbase'

export default function QuizEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const [quiz, setQuiz] = useState<Partial<Quiz>>({
    title: '',
    description: '',
    visibility: 'private',
    language: 'fr',
    time_per_question: 20,
    points_correct: 100,
    points_incorrect: -10,
    is_published: false,
  })
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({
    type: 'mcq',
    text: '',
    choices: ['', '', '', ''],
    correct_index: 0,
    explanation: '',
    time_limit: 20,
    points: 100,
    order: 0,
  })
  const [activeTab, setActiveTab] = useState<'info' | 'questions' | 'review'>('info')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      loadQuiz()
    }
  }, [id])

  const loadQuiz = async () => {
    if (!id) return
    setLoading(true)
    try {
      const q = await getQuiz(id)
      const qs = await getQuestions(id)
      setQuiz(q)
      setQuestions(qs)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const handleSaveQuiz = async () => {
    setSaving(true)
    try {
      if (id) {
        await updateQuiz(id, quiz)
      } else {
        const newQuiz = await createQuiz({
          ...quiz,
          host: user?.id,
        })
        navigate(`/quiz/${newQuiz.id}/edit`, { replace: true })
      }
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  const handleAddQuestion = async () => {
    if (!id) {
      alert('Sauvegardez le quiz d\'abord')
      return
    }
    try {
      const q = await createQuestion({
        ...currentQuestion,
        quiz: id,
        order: questions.length,
      })
      setQuestions([...questions, q])
      setCurrentQuestion({
        type: 'mcq',
        text: '',
        choices: ['', '', '', ''],
        correct_index: 0,
        explanation: '',
        time_limit: 20,
        points: 100,
        order: questions.length + 1,
      })
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdateQuestion = async (qId: string, data: Partial<Question>) => {
    try {
      await updateQuestion(qId, data)
      setQuestions(questions.map(q => q.id === qId ? { ...q, ...data } : q))
    } catch (e) {
      console.error(e)
    }
  }

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm('Supprimer cette question ?')) return
    try {
      await deleteQuestion(qId)
      setQuestions(questions.filter(q => q.id !== qId))
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-700">
            ← Retour
          </button>
          <div className="flex gap-2">
            <button onClick={handleSaveQuiz} disabled={saving} className="btn-secondary">
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            {questions.length > 0 && (
              <button className="btn-primary">
                Publier
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg w-fit">
          {['info', 'questions', 'review'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                activeTab === tab ? 'bg-white shadow-sm' : 'text-gray-600'
              }`}
            >
              {tab === 'info' && 'Info'}
              {tab === 'questions' && `Questions (${questions.length})`}
              {tab === 'review' && 'Review'}
            </button>
          ))}
        </div>

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="card p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre du quiz</label>
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                className="input-field"
                placeholder="Ex: Python - Les bases"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Description optionnelle..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
                <select
                  value={quiz.language}
                  onChange={(e) => setQuiz({ ...quiz, language: e.target.value as any })}
                  className="input-field"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibilité</label>
                <select
                  value={quiz.visibility}
                  onChange={(e) => setQuiz({ ...quiz, visibility: e.target.value as any })}
                  className="input-field"
                >
                  <option value="private">Privé</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temps/Q (sec)</label>
                <input
                  type="number"
                  value={quiz.time_per_question}
                  onChange={(e) => setQuiz({ ...quiz, time_per_question: parseInt(e.target.value) })}
                  className="input-field"
                  min={5}
                  max={120}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Points juste</label>
                <input
                  type="number"
                  value={quiz.points_correct}
                  onChange={(e) => setQuiz({ ...quiz, points_correct: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Points faux</label>
                <input
                  type="number"
                  value={quiz.points_incorrect}
                  onChange={(e) => setQuiz({ ...quiz, points_incorrect: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            {/* Existing Questions */}
            {questions.map((q, i) => (
              <div key={q.id} className="card p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-500">Q{i + 1}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <p className="font-medium mb-2">{q.text}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {q.choices?.map((c, j) => (
                    <div key={j} className={`p-2 rounded ${
                      q.correct_index === j ? 'bg-green-100 text-green-700' : 'bg-gray-50'
                    }`}>
                      {String.fromCharCode(65 + j)}: {c}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Add Question Form */}
            <div className="card p-4">
              <h3 className="font-semibold mb-4">Ajouter une question</h3>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={currentQuestion.type}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value as any })}
                  className="input-field"
                >
                  <option value="mcq">QCM (4 choix)</option>
                  <option value="true_false">Vrai / Faux</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <textarea
                  value={currentQuestion.text}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                  className="input-field"
                  rows={2}
                  placeholder="Énoncé de la question..."
                />
              </div>

              {currentQuestion.type === 'mcq' && (
                <div className="mb-3 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Choix</label>
                  {currentQuestion.choices?.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct"
                        checked={currentQuestion.correct_index === i}
                        onChange={() => setCurrentQuestion({ ...currentQuestion, correct_index: i })}
                      />
                      <input
                        type="text"
                        value={c}
                        onChange={(e) => {
                          const newChoices = [...(currentQuestion.choices || [])]
                          newChoices[i] = e.target.value
                          setCurrentQuestion({ ...currentQuestion, choices: newChoices })
                        }}
                        placeholder={`Choix ${String.fromCharCode(65 + i)}`}
                        className="input-field flex-1"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Explication</label>
                <input
                  type="text"
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
                  className="input-field"
                  placeholder="Explication de la réponse..."
                />
              </div>

              <button 
                onClick={handleAddQuestion}
                disabled={!currentQuestion.text}
                className="btn-primary"
              >
                + Ajouter la question
              </button>
            </div>
          </div>
        )}

        {/* Review Tab */}
        {activeTab === 'review' && (
          <div className="card p-6 text-center">
            <h3 className="font-semibold mb-2">{quiz.title || 'Quiz sans titre'}</h3>
            <p className="text-gray-500 mb-4">{questions.length} questions</p>
            
            {questions.length === 0 ? (
              <p className="text-orange-500">Ajoutez au moins une question pour publier</p>
            ) : quiz.is_published ? (
              <p className="text-green-600">✓ Quiz publié</p>
            ) : (
              <button className="btn-primary">
                Publier le quiz
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}