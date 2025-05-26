import { useState, useEffect } from "react";
import axios from "axios";
import type { PlayerData } from "../utils/types";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export function usePlayer(name: string) {
  const [data, setData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;

    setLoading(true);
    setError(null);

    axios
      .post(API_URL, { player_name: name })
      .then((response) => {
        setData(response.data.result);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch player data");
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [name]);

  return { data, loading, error };
}
