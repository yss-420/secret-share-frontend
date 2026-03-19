import { useState, useEffect } from "react";

interface ChemistryScore {
  character_key: string;
  score: number;
  total_messages: number;
  perks_unlocked: boolean;
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://secret-share-backend-production.up.railway.app";

export function useChemistryScores(telegramId: number | undefined) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!telegramId) return;

    let cancelled = false;
    setLoading(true);

    fetch(`${BACKEND_URL}/api/chemistry?user_id=${telegramId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.scores) return;
        const map: Record<string, number> = {};
        (data.scores as ChemistryScore[]).forEach((s) => {
          map[s.character_key] = s.score;
        });
        setScores(map);
      })
      .catch(() => {
        // Silently fail — cards render without chemistry if API is down
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [telegramId]);

  return { scores, loading };
}
