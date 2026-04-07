export function sendTelemetry(event) {
  try {
    const body = JSON.stringify({
      ...event,
      ts: Date.now(),
      path: window.location.pathname,
      ua: navigator.userAgent,
    });

    // Prefer sendBeacon for "fire-and-forget" UX.
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/telemetry/event", blob);
      return;
    }

    fetch("/telemetry/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch (_) {
    // best-effort
  }
}

