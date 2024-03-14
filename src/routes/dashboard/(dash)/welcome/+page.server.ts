import prisma from '$lib/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const { data } = await locals.supabase.auth.getUser();

	if (!data.user || !data.user.email) {
		return redirect(302, '/dashboard/login');
	}

	const client = await prisma.clientAccount.findUnique({
		where: {
			email: data.user.email
		}
	});

	return {
		client
	};
}) satisfies PageServerLoad;
