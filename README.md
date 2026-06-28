# Morning Signal

**Morning Signal — The one thing your startup needs to know today.**

## Démarrage rapide (mode local)

```bash
cd ai-startup-pulse
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) — **aucune clé API nécessaire**.

Le mode local s'active quand Supabase n'est pas configuré :
- Auth via localStorage
- Rapports générés localement (FR)
- Données dans le navigateur
- Limite : **3 rapports / mois**

---

## Phase 1 — Passer en production (gratuit)

### Étape 1 : Supabase

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Dans **SQL Editor**, exécute dans l'ordre :
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_report_usage.sql`
3. **Authentication → URL Configuration** : ajoute `http://localhost:3000` et ton domaine Vercel
4. Copie les clés : **Project Settings → API**

### Étape 2 : Variables d'environnement

Crée `.env.local` (voir `.env.example`) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Dès que `NEXT_PUBLIC_SUPABASE_URL` est défini → **mode production** (auth + DB + OpenAI).

### Étape 3 : Tester en local

```bash
npm run dev
```

- Inscription avec un vrai email
- Génération d'un rapport → doit être en **français** (OpenAI)
- Vérifier le compteur **X/3 rapports ce mois-ci**
- Historique des rapports dans le dashboard

### Étape 4 : Déployer sur Vercel

1. Push le repo sur **GitHub**
2. [vercel.com](https://vercel.com) → Import project
3. Ajoute les mêmes variables d'environnement
4. `NEXT_PUBLIC_APP_URL` = ton URL Vercel (ex. `https://morning-signal.vercel.app`)
5. Dans Supabase Auth → ajoute l'URL Vercel aux redirect URLs

### Étape 5 : Validation

- [ ] Signup / login sur l'URL publique
- [ ] Rapport IA généré et sauvegardé
- [ ] Limite 3 rapports / mois appliquée
- [ ] Historique des rapports visible
- [ ] Données isolées entre utilisateurs (RLS)

---

## Plan gratuit (actuel)

| Feature | Statut |
|---------|--------|
| Saisie manuelle KPIs | ✅ |
| Rapports IA (OpenAI gpt-4o-mini) | ✅ en prod |
| 3 rapports / mois | ✅ |
| Historique rapports | ✅ |
| i18n landing EN/FR | ✅ |
| Intégrations API | 🔜 Pro |
| Stripe / abonnement | 🔜 Pro |
| Email quotidien auto | 🔜 Pro |

---

## Stack

- **Next.js 16** — frontend + API
- **Supabase** — auth + PostgreSQL
- **OpenAI** — rapports (gpt-4o-mini)
- **Vercel** — hosting

## Scripts

```bash
npm run dev    # développement
npm run build  # build production
npm run start  # serveur production
```
