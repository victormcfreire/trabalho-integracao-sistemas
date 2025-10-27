import serverless from "serverless-http";
import app from "../src/app.js";

export default handler = serverless(app);
