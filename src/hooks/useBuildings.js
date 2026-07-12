import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useBuildings({ featuredOnly = false, typeSlug = null } = {}) {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBuildings() {
      setLoading(true);

      // First, get the type_id if typeSlug is provided
      let typeId = null;
      if (typeSlug) {
        const { data: typeData, error: typeError } = await supabase
          .from("building_types")
          .select("id")
          .eq("slug", typeSlug)
          .single();

        if (typeError) {
          if (!cancelled) {
            setError(typeError);
            setLoading(false);
          }
          return;
        }
        typeId = typeData?.id;
      }

      // Build the main query
      let query = supabase
        .from("buildings")
        .select("*, building_types(name, slug)")
        .order("sort_order", { ascending: true });

      if (featuredOnly) {
        query = query.eq("featured", true);
      }

      // Filter by type_id (foreign key column in your schema)
      if (typeId) {
        query = query.eq("type_id", typeId);
      }

      const { data, error } = await query;
      if (!cancelled) {
        if (error) setError(error);
        else setBuildings(data ?? []);
        setLoading(false);
      }
    }

    fetchBuildings();
    return () => {
      cancelled = true;
    };
  }, [featuredOnly, typeSlug]);

  return { buildings, loading, error };
}

export function useBuilding(slug) {
  const [building, setBuilding] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    async function fetchBuilding() {
      setLoading(true);
      const { data: buildingData, error: buildingError } = await supabase
        .from("buildings")
        .select("*, building_types(name, slug)")
        .eq("slug", slug)
        .single();

      if (cancelled) return;

      if (buildingError) {
        setError(buildingError);
        setLoading(false);
        return;
      }

      const { data: imageData } = await supabase
        .from("building_images")
        .select("*")
        .eq("building_id", buildingData.id)
        .order("sort_order", { ascending: true });

      if (!cancelled) {
        setBuilding(buildingData);
        setImages(imageData ?? []);
        setLoading(false);
      }
    }

    fetchBuilding();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { building, images, loading, error };
}
