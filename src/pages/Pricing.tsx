import { useState } from 'react'
import { Link } from 'react-router-dom'

type Language = 'en' | 'fr'

// GeniusPay API Configuration
const GENIUS_PAY_API = 'https://pay.genius.ci/api/v1/merchant'
const GENIUS_PAY_KEY = import.meta.env.VITE_GENIUS_PAY_KEY || ''
const GENIUS_PAY_SECRET = import.meta.env.VITE_GENIUS_PAY_SECRET || ''

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

// Toast helper
const showToast = (setToast: (t: Toast | null) => void, message: string, type: Toast['type'] = 'info') => {
  setToast({ id: Date.now().toString(), message, type })
  setTimeout(() => setToast(null), 3000)
}

// Initiate payment via GeniusPay
const initiatePayment = async (amount: number, description: string, setLoading: (b: boolean) => void, setToast: (t: Toast | null) => void) => {
  if (!GENIUS_PAY_KEY || !GENIUS_PAY_SECRET) {
    showToast(setToast, 'GeniusPay not configured. Set VITE_GENIUS_PAY_KEY in .env', 'error')
    return
  }
  
  setLoading(true)
  showToast(setToast, 'Connecting to GeniusPay...', 'info')
  
  try {
    const response = await fetch(`${GENIUS_PAY_API}/payments`, {
      method: 'POST',
      headers: {
        'X-API-Key': GENIUS_PAY_KEY,
        'X-API-Secret': GENIUS_PAY_SECRET,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount,
        currency: 'XOF',
        description: description,
      }),
    })
    
    const data = await response.json()
    
    if (data.success && (data.data.checkout_url || data.data.payment_url)) {
      window.location.href = data.data.checkout_url || data.data.payment_url
    } else {
      showToast(setToast, data.error?.message || 'Payment failed', 'error')
    }
  } catch (e) {
    console.error(e)
    showToast(setToast, 'Connection error. Try again.', 'error')
  } finally {
    setLoading(false)
  }
}

const translations = {
  en: {
    title: 'Simple, Transparent Pricing',
    subtitle: 'Start free, upgrade when you need',
    getStarted: 'Get Started',
    popular: 'Most Popular',
    events: 'One-time Events',
    faqTitle: 'Frequently Asked Questions',
    canChange: 'Can I change plans anytime?',
    canChangeAns: 'Yes! Upgrade or downgrade anytime. No charge for changes.',
    howPay: 'How can I pay?',
    howPayAns: 'Mobile money via Genius Pay: Moov, Wave, Orange Money.',
    freeForever: 'Is free really free forever?',
    freeForeverAns: 'Yes! The free plan stays free forever. No credit card required.',
    refund: 'Can I get a refund?',
    refundAns: 'Yes, within 7 days for monthly plans.',
    ctaTitle: 'Ready to get started?',
    ctaSubtitle: 'Start free now. Upgrade when ready.',
  },
  fr: {
    title: 'Tarifs Simples et Transparents',
    subtitle: 'Commencez gratuit, passez Pro quand vous voulez',
    getStarted: 'Commencer',
    popular: 'Plus Populaire',
    events: 'Événements Ponctuels',
    faqTitle: 'Questions Fréquentes',
    canChange: 'Puis-je changer de plan anytime?',
    canChangeAns: 'Oui! Passez à un plan supérieur ou inférieur anytime. Gratuit.',
    howPay: 'Comment payer?',
    howPayAns: 'Mobile money via Genius Pay: Moov, Wave, Orange Money.',
    freeForever: 'Le gratuit est-il vraiment gratuit toujours?',
    freeForeverAns: 'Oui! Le plan gratuit reste gratuit. Aucune carte requise.',
    refund: 'Puis-je être remboursé?',
    refundAns: 'Oui, dans les 7 jours pour les plans mensuels.',
    ctaTitle: 'Prêt à commencer?',
    ctaSubtitle: 'Commencez gratuit maintenant.',
  },
}

