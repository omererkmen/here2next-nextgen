import { createClient } from '@/lib/supabase/client';

type LogAction =
  | 'login_success'
  | 'login_failed'
  | 'signup'
  | 'logout'
  | 'page_view'
  | 'profile_update'
  | 'password_reset_request'
  | 'match_request'
  | 'wishlist_apply'
  | 'event_register'
  | 'error';

export async function logActivity(
  action: LogAction,
  details: Record<string, any> = {},
  email?: string
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from('activity_logs').insert({
      user_id: user?.id || null,
      email: email || user?.email || null,
      action,
      details,
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
    });
  } catch (err) {
    // Silently fail — logging should never break the app
    console.error('Activity log error:', err);
  }
}
