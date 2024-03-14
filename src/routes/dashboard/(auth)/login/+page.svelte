<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<form method="POST">
	<h1 class="text-2xl font-semibold">Login</h1>
	<input type="text" name="Email" placeholder="Email" />
	<input type="password" name="password" placeholder="Password" />
	<button class="btn-primary w-full"> Login </button>
	<span class=" text-neutral-600">
		Need an account?
		<a class=" underline text-emerald-500" href="/dashboard/register"> register </a>
	</span>
</form>
