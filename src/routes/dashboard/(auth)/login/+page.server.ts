import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const username = data.get('username');
		const password = data.get('password');

		if (username === 'admin' && password === 'admin') {
			return redirect(302, '/dashboard/welcome');
		}
	}
};
