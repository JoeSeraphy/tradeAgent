# TradeAgent v3

Painel de análise multi-mercado (Cripto · Forex · B3) com gráficos TradingView e análise via Claude (Anthropic).

## Estrutura

```
/
├── index.html       → Frontend completo
├── api/
│   └── chat.js      → Proxy seguro para a API Anthropic
├── vercel.json      → Configuração do Vercel
└── README.md
```

## Deploy no Vercel

### 1. Subir para o GitHub

```bash
git init
git add .
git commit -m "feat: TradeAgent v3 inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/trade-agent.git
git push -u origin main
```

### 2. Importar no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **Add New → Project**
3. Selecione o repositório `trade-agent`
4. Clique em **Deploy** (as configurações do `vercel.json` são detectadas automaticamente)

### 3. Configurar a chave da Anthropic

1. No painel do projeto no Vercel, vá em **Settings → Environment Variables**
2. Adicione:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** sua chave `sk-ant-api03-...`
   - **Environment:** Production, Preview, Development (marque todos)
3. Clique em **Save**
4. Vá em **Deployments** e clique em **Redeploy** para aplicar a variável

### 4. Pronto!

Seu TradeAgent estará disponível em `https://trade-agent-xxx.vercel.app`

---

## Dados utilizados

| Mercado | Dados automáticos | Gráfico |
|---------|-------------------|---------|
| Cripto  | Binance Futures API (pública) — RSI, MACD, OI, Funding | TradingView |
| Forex   | Sessões de mercado (horário) | TradingView |
| B3      | Horário do pregão (10h–17h30 BRT) | TradingView |

## Segurança

- A chave da Anthropic fica **apenas** na variável de ambiente do Vercel
- O frontend chama `/api/chat` (rota interna) — nunca expõe a chave
- A API da Binance usada é pública e não requer autenticação
