import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const success = url.searchParams.get('success');
	const canceled = url.searchParams.get('canceled');
	const session_id = url.searchParams.get('session_id');

	if (canceled) {
		return redirect(302, '/dashboard/billing');
	} else if (success && session_id) {
		return redirect(302, '/dashboard/restaurant');
	}
}) satisfies PageServerLoad;
