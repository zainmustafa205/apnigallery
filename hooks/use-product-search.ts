"use client";

import { useEffect, useRef, useState } from "react";
import Fuse from "fuse.js";

export type SearchResult = {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  images?: { url: string }[];
};

/**
 * Fetches the active product catalog once (when `active` first becomes true)
 * and performs fast, typo-tolerant client-side search as the query changes.
 */
export function useProductSearch(active: boolean) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const fuseRef = useRef<Fuse<SearchResult> | null>(null);
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (!active || ready) return;

    setLoading(true);
    fetch("/api/products?limit=200")
      .then((res) => res.json())
      .then((json) => {
        const products: SearchResult[] = json?.data?.products ?? [];
        fuseRef.current = new Fuse(products, {
          keys: ["name"],
          threshold: 0.4,
          ignoreLocation: true,
        });
        setReady(true);
      })
      .finally(() => setLoading(false));
  }, [active, ready]);

  const results: SearchResult[] = query.trim()
    ? (fuseRef.current
        ?.search(query.trim())
        .slice(0, 6)
        .map((r) => r.item) ?? [])
    : [];

  return { query, setQuery, results, loading };
}
