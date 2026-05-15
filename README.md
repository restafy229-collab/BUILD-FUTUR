# KifLearn - Quiz Interactif Éducatif

Le Kahoot de l'Afrique - Plateforme quiz éducatifs interactive 100% gratuite.

## 🚀 Démarrage rapide

```bash
# Cloner le projet
cd kiflearn-app

# Installer les dépendances
npm install

# Configurer PocketBase
# 1. Créer un compte sur https://pocketbase.cloud
# 2. Créer les collections (voir ci-dessous)
# 3. Copier VITE_POCKETBASE_URL dans .env

# Créer .env
echo "VITE_POCKETBASE_URL=https://ton-app.pocketbase.cloud" > .env

# Lancer en mode développement
npm run dev
```

## 🗄️ Configuration PocketBase

Créer ces collections dans l'admin UI PocketBase:

### users
| Champ | Type | Options |
|-------|------|---------|
| email | email | unique, required |
| username | text | required |
| role | select | host, participant |
| avatar | file | |
| created | datetime | auto |
| updated | datetime | auto |

### quizzes
| Champ | Type | Options |
|-------|------|---------|
| title | text | required |
| description | text | |
| host | relation | users, required |
| visibility | select | public, private |
| language | select | fr, en, es |
| time_per_question | number | default: 20 |
| points_correct | number | default: 100 |
| points_incorrect | number | default: -10 |
| is_published | bool | default: false |
| created | datetime | auto |

**API Rules:**
```json
{
  "listRule": "visibility = 'public' || host.id = @request.auth.id",
  "viewRule": "visibility = 'public' || host.id = @request.auth.id",
  "updateRule": "host.id = @request.auth.id",
  "deleteRule": "host.id = @request.auth.id",
  "createRule": "@request.auth.id != null"
}
```

### questions
| Champ | Type | Options |
|-------|------|---------|
| quiz | relation | quizzes, required |
| type | select | mcq, true_false |
| text | text | required |
| choices | json | ["A","B","C","D"] |
| correct_index | number | |
| explanation | editor | |
| time_limit | number | default: 20 |
| points | number | default: 100 |
| order | number | |
| created | datetime | auto |

**API Rules:**
```json
{
  "listRule": "quiz.host = @request.auth.id",
  "viewRule": "quiz.host = @request.auth.id",
  "updateRule": "quiz.host = @request.auth.id",
  "deleteRule": "quiz.host = @request.auth.id",
  "createRule": "@request.auth.id != null"
}
```

### sessions
| Champ | Type | Options |
|-------|------|---------|
| quiz | relation | quizzes, required |
| host | relation | users, required |
| code | text | unique, required |
| mode | select | live, async, hackathon |
| status | select | waiting, active, ended |
| current_question | number | |
| deadline | datetime | |
| started | datetime | |
| created | datetime | auto |

### participants
| Champ | Type | Options |
|-------|------|---------|
| session | relation | sessions, required |
| user | relation | users, required |
| score | number | default: 0 |
| joined | datetime | auto |

### responses
| Champ | Type | Options |
|-------|------|---------|
| session | relation | sessions, required |
| participant | relation | users, required |
| question | relation | questions, required |
| answer_index | number | |
| response_ms | number | |
| points | number | |
| is_correct | bool | |
| created | datetime | auto |

## 📱 Modes de Quiz

### Quiz Live
- Réponses en temps réel
- Timer par question
- Classement en direct
- Bonus vitesse

### Mode Async
- Deadline flexible
- Navigation libre entre questions
- Pas de live

### Hackathon
- Phases multiples
- Skill tracking
- Classement par compétence

## 🛠️ Stack Technique

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: PocketBase (100% gratuit)
- **PWA**: Service Worker + Workbox
- **Auth**: PocketBase Auth

## 📦 Structure du Projet

```
src/
├── components/     # Composants réutilisables
├── pages/        # Pages de l'application
├── hooks/        # Hooks personnalisés
├── lib/          # PocketBase client
├── stores/       # Zustand stores
├── styles/       # CSS global
└── assets/      # Images, icônes
```

## 🚀 Déploiement

### Frontend (Gratuit)
```bash
# Cloudflare Pages
npm run build
#zip dist et uploader sur cloudflare pages

# Ou Vercel
npx vercel --prod
```

### Backend
- PocketBase.cloud (gratuit)
- Ou auto-hébergement

## 📄 Licence

MIT © 2026 KifLearn