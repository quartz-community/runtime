import type { ContentIndex } from "@quartz-community/types";

/**
 * Browser runtime utilities for Quartz community plugins
 * These utilities run in the browser to support community plugins
 */

// ============================================================================
// Script Loading
// ============================================================================

interface ScriptCache {
  [url: string]: Promise<void> | void;
}

const scriptCache: ScriptCache = {};

/**
 * Loads a script from CDN once, caches the result
 */
export function loadScript(src: string): Promise<void> {
  if (scriptCache[src]) {
    return Promise.resolve(scriptCache[src]);
  }

  const promise = new Promise<void>((resolve, reject) => {
    // Check if already loaded in DOM
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });

  scriptCache[src] = promise;
  return promise;
}

/**
 * Loads multiple scripts in parallel
 */
export function loadScripts(sources: string[]): Promise<void[]> {
  return Promise.all(sources.map(loadScript));
}

// ============================================================================
// Data Fetching
// ============================================================================

export async function fetchContentIndex(): Promise<ContentIndex> {
  return fetchData;
}

// ============================================================================
// Event Handling
// ============================================================================

/**
 * Register cleanup handlers for SPA navigation
 */
export function onNav(callback: (e: Event) => void): () => void {
  document.addEventListener("nav", callback);

  const cleanup = () => document.removeEventListener("nav", callback);

  // Register with window.addCleanup if available (Quartz integration)
  if (typeof window !== "undefined" && (window as any).addCleanup) {
    (window as any).addCleanup(cleanup);
  }

  return cleanup;
}

/**
 * Register pre-navigation handler
 */
export function onPreNav(callback: () => void): () => void {
  document.addEventListener("prenav", callback);
  return () => document.removeEventListener("prenav", callback);
}

/**
 * Register render event handler.
 * The 'render' event fires when DOM content changes in-place (e.g. after decryption,
 * theme change, or dynamic content injection) and components need to re-initialize.
 * This is distinct from 'nav' which fires on page navigation.
 */
export function onRender(callback: (e: Event) => void): () => void {
  document.addEventListener("render", callback);

  const cleanup = () => document.removeEventListener("render", callback);

  // Register with window.addCleanup if available (Quartz integration)
  if (typeof window !== "undefined" && (window as any).addCleanup) {
    (window as any).addCleanup(cleanup);
  }

  return cleanup;
}

// ============================================================================
// DOM Utilities
// ============================================================================

/**
 * Remove all children from a DOM element
 */
export function removeAllChildren(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============================================================================
// Navigation Utilities
// ============================================================================

/**
 * Check if running in development mode
 */
export function isDevMode(): boolean {
  return typeof window !== "undefined" && (window as any).DEV_MODE === true;
}

/**
 * Get current page slug from URL
 */
export function getCurrentSlug(): string {
  const path = window.location.pathname;
  let slug = path;

  // Remove trailing slash
  if (slug.endsWith("/")) {
    slug = slug.slice(0, -1);
  }

  // Remove leading slash
  if (slug.startsWith("/")) {
    slug = slug.slice(1);
  }

  return slug || "index";
}

/**
 * Navigate to a slug
 */
export function navigateTo(slug: string): void {
  window.location.href = "/" + slug;
}

// ============================================================================
// Storage Utilities
// ============================================================================

const STORAGE_PREFIX = "quartz-";

/**
 * Save state to localStorage with prefix
 */
export function saveState(key: string, value: any): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn("[Quartz] Failed to save state:", e);
  }
}

/**
 * Load state from localStorage
 */
export function loadState(key: string, defaultValue: any = null): any {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn("[Quartz] Failed to load state:", e);
    return defaultValue;
  }
}

// ============================================================================
// CDN URLs
// ============================================================================

/**
 * Common CDN URLs for libraries used by Quartz plugins
 */
export const CDN_URLS = {
  d3: "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js",
  pixijs: "https://cdn.jsdelivr.net/npm/pixi.js@8/dist/pixi.min.js",
  flexsearch:
    "https://cdn.jsdelivr.net/npm/flexsearch@0.7.31/dist/flexsearch.bundle.min.js",
} as const;
