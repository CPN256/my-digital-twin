import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSiteContent<T = any>(sectionKey: string, fallback: T): { data: T; loading: boolean; refetch: () => void } {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    const { data: row } = await supabase
      .from('site_content')
      .select('content')
      .eq('section_key', sectionKey)
      .single();
    if (row?.content) {
      setData(row.content as T);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, [sectionKey]);

  return { data, loading, refetch: fetchContent };
}
