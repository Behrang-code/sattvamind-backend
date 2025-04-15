import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message } = req.body
    const { data, error } = await supabase
      .from('messages')
      .insert([{ content: message }])

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true, data })
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ messages: data })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
