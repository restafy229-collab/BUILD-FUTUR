# KifLearn - Quiz Interactif Éducatif

Le Kahoot de l'Afrique - Plateforme quiz éducatifs interactive 100% gratuite.

## 🚀 Démarrage Rapide

```bash
# Install dependencies
npm install

# Configure PocketBase
# 1. Go to https://pocketbase.cloud
# 2. Create free account → New project
# 3. Copy URL to .env

# Create .env file
echo "VITE_POCKETBASE_URL=https://your-app.pocketbase.cloud" > .env

# Start development
npm run dev
```

## 🗄️ Configuration PocketBase (Admin UI)

Create these collections in PocketBase admin panel:

### users
| Field | Type | Options |
|-------|------|---------|
| email | email | unique, required |
| username | text | required |
| role | select | host, participant |
| avatar | file | |
| created | datetime | auto |

### quizzes
| Field | Type | Options |
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
| Field | Type | Options |
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

### sessions
| Field | Type | Options |
|-------|------|---------|
| quiz | relation | quizzes, required |
| host | relation | users, required |
| code | text | unique, required |
| mode | select | live, async, hackathon |
| status | select | waiting, active, ended |
| current_question | number | |
| deadline | datetime | |

### participants
| Field | Type | Options |
|-------|------|---------|
| session | relation | sessions, required |
| user | relation | users, required |
| score | number | default: 0 |

### responses
| Field | Type | Options |
|-------|------|---------|
| session | relation | sessions, required |
| participant | relation | users, required |
| question | relation | questions, required |
| answer_index | number | |
| response_ms | number | |
| points | number | |
| is_correct | bool | |

## 📱 Modes

- **Live**: Real-time with timer + leaderboard
- **Async**: Flexible deadline, no live
- **Hackathon**: Multi-phase competitions by skill

## 🛠️ Stack

- React 18 + TypeScript + Vite
- TailwindCSS
- PocketBase (100% free)

## 📁 Structure

```
src/
├── components/    # Reusable components
├── pages/        # App pages
├── hooks/        # Custom hooks (realtime)
├── lib/          # PocketBase client
├── stores/       # Zustand stores
└── styles/       # Global CSS
```

## 🚀 Deploy

```bash
# Build
npm run build

# Deploy to Cloudflare Pages or Vercel (free)
```

## 📄 License

MIT © 2026 KifLearn