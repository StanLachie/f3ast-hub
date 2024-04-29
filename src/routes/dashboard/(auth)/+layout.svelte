<script>
	import HeadlessNav from '$lib/components/HeadlessNav.svelte';
</script>

<div class="flex min-h-screen items-center justify-center bg-neutral-100 p-4">
	<slot />
</div>

<HeadlessNav contact />
