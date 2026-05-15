import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { pb, type User } from '../lib/pocketbase'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface Payment {
  id: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  method: string
  provider: string
  reference: string
  plan_type: string
  user_id: string
  created: string
  completed?: string
}

interface UserInfo {
  id: string
  username: string
  email: string
}

const showToast = (setToast: (t: Toast | null) => void, message: string, type: Toast['type'] = 'info') => {
  setToast({ id: Date.now().toString(), message, type })
  setTimeout(() => setToast(null), 3000)
}

export default function Payments() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const [payments, setPayments] = useState<Payment[]>([])
  const [users, setUsers] = useState<Map<string, UserInfo>>(new Map())
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<Toast | null>(null)
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all')
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    loadPayments()
  }, [])
  
  const loadPayments = async () => {
    setLoading(true)
    try {
      const data = await pb.collection('payments').getFullList<Payment>({
        sort: '-created',
      })
      setPayments(data)
      
      // Get unique user IDs and fetch user info
      const userIds = [...new Set(data.map(p => p.user_id))]
      const userData = await Promise.all(
        userIds.map(id => pb.collection('users').getOne(id).catch(() => null))
      )
      
      const userMap = new Map<string, UserInfo>()
      userData.forEach((u, i) => {
        if (u) userMap.set(userIds[i], { id: u.id, username: u.username, email: u.email })
      })
      setUsers(userMap)
    } catch (e) {
      showToast(setToast, 'Erreur', 'error')
    } finally {
      setLoading(false)
    }
  }
  
  const handleRefund = async (id: string) => {
    if (!confirm('Confirmer le remboursement?')) return
    try {
      await pb.collection('payments').update(id, { status: 'refunded' })
      showToast(setToast, 'Remboursement validé', 'success')
      loadPayments()
    } catch (e) {
      showToast(setToast, 'Erreur', 'error')
    }
  }
  
  const filtered = payments.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false
    if (search) {
      const userInfo = users.get(p.user_id)
      const searchLower = search.toLowerCase()
      return p.reference.toLowerCase().includes(searchLower) || 
             userInfo?.username.toLowerCase().includes(searchLower) ||
             userInfo?.email.toLowerCase().includes(searchLower)
    }
    return true
  })
  
  const stats = {
    total: payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    count: payments.length,
    completed: payments.filter(p => p.status === 'completed').length,
  }
  
  if (!user) {
    navigate('/login')
    return null
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
            <p className="text-gray-500">Historique et gestion des transactions</p>
          </div>
          <Link to="/dashboard" className="btn-secondary">
            ← Dashboard
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total reçu</p>
            <p className="text-2xl font-bold text-green-600">{stats.total.toLocaleString()} FCA</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">En attente</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending.toLocaleString()} FCA</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Réussies</p>
            <p className="text-2xl font-bold text-kif-orange">{stats.completed}</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="input-field md:w-64"
          />
          <div className="flex gap-2">
            {(['all', 'completed', 'pending', 'failed'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === f ? 'bg-kif-orange text-white' : 'bg-white text-gray-600'
                }`}
              >
                {f === 'all' ? 'Tout' : f}
              </button>
            ))}
          </div>
        </div>
        
        {/* Payments List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-kif-orange border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="font-semibold mb-2">Aucun paiement</h3>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Référence</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Utilisateur</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Montant</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Méthode</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Plan</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Statut</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((p) => {
                    const userInfo = users.get(p.user_id)
                    return (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm">{p.reference}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">{userInfo?.username || '-'}</div>
                          <div className="text-xs text-gray-400">{userInfo?.email}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold">{p.amount.toLocaleString()} FCA</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm capitalize">{p.provider}</div>
                          <div className="text-xs text-gray-400">{p.method}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm capitalize">{p.plan_type}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            p.status === 'completed' ? 'bg-green-100 text-green-700' :
                            p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            p.status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">{new Date(p.created).toLocaleDateString('fr')}</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {p.status === 'completed' && (
                            <button 
                              onClick={() => handleRefund(p.id)}
                              className="text-red-500 text-sm hover:text-red-700"
                            >
                              Remplacer
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
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