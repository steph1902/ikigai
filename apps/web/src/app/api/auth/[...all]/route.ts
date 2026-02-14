import { auth } from "@ikigai/auth"; // import from configured auth instance
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
