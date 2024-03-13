<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>
<form method="POST">
	<h1 class="text-2xl font-semibold">Signup</h1>
	<input type="text" name="First Name" placeholder="First Name" />
	<input type="text" name="Last Name" placeholder="Last Name" />
	
	<input type="email" name="Email" placeholder="Email" />
	<input type="text" name="Username" placeholder="Username" />
	<input type="password" name="Password" placeholder="Password" />
	<input type="password" name="Confirm Password" placeholder="Confirm Passoword" />
	<button class="btn-primary w-full"> Signup </button>
</form>
