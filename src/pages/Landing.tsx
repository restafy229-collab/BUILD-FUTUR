import { Link } from 'react-router-dom'

export default function Landing() {
  const features = [
    {
      icon: '⚡',
      title: 'Quiz Live',
      description: 'Répondez en temps réel avec buzzer et classements en direct.',
      color: 'from-kif-orange to-orange-600',
    },
    {
      icon: '⏰',
      title: 'Mode Async',
      description: 'Quiz à faire dans un délai flexible. Parfait pour les devoirs.',
      color: 'from-kif-blue to-blue-600',
    },
    {
      icon: '🏆',
      title: 'Hackathon',
      description: 'Compétitions par compétences. Python, SQL, UI/UX...',
      color: 'from-kif-purple to-purple-600',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex items-center bg-pattern relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-kif-orange/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-kif-purple/20 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-kif-orange/10 rounded-full text-kif-orange font-medium text-sm mb-6">
              <span className="w-2 h-2 bg-kif-orange rounded-full animate-pulse" />
              Quiz temps réel
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Créez des quiz interactifs qui
              <span className="text-kif-orange"> engagent vos apprenants</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              KifLearn transforme l'apprentissage en jeu. Quiz live, modes async et hackathon 
              pour tous vos besoins pédagogiques.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Créer un quiz gratuitement
              </Link>
              <Link to="/join" className="btn-secondary text-lg px-8 py-4">
                Rejoindre une session
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Tout ce qu'il vous faut
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="card p-8 hover:-translate-y-1 transition-transform cursor-pointer">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 text-white text-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Créez', desc: 'Créez votre quiz en quelques secondes' },
              { step: '2', title: 'Lancez', desc: 'Partagez le code avec vos participants' },
              { step: '3', title: ' Jouez', desc: 'Voyez les résultats en direct' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-kif-orange rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-kif-orange to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à transformer vos cours ?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Rejoignez des milliers d'enseignants qui font confiance à KifLearn
          </p>
          <Link to="/register" className="inline-block bg-white text-kif-orange font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors">
            Créer un compte gratuit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-kif-orange rounded-lg flex items-center justify-center text-white">
                ⚡
              </div>
              <span className="font-display font-bold">KifLearn</span>
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