export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo POST ammesso" });
  }

  const { message } = req.body;

  // ✅ Verifica se la variabile OPENAI_API_KEY è presente
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key non trovata nel server" });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.OPENAI_API_KEY
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Sei SattvaMind, una guida calma e riflessiva. Usa parole semplici, pacate, ispirate alla filosofia dello yoga e all’ascolto del corpo."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.6
    })
  });

  const data = await response.json();

  res.status(200).json({ reply: data.choices[0].message.content });
}
