import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const useStats = () => {
  const { user } = useAuth();

  const updateFocusStats = async (minutes) => {
    if (!user) return;

    try {
      const xpGain = minutes * 2; // 2 XP per minute
      const hoursGain = minutes / 60;
      const today = new Date().toISOString().split('T')[0];

      // 1. Fetch current profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('total_xp, focus_hours, streak, last_focus_date')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;

      let newStreak = profile.streak || 0;
      const lastDate = profile.last_focus_date;

      if (!lastDate) {
        newStreak = 1;
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastDate === yesterdayStr) {
          newStreak += 1;
        } else if (lastDate !== today) {
          // If they missed a day, reset to 1
          newStreak = 1;
        }
        // If they already focused today, streak stays the same
      }

      // 2. Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          total_xp: (profile.total_xp || 0) + xpGain,
          focus_hours: Number((profile.focus_hours || 0) + hoursGain).toFixed(2),
          streak: newStreak,
          last_focus_date: today,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return { xpGain, hoursGain, newStreak };
    } catch (err) {
      console.error('Error updating stats:', err.message);
      return null;
    }
  };

  return { updateFocusStats };
};
