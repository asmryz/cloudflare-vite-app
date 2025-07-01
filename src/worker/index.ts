import { Hono } from "hono";
const app = new Hono<{ Bindings: Env }>();
import  indexRoute  from "./routes/index";

// Mount routes
app.route("/", indexRoute);

export default app;
