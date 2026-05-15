import { Link } from 'react-router-dom'

export default function Landing() {
  const features = [
    {
      icon: '⚡',
      title: 'Quiz Live',
      description: 'Répondez en temps réel avec buzzer et classements en direct. Idéal pour les classes.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: '⏰',
      title: 'Mode Async',
      description: 'Quiz à faire dans un délai flexible. Parfait pour les devoirs à la maison.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🏆',
      title: 'Hackathon',
      description: 'Compétitions par compétences. Python, SQL, UI/UX et plus encore.',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const stats = [
    { value: '10K+', label: 'Utilisateurs actifs' },
    { value: '50K+', label: 'Quiz créés' },
    { value: '100K+', label: 'Parties jouées' },
    { value: '$0', label: 'Prix toujours' },
  ]

  const steps = [
    { num: '1', title: 'Créez', desc: 'Créez votre quiz en quelques secondes', icon: '✏️' },
    { num: '2', title: 'Partagez', desc: 'Partagez le code avec vos élèves', icon: '📤' },
    { num: '3', title: 'Jouez', desc: 'Voyez les résultats en direct', icon: '🎮' },
  ]

  const testimonials = [
    {
      name: 'Marie K.',
      role: 'Professeure de Lycée',
      avatar: 'MK',
      text: 'KifLearn a transformé mes cours. Mes élèves sont plus motivés que jamais!',
      color: 'from-blue-400 to-blue-600',
    },
    {
      name: 'Jean P.',
      role: 'Formateur IT',
      avatar: 'JP',
      text: 'Parfait pour mes formations Python. Le mode hackathon est génial.',
      color: 'from-purple-400 to-purple-600',
    },
    {
      name: 'Sophie M.',
      role: 'Parent',
      avatar: 'SM',
      text: 'Mes enfants apprennent en s\'amusant. Et c\'est gratuit!',
      color: 'from-pink-400 to-pink-600',
    },
  ]

  const faqs = [
    {
      q: 'Est-ce vraiment gratuit?',
      a: 'Oui! KifLearn est 100% gratuit pour toujours. Aucune carte bancaria requise.',
    },
    {
      q: 'Comment créer un quiz?',
      a: 'Créez un compte, allez sur Dashboard et cliquez sur "Créer un quiz". C\'est simple!',
    },
    {
      q: 'Puis-je jouer sur mobile?',
      a: 'Oui! KifLearn fonctionne sur tous les écrans: 手机, tablette, ordinateur.',
    },
    {
      q: 'Mes données sont-elles sécurisées?',
      a: 'Oui! Nous utilisons des standards de sécurité modernes. Vos données sont protégées.',
    },
  ]

  const footerLinks = {
    product: [
      { label: 'Fonctionnalités', href: '#features' },
      { label: 'Tarifs', href: '#pricing' },
      { label: 'Créer un quiz', href: '/register' },
    ],
    company: [
      { label: 'À propos', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Carrières', href: '#' },
    ],
    support: [
      { label: 'Aide', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Status', href: '#' },
    ],
    legal: [
      { label: 'CGU', href: '#' },
      { label: 'Confidentialité', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="min-h-screen flex items-center pt-16 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-purple-50" />
        <div className="absolute top-40 left-0 w-[600px] h-[600px] bg-orange-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-700 font-medium text-sm mb-6">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              100% Gratuit - Pas de carte bancaire
            </div>
            
            {/* Logo */}
            <div className="w-20 h-20 bg-gradient-to-br from-kif-orange to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/30">
              <span className="text-white text-4xl">⚡</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Le quiz éducatif
              <span className="text-kif-orange block">qui engage vos apprenants</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              KifLearn transforme l'apprentissage en jeu. Quiz live, modes async et hackathon 
              pour tous vos besoins pédagogiques. Aucune carte bancaire requise.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 shadow-xl shadow-orange-500/25 inline-flex items-center justify-center gap-2">
                <span>Commencer gratuitement</span>
                <span>→</span>
              </Link>
              <Link to="/join" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
                <span>🎮</span>
                <span>Rejoindre une session</span>
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
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-gray-900">
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
                <h3 className="font-display text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
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
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-gray-900">
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
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Ce qu'ils en pensent
            </h2>
            <p className="text-gray-600">
              Ils font confiance à KifLearn
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-white font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Questions fréquentes
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            100% Gratuit
          </h2>
          <p className="text-gray-600 mb-12 max-w-xl mx-auto">
            KifLearn est et restera gratuit. Pas de carte bancaire, nombre illimité de quiz et de participants.
          </p>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 max-w-lg mx-auto">
            <div className="text-green-600 font-semibold mb-2">🎉 OFFRE PERMANENTE</div>
            <div className="text-5xl font-bold text-gray-900 mb-2">$0<span className="text-xl text-gray-500 font-normal">/mois</span></div>
            <ul className="text-left space-y-3 mt-6">
              {[
                '✓ Quiz illimités',
                '✓ Participants illimités',
                '✓ Tous les modes',
                '✓ Pas de publicité',
                '✓ Support gratuit',
                '✓ Mises à jour gratuites',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
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

      {/* Newsletter */}
      <section className="py-24 bg-gradient-to-br from-kif-orange to-orange-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Restez informé
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Inscrivez-vous pour recevoir nos actualités
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Votre email" 
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button type="submit" className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
              S'inscrire
            </button>
          </form>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à transformer vos cours ?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Rejoignez des milliers d'enseignants qui font confiance à KifLearn
          </p>
          <Link to="/register" className="inline-block bg-gradient-to-r from-kif-orange to-orange-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-xl">
            Créer un compte gratuit
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-kif-orange to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <span className="font-display font-bold text-xl">KifLearn</span>
              </Link>
              <p className="text-gray-400 text-sm mb-4">
                La plateforme quiz éducatifs 100% gratuite pour l'Afrique et le monde.
              </p>
              <div className="flex gap-4">
                {['🐦', '📘', '📸'].map((icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    {icon}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2">
                {footerLinks.product.map((link, i) => (
                  <li key={i}>
                    <Link to={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Bottom */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 KifLearn. Tous droits réservés.
            </p>
            <p className="text-gray-400 text-sm">
              Fait avec ❤️ pour l'éducation en Afrique
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}