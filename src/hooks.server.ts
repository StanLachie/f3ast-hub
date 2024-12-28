import { auth } from "$lib/auth";
import { redirect } from "@sveltejs/kit";
import { svelteKitHandler } from "better-auth/svelte-kit";

export async function handle({ event, resolve }) {
  const session = await auth.api.getSession({
    headers: event.request.headers,
  });

  if (event.url.pathname === "/dashboard") {
    if (!session?.user) {
      redirect(303, "/dashboard/login");
    }

    redirect(303, "/dashboard/restaurant");
  }

  if (isRouteProtected(event.route.id as string) && !session?.user) {
    redirect(303, "/dashboard/login");
  }

  return svelteKitHandler({ event, resolve, auth });
}

const isRouteProtected = (route: string) =>
  route !== null && route.includes("/(dash)/");
