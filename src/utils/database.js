import { supabase } from '../supabase';

export async function saveTranscript({ text, language, timestamp }) {
  const { error } = await supabase.from('transcripts').insert({
    content: text,
    language,
    created_at: timestamp,
  });
  if (error) {
    console.error('Failed to save transcript', error);
  }
}

export async function fetchTranscripts(offset = 0, limit = 20) {
  const { data, error } = await supabase
    .from('transcripts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) {
    console.error('Failed to fetch transcripts', error);
    return [];
  }
  return data || [];
}
