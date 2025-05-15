// db.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_KEY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

//intervalo manual da semana (AQUI vc define)
const SEMANA_INICIO = new Date("2025-05-15T00:00:00-03:00");
const SEMANA_FIM = new Date("2025-05-23T23:59:59-03:00");

async function getJogosDaSemana(matr) {
  const { data, error } = await supabase
    .from("quiz_logs")
    .select("*")
    .eq("matr", matr);

  if (error) {
    console.error("Erro ao consultar registros:", error);
    return [];
  }

  return data.filter(registro => {
    const dataRegistro = new Date(registro.data_acesso);
    return dataRegistro >= SEMANA_INICIO && dataRegistro <= SEMANA_FIM;
  });
}

async function registrarJogada(dados) {
  const { error } = await supabase
    .from("quiz_logs")
    .insert([dados]);

  if (error) {
    console.error("Erro ao salvar dados:", error);
    return false;
  }

  return true;
}

async function podeJogar(matr) {
  const registros = await getJogosDaSemana(matr);
  return registros.length < 2;
}

export async function processarResultado(dados) {
  const autorizado = await podeJogar(dados.matr);

  if (!autorizado) {
    alert("Você já jogou 2 vezes nesta semana. Volte na próxima semana.");
    return;
  }

  const sucesso = await registrarJogada(dados);

  if (sucesso) {
    console.log("Resultado salvo com sucesso!");
    // Executar animação, redirecionamento ou outros efeitos
  }
}
