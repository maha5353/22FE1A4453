import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { logEvent } from "../utils/logger";

function RedirectHandler() {
  const { code } = useParams();

  useEffect(() => {
    let links = JSON.parse(localStorage.getItem("links")) || [];
    let link = links.find((l) => l.code === code);

    if (!link) {
      alert("Invalid or expired short URL");
      logEvent("Invalid short URL tried", { code });
      return;
    }

    // Check expiry
    let now = new Date();
    if (new Date(link.expire) < now) {
      alert("This short URL has expired.");
      logEvent("Expired short URL", { code });
      return;
    }

    // Track click
    let click = {
      time: now.toISOString(),
      source: document.referrer || "Direct",
      location: "Unknown", // (we can’t get exact location client-side without API)
    };
    link.clicks.push(click);

    // Save updated links
    let updated = links.map((l) => (l.code === code ? link : l));
    localStorage.setItem("links", JSON.stringify(updated));

    logEvent("Short URL clicked", { code, url: link.url });

    // Redirect
    window.location.href = link.url;
  }, [code]);

  return <p>Redirecting...</p>;
}

export default RedirectHandler;
