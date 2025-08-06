import serverless from "serverless-http";
import app from "./app.js";      // now resolves
export const handler = serverless(app, {
  binary: ["image/png", "image/jpeg", "application/pdf"]
});