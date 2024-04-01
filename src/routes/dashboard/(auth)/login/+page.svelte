<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';

	let isSubmitting = false;
</script>

<form
	method="POST"
	class="form"
	use:enhance={() => {
		isSubmitting = true;
		return async ({ update }) => {
			update({ invalidateAll: false }).finally(() => {
				isSubmitting = false;
			});
		};
	}}
>
	<h1 class="text-2xl font-semibold">Login</h1>
	<input class="input" type="email" name="email" placeholder="Email" />
	<input class="input" type="password" name="password" placeholder="Password" />
	<button class="btn-primary w-full" disabled={isSubmitting} type="submit">
		{isSubmitting ? 'Logging in...' : 'Login'}
	</button>
	<span class=" text-neutral-600">
		Need an account?
		<a class=" text-emerald-500 underline" href="/dashboard/register"> register </a>
	</span>
</form>
