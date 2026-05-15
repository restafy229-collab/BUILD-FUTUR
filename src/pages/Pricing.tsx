import { Link } from 'react-router-dom'

export default function Pricing() {
  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      period: '/pour toujours',
      description: 'Pour les enseignants et élèves',
      features: [
        '✓ Quiz illimités',
        '✓ Participants illimités',
        '✓ Mode Live',
        '✓ Mode Async',
        '✓ Hackathon',
        '✓ Support communauté',
      ],
      cta: 'Commencer',
      popular: false,
    },
    {
      name: 'Pro',
      price: '9.99€',
      period: '/mois',
      description: 'Pour les formateurs professionnels',
      features: [
        '✓ Tout gratuit',
        '✓ Quiz blancs',
        '✓ Analyses avancées',
        '✓ Badges personnalisées',
        '✓ Priority support',
        '✓ API access',
      ],
      cta: 'Passer Pro',
      popular: true,
    },
    {
      name: 'École',
      price: '49.99€',
      period: '/mois',
      description: 'Pour les établissements',
      features: [
        '✓ Tout Pro',
        '✓ Gestion utilisateurs',
        '✓ Admin dashboard',
        '✓ Export CSV/Excel',
        '✓ Formation équipe',
        '✓ Support dédié',
      ],
      cta: 'Nous contacter',
      popular: false,
    },
  ]

  const events = [
    {
      name: 'Hackathon Entreprise',
      price: '199€',
      description: 'Team building tech',
      features: [
        'Jusqu\'à 100 participants',
        'Questions personnalisées',
        'Classement en direct',
        'Rapport détaillé',
      ],
    },
    {
      name: 'Conférence',
      price: '299€',
      description: 'Interactive session',
      features: [
        'Jusqu\'à 500 participants',
        'Q&R en direct',
        'Sondages temps réel',
        'Export résultats',
      ],
    },
    {
      name: 'Formation Certification',
      price: '499€',
      description: 'Évaluation finale',
      features: [
        'Jusqu\'à 1000 participants',
        'Certificats auto',
        'Rapport detailed',
        'Support 24/7',
      ],
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tarifs simples et transparents
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Commencez gratuit, passez Pro quand vous voulez
          </p>
        </div>
      </section>

      {/* Monthly Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div 
                key={i} 
                className={`relative bg-white border-2 rounded-2xl p-6 ${
                  plan.popular 
                    ? 'border-kif-orange shadow-xl scale-105' 
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-kif-orange text-white text-sm font-medium rounded-full">
                    Plus populaire
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">{plan.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="text-sm text-gray-600">{f}</li>
                  ))}
                </ul>
                
                <Link 
                  to="/register"
                  className={`block w-full py-3 rounded-xl font-medium text-center transition-colors ${
                    plan.popular 
                      ? 'bg-kif-orange text-white hover:bg-orange-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events with Genius Pay */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Évenements payants
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Organisez vos propres événements avec paiement via Genius Pay. 
             idrecolte automatique et partage des revenus.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <div 
                key={i} 
                className="bg-white border-2 border-gray-200 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-1">{event.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-kif-orange">{event.price}</span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{event.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {event.features.map((f, j) => (
                    <li key={j} className="text-sm text-gray-600">{f}</li>
                  ))}
                </ul>
                
                <button className="w-full btn-primary">
                  ✨ Payer avec Genius Pay
                </button>

                <p className="text-xs text-gray-400 mt-3 text-center">
                  🔒 Paiement sécurisé par Genius Pay
                </p>
              </div>
            ))}
          </div>

          {/* Genius Pay Info */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">🎯 Intégrez Genius Pay</h3>
            <p className="max-w-2xl mx-auto mb-4">
              Acceptez les paiements mobiles (Moov AFRIQ, Wave, Orange Money) 
              pour vos événements. Commission: 2.5% seulement.
            </p>
            <a 
              href="https://genius-pay.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100"
            >
              Créer un compte Genius Pay
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions fréquentes
          </h2>
          
          <div className="space-y-6">
            {[
              {
                q: 'Puis-je changer de plan anytime?',
                a: 'Oui! Vous pouvez passer à un plan supérieur ou inférieur à tout moment.',
              },
              {
                q: 'Comment fonctionne le paiement?',
                a: 'Nous acceptons les paiements mobiles via Genius Pay (Moov, Wave, Orange Money).',
              },
              {
                q: 'Le gratuit est-il vraiment gratuit?',
                a: 'Oui! Le plan gratuit reste gratuit pour toujours. Aucune carte bancaire requise.',
              },
              {
                q: 'Puis-je être remboursé?',
                a: 'Oui, dans les 7 jours pour les plans mensuels. Les événements sont non remboursables.',
              },
            ].map((item, i) => (
              <div key={i} className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-kif-orange">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Commencez gratuit maintenant. Passez Pro quand vous voulez.
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-kif-orange font-semibold px-8 py-4 rounded-xl hover:bg-gray-100"
          >
            Créer un compte gratuit
          </Link>
        </div>
      </section>
    </div>
  )
}