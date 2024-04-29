import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { sendEmail } from '$lib/sendEmail';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	contact: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const subject = data.get('subject') as string;
		const message = data.get('message') as string;

		if (!name || !email || !subject || !message) {
			return fail(400, {
				error: true,
				message: 'Please fill out all fields.'
			});
		}

		try {
			await sendEmail(
				'lachlan@f3ast.com',
				`${name} <${email}>`,
				`URGENT - ${subject}`,
				message,
				null
			).then(async () => {
				await sendEmail(
					`${email}`,
					`F3AST <noreply@f3ast.com>`,
					`We've received your message.`,
					null,
					"Thanks for contacting us. We'll get back to you as soon as possible.\n\nBest regards,\nF3AST"
				)
					.then(() => {
						return { success: true };
					})
					.catch((error) => {
						return { success: false, message: error.message };
					});
			});
		} catch (error) {
			console.error(error);
			return fail(500, {
				error: true,
				message: 'An error occurred while sending the email.'
			});
		}
	}
};
