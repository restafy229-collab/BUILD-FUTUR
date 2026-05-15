import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 text-gray-600 hover:text-gray-900">
          ← Retour à l'accueil
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Conditions Générales d'Utilisation
        </h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-8">
            Dernière mise à jour: 15 Mai 2026
          </p>

          <section className="bg-white rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600">
              Les présentes Conditions Générales d'Utilisation (CGU) définissent 
              les modalités d'accès et d'utilisation de KifLearn, la plateforme 
              quiz éducatifs gratuite.
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Acceptation</h2>
            <p className="text-gray-600">
              En créant un compte ou en utilisant KifLearn, vous acceptez 
              d'être lié par ces CGU. Si vous n'acceptez pas ces conditions, 
              veuillez ne pas utiliser notre service.
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Modifications</h2>
            <p className="text-gray-600">
              KifLearn se réserve le droit de modifier ces CGU à tout moment. 
              Les modifications entrent en vigueur dès leur publication. 
              Votre utilisation continue du service signifie acceptation des nouvelles conditions.
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
            <p className="text-gray-600">
              KifLearn et tous ses contenus (design, code, logo, textes) sont 
              propriété exclusive de KifLearn. Vous ne pouvez pas copier, 
              modifier ou distribuição notre contenu sans autorisation préalable.
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Responsabilités</h2>
            <p className="text-gray-600">
              KifLearn est fourni "en l'état". Nous ne garantissons pas que le service 
              sera toujours disponible ou sans erreur. Vous êtes responsable de 
              l'utilisation que vous faite du service.
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Résiliation</h2>
            <p className="text-gray-600">
              Vous pouvez supprimer votre compte à tout moment. KifLearn peut 
              suspendre ou supprimer votre accès en cas de violation de ces CGU.
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact</h2>
            <p className="text-gray-600">
              Pour toute question concernant ces CGU, contactez-nous à: 
              <a href="mailto:support@kiflearn.com" className="text-kif-orange">
                support@kiflearn.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}