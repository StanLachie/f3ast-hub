<script lang="ts">
	import Icon from '@iconify/svelte';
	import SettingSkeleton from './SettingSkeleton.svelte';

	export let title: string;
	export let description: string;
	export let loading: boolean = false;
	export let shape: 'circle' | 'square' = 'circle';
	export let currentImage: string | null = null;
	export let uploadUrl: string;

	let fileInput: HTMLInputElement;

	let isUploadingImage = false;

	const handleFileChange = async () => {
		const files = fileInput?.files;
		if (!files || files.length === 0) {
			console.error('No file selected');
			return;
		}

		const file = files[0];
		if (file instanceof File) {
			const formData = new FormData();
			formData.append('image', file);

			try {
				isUploadingImage = true;

				const response = await fetch(uploadUrl, {
					method: 'POST',
					body: formData
				});

				isUploadingImage = false;

				if (response.ok) {
					const data = await response.json();
					currentImage = data.url;
					console.log('Image uploaded successfully');
				} else {
					throw new Error('Failed to upload image');
				}
			} catch (error: any) {
				alert(error.message);
			}
		} else {
			console.error('Error: The selected file is not valid');
		}
	};

	const onClickButton = () => {
		fileInput.value = ''; // Reset the input
		fileInput.click();
	};
</script>

{#if !loading}
	<div
		class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
	>
		<div class="flex-1">
			<h2 class="text-lg font-semibold">{title}</h2>
			<p class="text-neutral-600">{description}</p>
		</div>

		<form on:submit|preventDefault>
			<input
				type="file"
				class="input"
				accept="image/*"
				bind:this={fileInput}
				hidden
				on:change={handleFileChange}
			/>

			<button class="flex flex-1 justify-end" on:click={onClickButton}>
				{#if !currentImage || isUploadingImage}
					<div
						class={`${shape === 'circle' ? 'aspect-square rounded-full' : 'aspect-video rounded-lg'} h-16 cursor-pointer border border-neutral-400 bg-neutral-200 shadow-sm`}
					>
						{#if isUploadingImage}
							<Icon
								icon="mingcute:loading-3-fill"
								class="h-full w-full animate-spin p-4 text-emerald-500"
							/>
						{:else}
							<Icon icon="mingcute:edit-2-fill" class="h-full w-full p-4 text-neutral-400" />
						{/if}
					</div>
				{:else}
					<img
						src={currentImage}
						alt="preview"
						class={`${shape === 'circle' ? 'aspect-square rounded-full' : 'aspect-video rounded-lg'} h-16 cursor-pointer border border-neutral-400 bg-neutral-200 object-cover shadow-sm`}
					/>
				{/if}
			</button>
		</form>
	</div>
{:else}
	<SettingSkeleton />
{/if}
