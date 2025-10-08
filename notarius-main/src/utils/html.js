// Utility to normalize HTML coming from the backend editor
// - Prefix relative media URLs with MEDIA_BASE_URL
// - Leaves absolute URLs intact

import { MEDIA_BASE_URL } from "@/config/api";

const ABSOLUTE_URL_REGEX = /^(https?:)?\/\//i;

function isAbsoluteUrl(url) {
  return ABSOLUTE_URL_REGEX.test(url || "");
}

// If URL (absolute or relative) contains a /media/ segment, return path after it
function getPathAfterMedia(originalUrl) {
  if (!originalUrl) return null;
  try {
    const urlObj = new URL(originalUrl, window.location.origin);
    const idx = urlObj.pathname.indexOf("/media/");
    if (idx === -1) return null;
    return urlObj.pathname.substring(idx + 7); // skip '/media/'
  } catch {
    // Fallback for malformed URLs
    const idx = originalUrl.indexOf("/media/");
    if (idx === -1) return null;
    return originalUrl.substring(idx + 7);
  }
}

// If URL is absolute and points to our host (current) or known old host,
// and path DOES NOT start with /media/, return the path (without leading slash)
function getPathIfSameHostNoMedia(originalUrl) {
  if (!originalUrl) return null;
  const OLD_HOSTS = [
    "notarius-korneenkova-production.up.railway.app",
  ];
  try {
    const urlObj = new URL(originalUrl, window.location.origin);
    const hostMatches =
      urlObj.host === window.location.host || OLD_HOSTS.includes(urlObj.host);
    if (!hostMatches) return null;
    if (urlObj.pathname.startsWith("/media/")) return null;
    const path = urlObj.pathname.startsWith("/")
      ? urlObj.pathname.substring(1)
      : urlObj.pathname;
    return path || null;
  } catch {
    return null;
  }
}

