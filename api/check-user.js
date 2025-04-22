import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { matricula } = req.body;

  const { data, error } = await supabase
    .from("quiz_logs")
    .select("nome, matr, empresa, cargo, tel")
    .eq("matr", matricula)
    .order('data_acesso', { ascending: false })
    .limit(1);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (data && data.length > 0) {
    const user = {
      fullname: data[0].nome,
      employee_id: data[0].matr,
      company: data[0].empresa,
      job_title: data[0].cargo,
      phone: data[0].tel
    };

    return res.status(200).json({ exists: true, user });
  }

  return res.status(200).json({ exists: false });
}