
import { supabase } from "./supabase";

export async function testSupabaseConnection() {
  const { error } = await supabase
    .from("learner_progress")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Supabase connection test failed:", error);
    throw error;
  }

  console.log("Supabase query succeeded.");
}
