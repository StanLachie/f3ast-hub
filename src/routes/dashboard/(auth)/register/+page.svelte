<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<form method="POST" class="form">
	<h1 class="text-2xl font-semibold">Register</h1>
	<input class="input" type="text" name="First Name" placeholder="First Name" />
	<input class="input" type="text" name="Last Name" placeholder="Last Name" />
	<input class="input" type="email" name="Email" placeholder="Email" />
	<input class="input" type="text" name="Username" placeholder="Username" />
	<input class="input" type="password" name="Password" placeholder="Password" />
	<input class="input" type="password" name="Confirm Password" placeholder="Confirm Password" />
	<button class="btn-primary w-full"> Register </button>
	<span class=" text-neutral-600">
		Already have an account?
		<a class=" text-emerald-500 underline" href="/dashboard/login"> login </a>
	</span>
</form>
