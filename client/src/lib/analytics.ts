type AnalyticsPayload = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, payload?: AnalyticsPayload) => void;
    };
  }
}

const analyticsEnabled =
  Boolean(import.meta.env.VITE_ANALYTICS_ENDPOINT) &&
  Boolean(import.meta.env.VITE_ANALYTICS_WEBSITE_ID);

export function canTrackReportEvents() {
  return analyticsEnabled;
}

export function trackReportEvent(
  eventName: string,
  payload?: AnalyticsPayload
) {
  if (!analyticsEnabled || typeof window === "undefined") {
    return;
  }

  window.umami?.track(eventName, payload);
}
