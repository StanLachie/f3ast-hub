<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<form method="POST">
	<h1 class="text-2xl font-semibold">Login</h1>
	<input type="text" name="username" placeholder="Username" />
	<input type="password" name="password" placeholder="Password" />
	<button class="btn-primary w-full"> Login </button>
	<span class="">
		Need an account?
		<a class=" underline" href="/dashboard/register"> register </a>
	</span>
	<!-- Add a styling tag to the a element add an underline, text emerald 300. finally add a styling tag to the span: text-neutral-500 -->
</form>
