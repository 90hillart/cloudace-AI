
import { supabase } from "./supabase";

export type LearnerProfile = {
  user_id: string;
  learning_interests: string[];
  experience_level: "beginner" | "intermediate" | "advanced";
  daily_study_minutes: number;
  study_days: string[];
  learning_goal: string;
  onboarding_completed: boolean;
};

export async function getLearnerProfile() {
  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("Please sign in first.");

  const { data, error } = await supabase
    .from("learner_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function saveLearnerProfile(
  profile: Omit<LearnerProfile, "user_id">,
) {
  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("Please sign in first.");

  const { data, error } = await supabase
    .from("learner_profiles")
    .upsert(
      {
        ...profile,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select()
    .single();

  if (error) throw error;

  return data;
}
