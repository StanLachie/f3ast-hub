import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (locals.session) {
		redirect(302, '/dashboard/welcome');
	} else {
		redirect(302, '/dashboard/login');

	}
}) satisfies PageServerLoad;
