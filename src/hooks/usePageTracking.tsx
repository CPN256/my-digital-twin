import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

function getVisitorId(): string {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('visitor_id', id);
  }
  return id;
}

export function usePageTracking(page: string = '/') {
  useEffect(() => {
    const track = async () => {
      await supabase.from('page_views').insert({
        page,
        visitor_id: getVisitorId(),
        user_agent: navigator.userAgent,
      });
    };
    track();
  }, [page]);
}
