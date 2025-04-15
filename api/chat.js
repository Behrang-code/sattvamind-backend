export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo POST ammesso" });
  }

  const { message, user_id } = req.body;

  if (!process.env.OPENAI_API_KEY || !process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return res.status(500).json({ error: "Variabili ambientali mancanti" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "Sei SattvaMind, una guida calma e riflessiva. Usa parole semplici, pacate, ispirate alla filosofia dello yoga e all’ascolto del corpo." },
          { role: "user", content: message }
        ],
        temperature: 0.6
      })
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Salva nel database Supabase
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.SUPABASE_ANON_KEY,
        "Authorization": "Bearer " + process.env.SUPABASE_ANON_KEY,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify([
        { user_id, role: "user", content: message },
        { user_id, role: "assistant", content: reply }
      ])
    });

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Errore nella risposta del server" });
  }
}
