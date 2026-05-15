import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import { pb, type User } from '../lib/pocketbase'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface Voucher {
  id: string
  code: string
  discount: number
  type: 'percent' | 'fixed'
  plan: 'pro' | 'school' | 'event'
  expires: string
  used: number
  max_uses: number
  created: string
}

const showToast = (setToast: (t: Toast | null) => void, message: string, type: Toast['type'] = 'info') => {
  setToast({ id: Date.now().toString(), message, type })
  setTimeout(() => setToast(null), 3000)
}

export default function Vouchers() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<Toast | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  
  // Form state
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState(10)
  const [type, setType] = useState<'percent' | 'fixed'>('percent')
  const [plan, setPlan] = useState<'pro' | 'school' | 'event'>('event')
  const [maxUses, setMaxUses] = useState(100)
  
  useEffect(() => {
    loadVouchers()
  }, [])
  
  const loadVouchers = async () => {
    setLoading(true)
    try {
      const data = await pb.collection('vouchers').getFullList<Voucher>()
      setVouchers(data)
    } catch (e) {
      showToast(setToast, 'Erreur lors du chargement', 'error')
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      showToast(setToast, 'Code requis', 'error')
      return
    }
    
    try {
      await pb.collection('vouchers').create({
        code: code.toUpperCase(),
        discount,
        type,
        plan,
        max_uses: maxUses,
        used: 0,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      
      showToast(setToast, 'Code créé!', 'success')
      setShowCreate(false)
      setCode('')
      loadVouchers()
    } catch (e: any) {
      showToast(setToast, e.message || 'Erreur', 'error')
    }
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce code?')) return
    try {
      await pb.collection('vouchers').delete(id)
      showToast(setToast, 'Code supprimé', 'success')
      loadVouchers()
    } catch (e) {
      showToast(setToast, 'Erreur', 'error')
    }
  }
  
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    showToast(setToast, 'Copié!', 'success')
  }
  
  if (!user) {
    navigate('/login')
    return null
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Codes Promo</h1>
            <p className="text-gray-500">Créer et gérer les codes de réduction</p>
          </div>
          <button onClick={() => setShowCreate(!showCreate)} className="btn-primary">
            + Nouveau code
          </button>
        </div>
        
        {/* Create Form */}
        {showCreate && (
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="font-semibold mb-4">Nouveau code promo</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="input-field"
                    placeholder="PROMO2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Utilisation max</label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(parseInt(e.target.value))}
                    className="input-field"
                    min={1}
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Réduction</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(parseInt(e.target.value))}
                    className="input-field"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value as any)} className="input-field">
                    <option value="percent">Pourcentage (%)</option>
                    <option value="fixed">FCFA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <select value={plan} onChange={(e) => setPlan(e.target.value as any)} className="input-field">
                    <option value="event">Événement</option>
                    <option value="pro">Pro</option>
                    <option value="school">École</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">Créer</button>
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Annuler</button>
              </div>
            </form>
          </div>
        )}
        
        {/* Vouchers List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-kif-orange border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : vouchers.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">🎟️</div>
            <h3 className="font-semibold mb-2">Aucun code promo</h3>
            <p className="text-gray-500">Créez votre premier code!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {vouchers.map((v) => (
              <div key={v.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xl font-bold text-kif-orange">{v.code}</span>
                  <button onClick={() => copyCode(v.code)} className="text-gray-400 hover:text-kif-orange">
                    📋
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
                    {v.type === 'percent' ? `${v.discount}%` : `${v.discount} FCA`}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                    {v.plan}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{v.used}/{v.max_uses} utilisés</span>
                  <span>Expire: {new Date(v.expires).toLocaleDateString('fr')}</span>
                </div>
                <button onClick={() => handleDelete(v.id)} className="w-full mt-3 text-red-500 text-sm hover:text-red-700">
                  Supprimer
                </button>
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