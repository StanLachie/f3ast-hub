<script lang="ts">
	import Icon from '@iconify/svelte';

	export let isUploadingImage = false;
	export let previewImage: string | null = null;
	export let handleFileChange: (event: Event) => void;
</script>

<div class="flex items-center justify-center">
	{#if isUploadingImage}
		<div
			class="flex aspect-square w-full animate-pulse items-center justify-center rounded-xl bg-neutral-200 text-6xl font-bold"
		>
			<Icon icon="mingcute:loading-3-fill" class="h-32 w-32 animate-spin text-emerald-500" />
		</div>
	{:else if previewImage}
		<form id="img-form" class="group relative w-full" enctype="multipart/form-data">
			<input id="img" type="file" accept="image/*" on:change={handleFileChange} hidden />
			<img
				src={previewImage}
				alt=""
				class="aspect-square w-full cursor-pointer rounded-xl border border-neutral-400 object-cover"
			/>
			<button
				on:click={(e) => {
					e.stopPropagation();
					e.preventDefault();

					document.getElementById('img')?.click();
				}}
				class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-xl bg-neutral-800 opacity-0 transition-opacity duration-500 group-hover:opacity-80"
			>
				<Icon icon="mingcute:edit-2-fill" class="h-1/3 w-1/3 text-emerald-500" />
			</button>
		</form>
	{:else}
		<form id="img-form" class="group relative w-full" enctype="multipart/form-data">
			<input id="img" type="file" accept="image/*" on:change={handleFileChange} hidden />
			<div
				class={`flex aspect-square w-full items-center justify-center rounded-xl border border-neutral-400 bg-neutral-200 text-7xl font-bold`}
			>
				<Icon icon="mingcute:edit-2-fill" class="h-1/3 w-1/3 text-emerald-500" />
			</div>
			<button
				on:click={(e) => {
					e.stopPropagation();
					e.preventDefault();

					document.getElementById('img')?.click();
				}}
				class="absolute inset-0 flex cursor-pointer items-center justify-center rounded-xl bg-neutral-800 opacity-0 transition-opacity duration-500 group-hover:opacity-80"
			>
				<Icon icon="mingcute:edit-2-fill" class="h-1/3 w-1/3 text-emerald-500" />
			</button>
		</form>
	{/if}
</div>
