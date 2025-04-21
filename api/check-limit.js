// api/check-limit.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { matr } = req.body;

  const { data, error } = await supabase
    .from("quiz_logs")
    .select("data_acesso")
    .eq("matr", matr);

  if (error) return res.status(500).json({ error: error.message });

  const hoje = new Date();
  const domingo = new Date(hoje);
  domingo.setDate(hoje.getDate() - hoje.getDay());

  const jogosDaSemana = data.filter((registro) => {
    const dataRegistro = new Date(registro.data_acesso);
    return dataRegistro >= domingo;
  });

  const permitido = jogosDaSemana.length < 2;

  return res.status(200).json({ permitido });
}
