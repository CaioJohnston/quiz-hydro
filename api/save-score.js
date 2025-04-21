// api/save-score.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // use a service key aqui, segura no backend
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { nome, matr, empresa, cargo, tel, acertos } = req.body;

  const { error } = await supabase.from("quiz_logs").insert([{
    data_acesso: new Date().toISOString(),
    nome,
    matr,
    empresa,
    cargo,
    tel,
    acertos
  }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
}
