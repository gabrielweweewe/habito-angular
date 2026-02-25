# DevLevel

Aplicação web para tracking comportamental de desenvolvedores: journal diário, gamificação (XP, níveis, streaks), reflexão semanal e modo experimento.

## Stack

- **Frontend/Backend:** Next.js 14 (App Router), TypeScript
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT em cookie httpOnly
- **UI:** Tailwind CSS, Recharts

## Variáveis de ambiente

Crie `.env.local` na raiz do projeto (use `.env.local.example` como referência):

- `MONGODB_URI` – connection string do MongoDB (ex.: MongoDB Atlas)
- `JWT_SECRET` – segredo para assinatura do JWT (mín. 32 caracteres)

## Desenvolvimento

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Build e deploy (Vercel)

1. Conecte o repositório ao Vercel.
2. Configure as env vars no dashboard: `MONGODB_URI` e `JWT_SECRET`.
3. Deploy:

```bash
npm run build
```

O build gera a aplicação estática e as API routes como serverless functions.

## Estrutura principal

- `app/(auth)` – login e registro
- `app/(dashboard)` – dashboard, entradas, reflexão, experimentos
- `app/api` – API routes (auth, entries, reflections, experiments, dashboard, gamification)
- `lib/db` – conexão MongoDB e modelos Mongoose
- `lib/services` – lógica de negócio
- `lib/validators` – schemas Zod
- `lib/utils` – JWT, erros, gamification (pontos, level, streak)