export default function Pricing() {
  const [lang, setLang] = useState<Language>('fr')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const t = translations[lang]
  
  const events = [
    { name: lang === 'fr' ? 'Hackathon' : 'Hackathon', price: 50000, desc: lang === 'fr' ? 'Team building tech' : 'Team building tech', features: lang === 'fr' ? ['Jusqu\'à 100 participants', 'Classement en direct', 'Rapport détaillé'] : ['Up to 100 participants', 'Live leaderboard', 'Detailed report'] },
    { name: lang === 'fr' ? 'Conférence' : 'Conference', price: 75000, desc: lang === 'fr' ? 'Session interactive' : 'Interactive session', features: lang === 'fr' ? ['Jusqu\'à 500 participants', 'Q&R en direct', 'Export résultats'] : ['Up to 500 participants', 'Live Q&A', 'Export results'] },
    { name: lang === 'fr' ? 'Certification' : 'Certification', price: 100000, desc: lang === 'fr' ? 'Évaluation finale' : 'Final evaluation', features: lang === 'fr' ? ['Jusqu\'à 1000 participants', 'Certificats auto', 'Rapport complet'] : ['Up to 1000 participants', 'Auto certificates', 'Complete report'] },
  ]

  const handleEventPay = (amount: number, name: string) => {
    initiatePayment(amount, `KifLearn Event: ${name}`, setLoading, setToast)
  }

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500' :
          toast.type === 'error' ? 'bg-red-500' : 'bg-gray-800'
        } text-white`}>
          {toast.message}
        </div>
      )}

      {/* Language Toggle */}
      <div className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-lg p-1">
        <button onClick={() => setLang('fr')} className={`px-3 py-1 rounded-md text-sm ${lang === 'fr' ? 'bg-kif-orange text-white' : 'text-gray-600'}`}>
          🇫🇷 FR
        </button>
        <button onClick={() => setLang('en')} className={`px-3 py-1 rounded-md text-sm ${lang === 'en' ? 'bg-kif-orange text-white' : 'text-gray-600'}`}>
          🇬🇧 EN
        </button>
      </div>

      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{t.title}</h1>
          <p className="text-xl text-gray-300 mb-8">{t.subtitle}</p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Gratuit</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">0</div>
              <p className="text-gray-500 text-sm mb-6">Pour enseignants & élèves</p>
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-gray-600">✓ Quiz illimités</li>
                <li className="text-sm text-gray-600">✓ Participants jusqu'à 50</li>
                <li className="text-sm text-gray-600">✓ Mode Live</li>
                <li className="text-sm text-gray-600">✓ Mode Async</li>
              </ul>
              <Link to="/register" className="block w-full py-3 bg-gray-200 text-gray-700 font-medium text-center rounded-xl hover:bg-gray-300">
                {t.getStarted}
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-white border-2 border-kif-orange rounded-2xl p-6 transform md:scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-kif-orange text-white text-sm font-medium rounded-full">
                {t.popular}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Pro</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">10 000</span>
                <span className="text-gray-500">/{lang === 'fr' ? 'mois' : 'month'}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-500">{lang === 'fr' ? 'À vie' : 'Lifetime'}: </span>
                <span className="text-xl font-bold text-kif-orange">100 000</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Pour professionnels</p>
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-gray-600">✓ Quiz illimités</li>
                <li className="text-sm text-gray-600">✓ Participants illimités</li>
                <li className="text-sm text-gray-600">✓ Mode Live + Async + Hackathon</li>
                <li className="text-sm text-gray-600">✓ Analytics avancés</li>
                <li className="text-sm text-gray-600">✓ Support prioritaire</li>
              </ul>
              <Link to="/register" className="block w-full py-3 bg-kif-orange text-white font-medium text-center rounded-xl hover:bg-orange-600">
                {t.getStarted}
              </Link>
            </div>

            {/* School */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">École</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">25 000</span>
                <span className="text-gray-500">/{lang === 'fr' ? 'mois' : 'month'}</span>
              </div>
              <div className="mb-2">
                <span className="text-sm text-gray-500">{lang === 'fr' ? 'À vie' : 'Lifetime'}: </span>
                <span className="text-xl font-bold text-kif-blue">250 000</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Pour établissements</p>
              <ul className="space-y-2 mb-6">
                <li className="text-sm text-gray-600">✓ Tout Pro</li>
                <li className="text-sm text-gray-600">✓ Gestion utilisateurs</li>
                <li className="text-sm text-gray-600">✓ Dashboard admin</li>
                <li className="text-sm text-gray-600">✓ Export CSV/Excel</li>
                <li className="text-sm text-gray-600">✓ Support dédié</li>
              </ul>
              <Link to="/register" className="block w-full py-3 bg-kif-blue text-white font-medium text-center rounded-xl hover:bg-blue-600">
                {t.getStarted}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events with GeniusPay */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.events}</h2>
            <p className="text-gray-600">
              {lang === 'fr' ? 'Paiement unique via Genius Pay' : 'One-time payment via Genius Pay'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <div key={i} className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{event.name}</h3>
                <div className="text-3xl font-bold text-kif-orange mb-2">{event.price.toLocaleString()} <span className="text-sm font-normal">FCFA</span></div>
                <p className="text-gray-500 text-sm mb-4">{event.desc}</p>
                <ul className="space-y-2 mb-6">
                  {event.features.map((f, j) => (
                    <li key={j} className="text-sm text-gray-600">✓ {f}</li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleEventPay(event.price, event.name)}
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? '...' : `✨ ${lang === 'fr' ? 'Payer avec Genius Pay' : 'Pay with Genius Pay'}`}
                </button>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  🔒 {lang === 'fr' ? 'Paiement sécurisé' : 'Secure payment'}
                </p>
              </div>
            ))}
          </div>

          {/* Genius Pay Info */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">🎯 {lang === 'fr' ? 'Intégrez Genius Pay' : 'Integrate Genius Pay'}</h3>
            <p className="max-w-2xl mx-auto mb-4">
              {lang === 'fr' 
                ? 'Acceptez les paiements mobiles (Moov, Wave, Orange Money). Commission: 2.5% seulement.'
                : 'Accept mobile payments (Moov, Wave, Orange Money). Commission: only 2.5%.'
              }
            </p>
            <a href="https://genius-pay.com" target="_blank" className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100">
              {lang === 'fr' ? 'Créer un compte' : 'Create account'}
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{t.faqTitle}</h2>
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{t.canChange}</h3>
              <p className="text-gray-600">{t.canChangeAns}</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{t.howPay}</h3>
              <p className="text-gray-600">{t.howPayAns}</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{t.freeForever}</h3>
              <p className="text-gray-600">{t.freeForeverAns}</p>
            </div>
            <div className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{t.refund}</h3>
              <p className="text-gray-600">{t.refundAns}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-kif-orange">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">{t.ctaTitle}</h2>
          <p className="text-lg mb-8 opacity-90">{t.ctaSubtitle}</p>
          <Link to="/register" className="inline-block bg-white text-kif-orange font-semibold px-8 py-4 rounded-xl hover:bg-gray-100">
            {t.getStarted}
          </Link>
        </div>
      </section>
    </div>
  )
}