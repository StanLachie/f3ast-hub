import { redirect, fail } from '@sveltejs/kit';
import { AuthApiError } from '@supabase/supabase-js';

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		const email = data.get('email');
		const password = data.get('password');

		const { data: signInData, error } = await locals.supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (error) {
			if (error instanceof AuthApiError && error.status >= 400 && error.status < 500) {
				return fail(400, {
					error: 'invalidCredentials',
					email: email,
					invalid: true,
					message: error.message
				});
			}
			return fail(500, {
				error: 'Server error. Please try again later.'
			});
		}

		if (!error && !!signInData.user && !signInData.user.identities.length) {
			return fail(409, {
				error: 'User already exists',
				email: email,
				invalid: true,
				message: 'User already exists'
			});
		}

		return redirect(302, '/dashboard/welcome');
	}
};
