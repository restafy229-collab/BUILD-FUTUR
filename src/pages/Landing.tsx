import { Link } from 'react-router-dom'

export default function Landing() {
  const features = [
    {
      icon: '⚡',
      title: 'Quiz Live',
      description: 'Répondez en temps réel avec buzzer et classements en direct. Idéal pour les classes.',
      color: 'from-orange-500 to-red-500',
      bg: 'bg-orange-50',
    },
    {
      icon: '⏰',
      title: 'Mode Async',
      description: 'Quiz à faire dans un délai flexible. Parfait pour les devoirs à la maison.',
      color: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50',
    },
    {
      icon: '🏆',
      title: 'Hackathon',
      description: 'Compétitions par compétences. Python, SQL, UI/UX et plus encore.',
      color: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50',
    },
  ]

  const stats = [
    { value: '10K+', label: 'Utilisateurs' },
    { value: '50K+', label: 'Quiz créés' },
    { value: '100K+', label: 'Parties jouées' },
    { value: '$0', label: 'Prix' },
  ]

  const steps = [
    { num: '1', title: 'Créez', desc: 'Créez votre quiz en quelques secondes', icon: '✏️' },
    { num: '2', title: 'Partagez', desc: 'Partagez le code avec vos élèves', icon: '📤' },
    { num: '3', title: 'Jouez', desc: 'Voyez les résultats en direct', icon: '🎮' },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-kif-orange to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white text-xl">⚡</span>
            </div>
            <span className="font-display font-bold text-xl">KifLearn</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Fonctionnalités</a>
            <a href="#how" className="text-sm font-medium text-gray-600 hover:text-gray-900">Comment ça marche</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Prix</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">
              Se connecter
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2 shadow-lg shadow-orange-500/25">
              Commencer gratuit
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-purple-50" />
        <div className="absolute top-40 left-0 w-[600px] h-[600px] bg-orange-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 font-medium text-sm mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              100% Gratuit pour toujours
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Créez des quiz interactifs qui
              <span className="text-kif-orange"> engagent vos apprenants</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              KifLearn transforme l'apprentissage en jeu. Quiz live, modes async et hackathon 
              pour tous vos besoins pédagogiques. Aucune carte bancaire requise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 shadow-xl shadow-orange-500/25">
                Créer un quiz gratuitement
              </Link>
              <Link to="/join" className="btn-secondary text-lg px-8 py-4">
                Rejoindre une session
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto pt-8 border-t border-gray-200">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl md:text-3xl font-bold text-kif-orange">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Tout ce qu'il vous faut
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Trois modes de quiz pour s'adapter à tous vos besoins pédagogiques
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="group p-8 bg-white border border-gray-100 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-5 text-white text-3xl shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-gray-600">
              Trois étapes simples pour commencer
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-kif-orange to-transparent opacity-30" />
                )}
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-gray-100">
                  <span className="text-4xl">{step.icon}</span>
                </div>
                <div className="text-5xl font-bold text-gray-200 mb-2">{step.num}</div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
           100% Gratuit
          </h2>
          <p className="text-gray-600 mb-12 max-w-xl mx-auto">
            KifLearn est et restera gratuit.Pas de carte bancaire,nombre illimité de quiz et de participants.
          </p>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 max-w-lg mx-auto">
            <div className="text-green-600 font-semibold mb-2">🎉 OFFRE PERMANENTE</div>
            <div className="text-5xl font-bold text-gray-900 mb-2">$0<span className="text-xl text-gray-500 font-normal">/mois</span></div>
            <ul className="text-left space-y-3 mt-6">
              {[
                'Quiz illimités',
                ' participants illimités',
                'Tous les modes',
                'Pas de publicité',
                'Support gratuit',
                'Mise à jour gratuite',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="block w-full bg-gradient-to-r from-kif-green to-green-600 text-white font-semibold py-4 rounded-xl mt-8 hover:from-green-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/25">
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-kif-orange to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à transformer vos cours ?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Rejoignez des milliers d'enseignants qui font confiance à KifLearn
          </p>
          <Link to="/register" className="inline-block bg-white text-kif-orange font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-xl">
            Créer un compte gratuit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-kif-orange rounded-lg flex items-center justify-center text-white">
                ⚡
              </div>
              <span className="font-display font-bold">KifLearn</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white">À propos</a>
              <a href="#" className="hover:text-white">Contact</a>
              <a href="#" className="hover:text-white">CGU</a>
            </div>
            <div className="text-gray-400 text-sm">
              © 2026 KifLearn. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}