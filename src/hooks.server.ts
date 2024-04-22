import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';

export const handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			get: (key) => event.cookies.get(key),
			set: (key, value, options) => {
				event.cookies.set(key, value, { ...options, path: '/' });
			},
			remove: (key, options) => {
				event.cookies.delete(key, { ...options, path: '/' });
			}
		}
	});

	event.locals.getSession = async () => {
		const { data: getUserData } = await event.locals.supabase.auth.getUser();

		let {
			data: { session }
		} = await event.locals.supabase.auth.getSession();

		if (getUserData.user == null) {
			session = null;
		}

		return session;
	};

	event.locals.getUser = async () => {
		const { data } = await event.locals.supabase.auth.getUser();

		if (data.user) {
			const { data: account } = await event.locals.supabase
				.from('ClientAccount')
				.select('*')
				.eq('email', data.user.email)
				.single();

			console.log(account);

			const { data: restaurant } = await event.locals.supabase
				.from('Restaurant')
				.select('*')
				.eq('id', account.restaurantId)
				.single();

			return { account, restaurant };
		}

		return null;
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		}
	});
};
