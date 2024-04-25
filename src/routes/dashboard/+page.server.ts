import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = await locals.getSession();

	if (session) {
		redirect(302, '/dashboard/restaurant');
	} else {
		redirect(302, '/dashboard/login');
	}
}) satisfies PageServerLoad;
