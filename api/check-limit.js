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

  if (!matr) {
    return res.status(400).json({ error: 'Matrícula não fornecida' });
  }

  try {
    // Consultar registros do quiz para o usuário na semana atual
    const hoje = new Date();
    const domingo = new Date(hoje);
    domingo.setDate(hoje.getDate() - hoje.getDay()); // início da semana
    domingo.setHours(0, 0, 0, 0); // início do dia

    const { data, error } = await supabase
      .from("quiz_logs")
      .select("*")
      .eq("matr", matr)
      .gte("data_acesso", domingo.toISOString());

    if (error) {
      console.error("Erro na consulta:", error);
      return res.status(500).json({ error: error.message });
    }

    // Verificar se o usuário já jogou 2 vezes nesta semana
    const permitido = data.length < 2;
    
    return res.status(200).json({ permitido,
      jogos: data.length,
     });
  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: error.message });
  }
}