export const config = {
	runtime: 'edge'
};

export const load = async (event) => {
	const session = await event.locals.getSession();
	return {
		session
	};
};
