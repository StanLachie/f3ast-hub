<script lang="ts">
	export let contact: boolean = false;
</script>

<div class="absolute top-0 flex w-full justify-between px-4 py-6 sm:px-16">
	<a class="font-norwester text-4xl" href="/">F3AST</a>
	{#if contact}
		<a class="btn-primary" href="/contact">Contact Us</a>
	{/if}
</div>
