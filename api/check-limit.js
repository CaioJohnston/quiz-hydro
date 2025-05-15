import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Defina o mesmo intervalo manual usado no db.js
const SEMANA_INICIO = new Date("2025-05-15T00:00:00-03:00");
const SEMANA_FIM = new Date("2025-05-23T23:59:59-03:00");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { matr, empresa } = req.body;

  if (!matr || !empresa) {
    return res.status(400).json({ error: 'Matrícula e empresa são obrigatórias' });
  }

  try {
    const { data, error } = await supabase
      .from("quiz_logs")
      .select("*")
      .eq("matr", matr)
      .eq("empresa", empresa);

    if (error) {
      console.error("Erro na consulta:", error);
      return res.status(500).json({ error: error.message });
    }

    // Filtra manualmente pelo intervalo definido
    const tentativas = data.filter((registro) => {
      const dataRegistro = new Date(registro.data_acesso);
      return dataRegistro >= SEMANA_INICIO && dataRegistro <= SEMANA_FIM;
    });

    const permitido = tentativas.length < 2;

    return res.status(200).json({
      permitido,
      jogos: tentativas.length
    });

  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: error.message });
  }
}
