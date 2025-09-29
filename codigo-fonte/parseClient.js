
import Parse from "parse/node.js";

const APP_ID =
  process.env.BACK4APP_APP_KEY;
const JS_KEY = process.env.BACK4APP_JS_KEY;
const MKEY = process.env.BACK4APP_MKEY;

Parse.initialize(APP_ID, JS_KEY, MKEY);
Parse.serverURL = "https://parseapi.back4app.com/";

export default Parse;