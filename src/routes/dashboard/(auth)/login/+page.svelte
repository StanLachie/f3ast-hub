<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	let error: string | null = null;
	let isSubmitting = false;
</script>

<form
	method="POST"
	class="form"
	use:enhance={() => {
		isSubmitting = true;
		return async ({ result }) => {
			console.log(result);
			if (
				result.type === 'failure' &&
				result.data &&
				result.data.error &&
				result.data.error &&
				typeof result.data.message === 'string'
			) {
				error = result.data.message;
				isSubmitting = false;
			} else {
				goto('/dashboard');
			}
		};
	}}
>
	<h1 class="text-2xl font-semibold">Login</h1>
	{#if error}
		<div
			class="w-full rounded-lg border border-neutral-800 bg-red-400 px-3 py-2 text-center font-normal text-sm"
		>
			{error}
		</div>
	{/if}
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
