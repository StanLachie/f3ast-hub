import type { PageServerLoad } from "./$types";
import { auth } from "$lib/auth";
export const load = (async ({ request }) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  let isLoggedIn = session?.user ? true : false;

  return { isLoggedIn };
}) satisfies PageServerLoad;
