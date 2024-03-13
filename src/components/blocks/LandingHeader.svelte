<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '../Button.svelte';
</script>

<div class="flex w-full justify-between px-16 py-6">
	<h1 class="font-norwester text-4xl">F3AST</h1>
	<div class="flex gap-4">
		<a class="btn-outline" href="/dashboard">Dashboard</a>
		<a class="btn-primary" href="/">Contact Us</a>
		<a class="btn-simple" href="/">Sign In</a>
		<a class="btn-dark" href="/">Sign Up</a>
	</div>
</div>
