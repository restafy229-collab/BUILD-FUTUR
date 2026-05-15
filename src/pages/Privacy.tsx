import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-900">
          ← Retour à l'accueil
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Politique de Confidentialité
        </h1>
        
        <p className="text-gray-600 mb-8">
          Dernière mise à jour: 15 Mai 2026
        </p>

        <section className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-600">
            La présente Politique de Confidentialité décrit comment KifLearn collecte, 
            utilise et protège vos données personnelles. Nous respectons votre vie privée 
            et nous engageons à protéger vos données.
          </p>
        </section>

        <section className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Données collectées</h2>
          <p className="text-gray-600">
            Nous collectons les données suivantes:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Email et nom d'utilisateur lors de l'inscription</li>
            <li>Données de jeu (scores, réponses, temps)</li>
            <li>Informations de navigation (anonymes)</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Utilisation</h2>
          <p className="text-gray-600">
            Vos données sont utilisées pour:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Fournir nos services de quiz</li>
            <li>Améliorer notre plateforme</li>
            <li>Vous envoyer des informations importantes</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Protection</h2>
          <p className="text-gray-600">
            Nous implementons des mesures de sécurité modernes pour protéger vos données: 
            chiffrement, accès restreint, surveillance. Cependant, aucune méthode 
            de transmission sur Internet n'est 100% sécurisée.
          </p>
        </section>

        <section className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Partage</h2>
          <p className="text-gray-600">
            Nous ne vendons pas vos données personnelles. Nous ne partageons 
            vos données qu'avec:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>PocketBase (notre hébergeur de base de données)</li>
            <li>Genius Pay (pour les paiements si vous souscrivez)</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Vos droits</h2>
          <p className="text-gray-600">
            Vous avez le droit de:
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
            <li>Accéder à vos données</li>
            <li>Les corriger</li>
            <li>Les supprimer</li>
            <li>Exporter vos données</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact</h2>
          <p className="text-gray-600">
            Pour exercer vos droits ou toute question, contactez-nous à: 
            <a href="mailto:privacy@kiflearn.com" className="text-kif-orange">
              privacy@kiflearn.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}