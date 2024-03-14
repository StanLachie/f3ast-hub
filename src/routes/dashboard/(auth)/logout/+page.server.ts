import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	await locals.supabase.auth.signOut();
	return redirect(302, '/dashboard');
}) satisfies PageServerLoad;
