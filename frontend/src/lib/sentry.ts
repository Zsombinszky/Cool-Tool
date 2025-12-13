import * as Sentry from "@sentry/react";

const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

if (dsn && import.meta.env.MODE === "production") {
  Sentry.init({
    dsn,
    environment: "production",
  });
}
