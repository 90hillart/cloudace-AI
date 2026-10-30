
import { useEffect, useState } from "react";
import type {
  User,
  AuthChangeEvent,
  Session,
} from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";

export function useLearner() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkUser() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (active) {
          setUser(error ? null : data.user);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (active) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
