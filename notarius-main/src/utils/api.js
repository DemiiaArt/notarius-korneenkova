import { API_BASE_URL } from "../config/api";

/**
 * Fetch page/service data by UA slug with language query.
 * - slug should be UA variant for server path.
 * - lang query can be 'ua' | 'ru' | 'en'; defaults to 'ua' if falsy.
 * - Maps backend field 'label' to frontend 'title', keeps other fields as is.
 */
export async function fetchPageDataBySlug({ slug, lang }) {
  const language = lang || "ua";
  const url = `${API_BASE_URL}/${slug}?lang=${encodeURIComponent(language)}`;

  console.log("[fetchPageDataBySlug] URL:", url);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const message = `HTTP ${response.status} while fetching ${url}`;
    console.error("[fetchPageDataBySlug] Error:", message);
    throw new Error(message);
  }

  const data = await response.json();

  // Transform: label -> title, keep everything else
  const { label, features, ...rest } = data || {};
  const transformed = {
    title: label,
    listItems: features,
    ...rest,
  };

  console.log("[fetchPageDataBySlug] Success:", {
    slug,
    lang: language,
    sample: transformed?.title,
  });

  return transformed;
}

/**
 * Helper to build UA slug for a known page id from nav-tree indices if needed.
 * Currently unused here; the caller should pass a concrete UA slug.
 */
export function buildUaSlug(slug) {
  return slug;
}
