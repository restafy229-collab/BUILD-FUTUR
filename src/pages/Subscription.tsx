import { useState } from 'react'
import { Link } from 'react-router-dom'

type Language = 'en' | 'fr'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

const showToast = (setToast: (t: Toast | null) => void, message: string, type: Toast['type'] = 'info') => {
  setToast({ id: Date.now().toString(), message, type })
  setTimeout(() => setToast(null), 3000)
}

// Check current subscription status
const checkSubscription = async () => {
  try {
    const { pb } = await import('../lib/pocketbase')
    const user = pb.authStore.model
    if (!user) return null
    
    const subscription = await pb.collection('subscriptions').getFirstListItem(`user="${user.id}"`)
    return subscription
  } catch (e) {
    return null
  }
}

// Cancel subscription
const cancelSubscription = async (setToast: (t: Toast | null) => void) => {
  try {
    const { pb } = await import('../lib/pocketbase')
    const user = pb.authStore.model
    if (!user) return
    
    await pb.collection('subscriptions').getFirstListItem(`user="${user.id}"`).then(sub => {
      return pb.collection('subscriptions').update(sub.id, { status: 'cancelled' })
    })
    
    showToast(setToast, 'Abonnement annulé', 'success')
  } catch (e: any) {
    showToast(setToast, 'Erreur: ' + e.message, 'error')
  }
}

const translations = {
  en: {
    title: 'My Subscription',
    currentPlan: 'Current Plan',
    status: 'Status',
    active: 'Active',
    cancelled: 'Cancelled',
    expired: 'Expired',
    nextBilling: 'Next billing',
    billingHistory: 'Billing History',
    noSubscription: 'No active subscription',
    upgrade: 'Upgrade Plan',
    cancel: 'Cancel Subscription',
    confirmCancel: 'Are you sure? You will lose access at end of billing period.',
    plans: {
      free: 'Free',
      pro: 'Pro',
      school: 'School',
    },
  },
  fr: {
    title: 'Mon Abonnement',
    currentPlan: 'Plan actuel',
    status: 'Statut',
    active: 'Actif',
    cancelled: 'Annulé',
    expired: 'Expiré',
    nextBilling: 'Prochain débit',
    billingHistory: 'Historique de facturation',
    noSubscription: 'Aucun abonnement actif',
    upgrade: 'Passer à un plan supérieur',
    cancel: 'Annuler mon abonnement',
    confirmCancel: 'Êtes-vous sûr? Vous perdrez l\'accès à la fin de la période.',
    plans: {
      free: 'Gratuit',
      pro: 'Pro',
      school: 'École',
    },
  },
}

export default function Subscription() {
  const [lang, setLang] = useState<Language>('fr')
  const [toast, setToast] = useState<Toast | null>(null)
  const [loading, setLoading] = useState(false)
  const t = translations[lang]
  
  // Mock subscription data (replace with real API call)
  const subscription = null // TODO: connect to real data
  
  const handleCancel = async () => {
    if (!confirm(t.confirmCancel)) return
    setLoading(true)
    await cancelSubscription(setToast)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')} className="text-sm text-gray-500">
            {lang === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
        </div>

        {/* Current Plan */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-500 mb-4">{t.currentPlan}</h2>
          
          {subscription ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-kif-orange">{subscription.plan}</p>
                  <p className="text-gray-500">{subscription.amount.toLocaleString()} FCA/{lang === 'fr' ? 'mois' : 'month'}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {subscription.status === 'active' ? t.active : t.cancelled}
                </span>
              </div>
              
              {subscription.status === 'active' && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">{t.nextBilling}: {new Date(subscription.next_billing).toLocaleDateString('fr')}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-4xl mb-2">🎁</div>
              <p className="text-gray-500 mb-4">{t.noSubscription}</p>
              <Link to="/pricing" className="btn-primary">
                {t.upgrade}
              </Link>
            </div>
          )}
        </div>

        {/* Billing History */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-gray-500 mb-4">{t.billingHistory}</h2>
          
          {subscription?.history?.length ? (
            <div className="space-y-3">
              {subscription.history.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm">{new Date(item.date).toLocaleDateString('fr')}</p>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.amount.toLocaleString()} FCA</p>
                    <p className={`text-xs ${item.status === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                      {item.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-4">{lang === 'fr' ? 'Aucun historique' : 'No history'}</p>
          )}
        </div>

        {/* Cancel Button */}
        {subscription && subscription.status === 'active' && (
          <div className="mt-6 p-6 bg-red-50 rounded-xl">
            <button 
              onClick={handleCancel}
              disabled={loading}
              className="w-full text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
            >
              {loading ? '...' : t.cancel}
            </button>
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