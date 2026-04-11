export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada.' });

  const { marketData, market, asset, tf } = req.body;

  const system = `Você é um gerador de sinais de trading profissional. Analisa dados de mercado e retorna APENAS um JSON válido, sem texto extra, sem markdown, sem explicações fora do JSON.

O JSON deve seguir exatamente este formato:
{
  "action": "BUY" | "SELL" | "NEUTRO",
  "confidence": número de 0 a 100,
  "entry": número (preço de entrada sugerido),
  "sl": número (preço de stop loss),
  "tp1": número (primeiro alvo),
  "tp2": número (segundo alvo),
  "rr": número (risk/reward ratio),
  "timeframe": string,
  "reasoning": "explicação curta em português, máximo 2 frases",
  "warnings": "riscos principais em português, máximo 1 frase"
}

Regras:
- Só gere BUY ou SELL se confiança >= 60
- Se confiança < 60 retorne NEUTRO
- SL deve ser colocado em nível técnico relevante (suporte/resistência)
- TP1 deve ter R:R mínimo de 1.5, TP2 mínimo de 2.5
- Seja conservador com alavancagem e tamanho de posição`;

  const userMsg = `Mercado: ${market} | Ativo: ${asset} | Timeframe: ${tf}

DADOS:
${marketData}

Gere o sinal agora.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system,
        messages: [{ role: 'user', content: userMsg }],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message });

    const text = data.content[0].text.replace(/```json|```/g, '').trim();
    const signal = JSON.parse(text);
    signal.asset = asset;
    signal.market = market;
    signal.tf = tf;
    signal.timestamp = new Date().toISOString();

    return res.status(200).json(signal);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao gerar sinal: ' + err.message });
  }
}
