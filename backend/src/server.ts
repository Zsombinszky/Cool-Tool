import "dotenv/config";
import { buildApp } from "./app.js";

const start = async () => {
  const app = await buildApp();
  const port = Number(app.config.PORT || 4000);

  try {
    await app.listen({ port, host: "0.0.0.0" });
    app.log.info(`Server running on http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
