<script lang="ts">
	import { fade } from 'svelte/transition';

	export let open = false;
	export let onClose = () => {
		open = false;
	};

	function stopPropagation(event: MouseEvent) {
		event.stopPropagation();
	}
</script>

{#if open}
	<button
		class=" fixed inset-0 z-50 flex cursor-default items-center justify-center bg-black bg-opacity-50"
		transition:fade={{ duration: 250 }}
		on:click={onClose}
	>
		<button
			class="m-6 w-full max-w-lg cursor-default rounded-2xl border-2 border-neutral-400 bg-white p-6 shadow-lg"
			on:click={stopPropagation}
		>
			<slot />
		</button>
	</button>
{/if}
