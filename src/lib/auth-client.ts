import type { auth } from "./auth";
import { createAuthClient } from "better-auth/svelte";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:5173",
  plugins: [inferAdditionalFields<typeof auth>()],
});
