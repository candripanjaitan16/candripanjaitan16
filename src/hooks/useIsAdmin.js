import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useIsAdmin(session) {
  const [isAdmin, setIsAdmin] = useState(undefined);
  const userId =
    session === undefined ? undefined : (session?.user?.id ?? null);

  useEffect(() => {
    if (userId === undefined) {
      setIsAdmin(undefined);
      return;
    }
    if (userId === null) {
      setIsAdmin(false);
      return;
    }
    let active = true;
    supabase.rpc("is_admin").then(({ data }) => {
      if (active) setIsAdmin(data === true);
    });
    return () => {
      active = false;
    };
  }, [userId]);

  return isAdmin;
}
