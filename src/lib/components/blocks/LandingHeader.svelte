<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '../Button.svelte';
</script>

<div class="flex w-full justify-between px-4 py-6 sm:px-16">
	<h1 class="font-norwester text-4xl">F3AST</h1>
	<div class="flex gap-4">
		<a class="btn-outline" href="/dashboard">Dashboard</a>
		<a class="btn-primary" href="/contact">Contact Us</a>
	</div>
</div>
