export default async function handler(req, res) {
  console.log("Env check:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  res.status(200).json({ status: "ok" });
}
