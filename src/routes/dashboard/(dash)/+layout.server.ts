import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const session = await locals.getSession();

	if (!session) {
		redirect(302, '/dashboard/login');
	}

	return {
		session: session
	};
}) satisfies LayoutServerLoad;
