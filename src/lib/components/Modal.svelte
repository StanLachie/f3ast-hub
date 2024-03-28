<script lang="ts">
	export let open = false;
	export let onClose = () => {
		open = false;
	};

	function stopPropagation(event: MouseEvent) {
		event.stopPropagation();
	}
</script>

{#if open}
	<a
		class="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50"
		on:click={onClose}
	>
		<a
			class="m-6 w-full max-w-lg rounded-2xl border-2 border-neutral-400 bg-white p-6 shadow-lg"
			on:click={stopPropagation}
		>
			<slot />
		</a>
	</a>
{/if}
