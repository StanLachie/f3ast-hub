import { BASE_URL } from "$env/static/public";
import type { auth } from "./auth";
import { createAuthClient } from "better-auth/svelte";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  basePath: "/api/auth",
  baseURL: BASE_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
});
