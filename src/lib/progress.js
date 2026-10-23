
import { supabase } from "./supabase";

export async function loadProgress() {
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;

  const user = userData.user;
  if (!user) throw new Error("Please sign in first.");

  const { data, error } = await supabase
    .from("learner_progress")
    .select("id, course_id, progress, completed, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function saveProgress(courseId, percentage) {
  if (!courseId || typeof courseId !== "string") {
    throw new Error("A valid course ID is required.");
  }

  if (
    typeof percentage !== "number" ||
    !Number.isFinite(percentage) ||
    percentage < 0 ||
    percentage > 100
  ) {
    throw new Error("Progress must be between 0 and 100.");
  }

  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;

  const user = userData.user;
  if (!user) throw new Error("Please sign in first.");

  const progress = Math.round(percentage);

  const { data, error } = await supabase
    .from("learner_progress")
    .upsert(
      {
        user_id: user.id,
        course_id: courseId,
        progress,
        completed: progress === 100,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,course_id" }
    )
    .select()
    .single();

  if (error) throw error;

  return data;
}
