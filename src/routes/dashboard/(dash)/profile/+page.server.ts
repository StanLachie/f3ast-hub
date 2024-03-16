import prisma from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();
		const firstName = data.get('firstName') as string;
		const lastName = data.get('lastName') as string;
		const promotionalEmails = data.has('promotionalEmails') as boolean;

		const { data: userData } = await locals.supabase.auth.getUser();

		if (!userData.user || !userData.user.email) {
			return redirect(302, '/dashboard/login');
		}

		if (firstName) {
			await prisma.clientAccount.update({
				where: {
					email: userData.user.email
				},
				data: {
					first_name: firstName
				}
			});
			return { success: true };
		} else if (lastName) {
			await prisma.clientAccount.update({
				where: {
					email: userData.user.email
				},
				data: {
					last_name: lastName
				}
			});
			return { success: true };
		} else {
			await prisma.clientAccount.update({
				where: {
					email: userData.user.email
				},
				data: {
					promotional_emails: promotionalEmails
				}
			});
			return { success: true };
		}

		return fail(500, {
			error: 'Server error. Please try again later.'
		});
	}
};
