// Minimal Google Analytics 4 helper for Vite + React Router apps
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const initAnalytics = (measurementId: string | undefined) => {
  if (!measurementId) return;
  if (typeof window === "undefined") return;

  if (!window.dataLayer) window.dataLayer = [];
  if (!window.gtag)
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    } as any;

  // Inject GA script once
  if (
    !document.querySelector(
      `script[src^="https://www.googletagmanager.com/gtag/js"]`
    )
  ) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    send_page_view: false,
    debug_mode: import.meta.env.DEV,
    anonymize_ip: true,
  });
};

export const trackPageView = (
  measurementId: string | undefined,
  path: string
) => {
  if (!measurementId || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_location: window.location.href,
    page_path: path,
  });
};

export const setUserId = (
  measurementId: string | undefined,
  userId?: string
) => {
  if (!measurementId || !userId || !window.gtag) return;
  window.gtag("config", measurementId, { user_id: userId });
};

export const setUserProps = (
  props: Record<string, string | number | boolean>
) => {
  if (!window.gtag) return;
  window.gtag("set", "user_properties", props);
};

export const trackEvent = (
  name: string,
  params?: Record<string, string | number | boolean>
) => {
  if (!window.gtag) return;
  window.gtag("event", name, params || {});
};
