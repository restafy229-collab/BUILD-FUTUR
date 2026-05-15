import { useState } from 'react'
import { Link } from 'react-router-dom'

type Language = 'en' | 'fr'

const translations = {
  en: {
    title: 'Simple, Transparent Pricing',
    subtitle: 'Start free, upgrade when you need',
    plans: 'Plans',
    monthly: 'Monthly',
    lifetime: 'Lifetime',
    features: 'Features',
    getStarted: 'Get Started',
    popular: 'Most Popular',
    free: {
      name: 'Free',
      price: '0',
      description: 'For teachers & students',
    },
    pro: {
      name: 'Pro',
      monthlyPrice: '10,000',
      lifetimePrice: '100,000',
      description: 'For professionals',
      features: [
        '✓ Unlimited quizzes',
        '✓ Unlimited participants',
        '✓ Live mode',
        '✓ Async mode',
        '✓ Hackathon mode',
        '✓ Advanced analytics',
        '✓ Custom branding',
        '✓ Priority support',
      ],
    },
    school: {
      name: 'School',
      monthlyPrice: '25,000',
      lifetimePrice: '250,000',
      description: 'For institutions',
      features: [
        '✓ Everything in Pro',
        '✓ User management',
        '✓ Admin dashboard',
        '✓ CSV/Excel export',
        '✓ Team training',
        '✓ Dedicated support',
        '✓ Custom domain',
        '✓ API access',
      ],
    },
    events: 'One-time Events',
    eventHackathon: 'Hackathon Event',
    eventConference: 'Conference',
    eventCert: 'Certification',
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
    plans: 'Plans',
    monthly: 'Mensuel',
    lifetime: 'À vie',
    features: 'Fonctionnalités',
    getStarted: 'Commencer',
    popular: 'Plus Populaire',
    free: {
      name: 'Gratuit',
      price: '0',
      description: 'Pour enseignants & élèves',
    },
    pro: {
      name: 'Pro',
      monthlyPrice: '10 000',
      lifetimePrice: '100 000',
      description: 'Pour professionnels',
      features: [
        '✓ Quiz illimités',
        '✓ Participants illimités',
        '✓ Mode Live',
        '✓ Mode Async',
        '✓ Mode Hackathon',
        '✓ Analyses avancées',
        '✓ Branding personnalisé',
        '✓ Support prioritaire',
      ],
    },
    school: {
      name: 'École',
      monthlyPrice: '25 000',
      lifetimePrice: '250 000',
      description: 'Pour établissements',
      features: [
        '✓ Tout Pro',
        '✓ Gestion utilisateurs',
        '✓ Dashboard admin',
        '✓ Export CSV/Excel',
        '✓ Formation équipe',
        '✓ Support dédié',
        '✓ Domaine personnalisé',
        '✓ Accès API',
      ],
    },
    events: 'Événements Ponctuels',
    eventHackathon: 'Hackathon',
    eventConference: 'Conférence',
    eventCert: 'Certification',
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
  const t = translations[lang]
  
  const events = [
    { name: lang === 'fr' ? 'Hackathon' : 'Hackathon', price: '50,000', desc: lang === 'fr' ? 'Team building tech' : 'Team building tech', features: lang === 'fr' ? ['Jusqu\'à 100 participants', 'Classement en direct', 'Rapport détaillé'] : ['Up to 100 participants', 'Live leaderboard', 'Detailed report'] },
    { name: lang === 'fr' ? 'Conférence' : 'Conference', price: '75,000', desc: lang === 'fr' ? 'Session interactive' : 'Interactive session', features: lang === 'fr' ? ['Jusqu\'à 500 participants', 'Q&R en direct', 'Export résultats'] : ['Up to 500 participants', 'Live Q&A', 'Export results'] },
    { name: lang === 'fr' ? 'Certification' : 'Certification', price: '100,000', desc: lang === 'fr' ? 'Évaluation finale' : 'Final evaluation', features: lang === 'fr' ? ['Jusqu\'à 1000 participants', 'Certificats auto', 'Rapport complet'] : ['Up to 1000 participants', 'Auto certificates', 'Complete report'] },
  ]

  return (
    <div className="min-h-screen">
      {/* Language Toggle */}
      <div className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-lg p-1">
        <button 
          onClick={() => setLang('fr')} 
          className={`px-3 py-1 rounded-md text-sm ${lang === 'fr' ? 'bg-kif-orange text-white' : 'text-gray-600'}`}
        >
          🇫🇷 FR
        </button>
        <button 
          onClick={() => setLang('en')} 
          className={`px-3 py-1 rounded-md text-sm ${lang === 'en' ? 'bg-kif-orange text-white' : 'text-gray-600'}`}
        >
          🇬🇧 EN
        </button>
      </div>

      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Monthly & Lifetime */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t.free.name}</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">{t.free.price}</div>
              <p className="text-gray-500 text-sm mb-6">{t.free.description}</p>
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
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t.pro.name}</h3>
              
              {/* Monthly */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">{t.pro.monthlyPrice}</span>
                <span className="text-gray-500">/{lang === 'fr' ? 'mois' : 'month'}</span>
              </div>
              
              {/* Lifetime */}
              <div className="mb-2">
                <span className="text-sm text-gray-500">{t.lifetime}: </span>
                <span className="text-xl font-bold text-kif-orange">{t.pro.lifetimePrice}</span>
              </div>
              
              <p className="text-gray-500 text-sm mb-4">{t.pro.description}</p>
              <ul className="space-y-2 mb-6">
                {t.pro.features.map((f, i) => (
                  <li key={i} className="text-sm text-gray-600">{f}</li>
                ))}
              </ul>
              <Link to="/register" className="block w-full py-3 bg-kif-orange text-white font-medium text-center rounded-xl hover:bg-orange-600">
                {t.getStarted}
              </Link>
            </div>

            {/* School */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t.school.name}</h3>
              
              {/* Monthly */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">{t.school.monthlyPrice}</span>
                <span className="text-gray-500">/{lang === 'fr' ? 'mois' : 'month'}</span>
              </div>
              
              {/* Lifetime */}
              <div className="mb-2">
                <span className="text-sm text-gray-500">{t.lifetime}: </span>
                <span className="text-xl font-bold text-kif-blue">{t.school.lifetimePrice}</span>
              </div>
              
              <p className="text-gray-500 text-sm mb-4">{t.school.description}</p>
              <ul className="space-y-2 mb-6">
                {t.school.features.map((f, i) => (
                  <li key={i} className="text-sm text-gray-600">{f}</li>
                ))}
              </ul>
              <Link to="/register" className="block w-full py-3 bg-kif-blue text-white font-medium text-center rounded-xl hover:bg-blue-600">
                {t.getStarted}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.events}</h2>
            <p className="text-gray-600">
              {lang === 'fr' ? ' Paiement unique via Genius Pay' : 'One-time payment via Genius Pay'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <div key={i} className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{event.name}</h3>
                <div className="text-3xl font-bold text-kif-orange mb-2">{event.price} <span className="text-sm font-normal">FCFA</span></div>
                <p className="text-gray-500 text-sm mb-4">{event.desc}</p>
                <ul className="space-y-2 mb-6">
                  {event.features.map((f, j) => (
                    <li key={j} className="text-sm text-gray-600">✓ {f}</li>
                  ))}
                </ul>
                <button className="w-full btn-primary">
                  ✨ {lang === 'fr' ? 'Payer avec Genius Pay' : 'Pay with Genius Pay'}
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
            <a 
              href="https://genius-pay.com" 
              target="_blank"
              className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100"
            >
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
          <Link 
            to="/register" 
            className="inline-block bg-white text-kif-orange font-semibold px-8 py-4 rounded-xl hover:bg-gray-100"
          >
            {t.getStarted}
          </Link>
        </div>
      </section>
    </div>
  )
}