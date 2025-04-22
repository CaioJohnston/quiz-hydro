import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { matr, empresa } = req.body;

  if (!matr || !empresa) {
    return res.status(400).json({ error: 'Matrícula e empresa são obrigatórias' });
  }

  try {
    const hoje = new Date();
    const domingo = new Date(hoje);
    domingo.setDate(hoje.getDate() - hoje.getDay());
    domingo.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("quiz_logs")
      .select("data_acesso")
      .eq("matr", matr)
      .eq("empresa", empresa)
      .gte("data_acesso", domingo.toISOString());

    if (error) {
      console.error("Erro na consulta:", error);
      return res.status(500).json({ error: error.message });
    }

    const tentativas = data.length;
    const permitido = tentativas < 2;

    return res.status(200).json({
      permitido,
      tentativas
    });

  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: error.message });
  }
}