export function normalizeEditorHtml(htmlString) {
  if (!htmlString || typeof htmlString !== "string") return htmlString;

  // Create a detached DOM to manipulate safely
  const container = document.createElement("div");
  container.innerHTML = htmlString;

  // Fix <img src>
  container.querySelectorAll("img[src]").forEach((img) => {
    const src = img.getAttribute("src");
    if (!src) return;
    // Skip data URLs
    if (src.startsWith("data:")) return;

    // Case 1: absolute URL that still points to some /media/ path -> rewrite base
    const mediaPathFromAbsolute = isAbsoluteUrl(src) ? getPathAfterMedia(src) : null;
    if (mediaPathFromAbsolute) {
      const needsSlashAbs = !MEDIA_BASE_URL.endsWith("/") && !mediaPathFromAbsolute.startsWith("/");
      img.setAttribute("src", `${MEDIA_BASE_URL}${needsSlashAbs ? "/" : ""}${mediaPathFromAbsolute}`);
      return;
    }

    // Case 1b: absolute URL to same/old host but without /media/ -> prefix MEDIA_BASE_URL
    const sameHostPath = isAbsoluteUrl(src) ? getPathIfSameHostNoMedia(src) : null;
    if (sameHostPath) {
      const needsSlashSame = !MEDIA_BASE_URL.endsWith("/") && !sameHostPath.startsWith("/");
      img.setAttribute("src", `${MEDIA_BASE_URL}${needsSlashSame ? "/" : ""}${sameHostPath}`);
      return;
    }

    // Case 2: relative URL -> normalize to MEDIA_BASE_URL
    if (!isAbsoluteUrl(src)) {
      // Remove leading /media/ if present to avoid double /media/media/
      let cleanSrc = src;
      if (src.startsWith("/media/")) {
        cleanSrc = src.substring(7);
      } else if (src.startsWith("media/")) {
        cleanSrc = src.substring(6);
      } else if (src.startsWith("/media/uploads/")) {
        // Перепробуем без 'uploads/' если файл реально лежит в корне media
        cleanSrc = src.substring("/media/".length);
      } else if (src.startsWith("media/uploads/")) {
        cleanSrc = src.substring("media/".length);
      }

      const needsSlash = !MEDIA_BASE_URL.endsWith("/") && !cleanSrc.startsWith("/");
      img.setAttribute("src", `${MEDIA_BASE_URL}${needsSlash ? "/" : ""}${cleanSrc}`);
    }
  });

  // Fix <source src> and <video poster>
  container.querySelectorAll("source[src]").forEach((source) => {
    const src = source.getAttribute("src");
    if (!src || src.startsWith("data:")) return;

    const mediaPathFromAbsolute = isAbsoluteUrl(src) ? getPathAfterMedia(src) : null;
    if (mediaPathFromAbsolute) {
      const needsSlashAbs = !MEDIA_BASE_URL.endsWith("/") && !mediaPathFromAbsolute.startsWith("/");
      source.setAttribute("src", `${MEDIA_BASE_URL}${needsSlashAbs ? "/" : ""}${mediaPathFromAbsolute}`);
      return;
    }

    const sameHostPath = isAbsoluteUrl(src) ? getPathIfSameHostNoMedia(src) : null;
    if (sameHostPath) {
      const needsSlashSame = !MEDIA_BASE_URL.endsWith("/") && !sameHostPath.startsWith("/");
      source.setAttribute("src", `${MEDIA_BASE_URL}${needsSlashSame ? "/" : ""}${sameHostPath}`);
      return;
    }

    if (!isAbsoluteUrl(src)) {
      let cleanSrc = src;
      if (src.startsWith("/media/")) {
        cleanSrc = src.substring(7);
      } else if (src.startsWith("media/")) {
        cleanSrc = src.substring(6);
      } else if (src.startsWith("/media/uploads/")) {
        cleanSrc = src.substring("/media/".length);
      } else if (src.startsWith("media/uploads/")) {
        cleanSrc = src.substring("media/".length);
      }

      const needsSlash = !MEDIA_BASE_URL.endsWith("/") && !cleanSrc.startsWith("/");
      source.setAttribute("src", `${MEDIA_BASE_URL}${needsSlash ? "/" : ""}${cleanSrc}`);
    }
  });

  container.querySelectorAll("video[poster]").forEach((video) => {
    const poster = video.getAttribute("poster");
    if (!poster || poster.startsWith("data:")) return;

    const mediaPathFromAbsolute = isAbsoluteUrl(poster) ? getPathAfterMedia(poster) : null;
    if (mediaPathFromAbsolute) {
      const needsSlashAbs = !MEDIA_BASE_URL.endsWith("/") && !mediaPathFromAbsolute.startsWith("/");
      video.setAttribute("poster", `${MEDIA_BASE_URL}${needsSlashAbs ? "/" : ""}${mediaPathFromAbsolute}`);
      return;
    }

    const sameHostPath = isAbsoluteUrl(poster) ? getPathIfSameHostNoMedia(poster) : null;
    if (sameHostPath) {
      const needsSlashSame = !MEDIA_BASE_URL.endsWith("/") && !sameHostPath.startsWith("/");
      video.setAttribute("poster", `${MEDIA_BASE_URL}${needsSlashSame ? "/" : ""}${sameHostPath}`);
      return;
    }

    if (!isAbsoluteUrl(poster)) {
      let cleanPoster = poster;
      if (poster.startsWith("/media/")) {
        cleanPoster = poster.substring(7);
      } else if (poster.startsWith("media/")) {
        cleanPoster = poster.substring(6);
      } else if (poster.startsWith("/media/uploads/")) {
        cleanPoster = poster.substring("/media/".length);
      } else if (poster.startsWith("media/uploads/")) {
        cleanPoster = poster.substring("media/".length);
      }

      const needsSlash = !MEDIA_BASE_URL.endsWith("/") && !cleanPoster.startsWith("/");
      video.setAttribute("poster", `${MEDIA_BASE_URL}${needsSlash ? "/" : ""}${cleanPoster}`);
    }
  });

  return container.innerHTML;
}

// Convert numbered text to HTML lists
export function convertNumberedTextToHtml(text) {
  if (!text || typeof text !== "string") return text;

  // Split by lines and process each line
  const lines = text.split('\n');
  const processedLines = [];
  let currentList = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if line starts with a number followed by a dot or parenthesis
    const numberedMatch = line.match(/^(\d+)[\.\)]\s*(.+)$/);
    
    if (numberedMatch) {
      // Start or continue a list
      if (!inList) {
        inList = true;
        currentList = [];
      }
      currentList.push(numberedMatch[2]); // Add the text after number
    } else {
      // End current list if we were in one
      if (inList && currentList.length > 0) {
        processedLines.push(`<ol>${currentList.map(item => `<li>${item}</li>`).join('')}</ol>`);
        currentList = [];
        inList = false;
      }
      
      // Add the current line (if not empty)
      if (line) {
        processedLines.push(line);
      }
    }
  }

  // Handle case where text ends with a list
  if (inList && currentList.length > 0) {
    processedLines.push(`<ol>${currentList.map(item => `<li>${item}</li>`).join('')}</ol>`);
  }

  return processedLines.join('\n');
}

// Enhanced normalize function that also converts numbered text
export function normalizeAndConvertHtml(htmlString) {
  if (!htmlString || typeof htmlString !== "string") return htmlString;

  // First convert numbered text to HTML
  const convertedText = convertNumberedTextToHtml(htmlString);
  
  // Then normalize the HTML (fix images, etc.)
  return normalizeEditorHtml(convertedText);
}


