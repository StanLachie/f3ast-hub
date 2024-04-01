<script lang="ts">
	import type { PageData } from './$types';
	import Modal from '$lib/components/Modal.svelte';
	import { enhance } from '$app/forms';

	export let data: PageData;
	const { layoutData } = data;

	let openModal = '';

	const closeModal = () => {
		openModal = '';
	};

	let logoFile = '';
	let bannerFile = '';
	let menuImageFile = '';
</script>

<div class="mx-auto flex w-full max-w-3xl flex-col gap-8">
	<div>
		<h1 class="my-2 text-3xl font-semibold">Your Gallery</h1>
		<p class="text-neutral-600">Upload, edit and delete images you use all over your site!</p>
		<div class="my-6 flex flex-col gap-4">
			{#await layoutData}
				<div
					class="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm"
				>
					<p class="font-semibold">Loading Your Gallery</p>
				</div>
			{:then layoutData}
				<div
					class="grid w-full grid-cols-4 gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
				>
					<div class="col-span-full md:col-span-3">
						<h2 class="text-lg font-semibold">Brand Logo</h2>
						<p class="text-neutral-600">Upload a logo that will be used all over your site.</p>
					</div>
					<div class="col-span-full flex justify-center md:col-span-1 md:justify-end">
						<button
							class="overflow-hidden rounded-full"
							on:click={() => {
								openModal = 'uploadLogo';
							}}
						>
							<img
								src={layoutData.restaurant?.logo}
								alt="Brand Logo"
								class="h-20 w-20 cursor-pointer object-cover md:h-16 md:w-16"
							/>
						</button>

						<!-- <button
						type="submit"
						class="btn-primary w-full md:w-auto"
						
					>
						Create Category
					</button> -->
						{#if openModal === 'uploadLogo'}
							<Modal open={true} onClose={closeModal}>
								<form
									class="flex flex-col gap-3"
									method="post"
									action="?/uploadLogo"
									enctype="multipart/form-data"
									use:enhance
								>
									<div class="flex flex-row items-center">
										<input
											name="logoFile"
											type="file"
											id="custom-input"
											accept=".jpg, .jpeg, .png"
											on:change={(e) => {
												const file = e.target?.files[0];
												if (!file) return;
												logoFile = file.name;
											}}
											hidden
										/>
										<label for="custom-input" class="btn-outline w-full cursor-pointer">
											Select a file
										</label>
									</div>

									<input
										type="text"
										class="input"
										value={logoFile}
										placeholder="No file selected"
										disabled
									/>

									<button type="submit" class="btn-primary"> Upload </button>
								</form>
							</Modal>
						{/if}
					</div>
				</div>
				<div
					class="grid w-full grid-cols-4 gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
				>
					<div class="col-span-full md:col-span-3">
						<h2 class="text-lg font-semibold">Banner</h2>
						<p class="text-neutral-600">Upload a banner that will be used all over your site.</p>
					</div>
					<div class="col-span-full flex justify-center md:col-span-1 md:justify-end">
						<button
							class="aspect-video overflow-hidden rounded-2xl"
							on:click={() => {
								openModal = 'uploadBanner';
							}}
						>
							<img
								src={layoutData.restaurant?.banner}
								alt="Brand Banner"
								class="h-24 cursor-pointer object-cover md:h-20"
							/>
						</button>

						<!-- <button
						type="submit"
						class="btn-primary w-full md:w-auto"
						
					>
						Create Category
					</button> -->
						{#if openModal === 'uploadBanner'}
							<Modal open={true} onClose={closeModal}>
								<form
									class="flex flex-col gap-3"
									method="post"
									action="?/uploadBanner"
									enctype="multipart/form-data"
									use:enhance
								>
									<div class="flex flex-row items-center">
										<input
											name="bannerFile"
											type="file"
											id="custom-input"
											accept=".jpg, .jpeg, .png"
											on:change={(e) => {
												const file = e.target?.files[0];
												if (!file) return;
												bannerFile = file.name;
											}}
											hidden
										/>
										<label for="custom-input" class="btn-outline w-full cursor-pointer">
											Select a file
										</label>
									</div>

									<input
										type="text"
										class="input"
										value={bannerFile}
										placeholder="No file selected"
										disabled
									/>

									<button type="submit" class="btn-primary"> Upload </button>
								</form>
							</Modal>
						{/if}
					</div>
				</div>
				<div
					class="grid w-full grid-cols-4 gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
				>
					<div class="col-span-full md:col-span-3">
						<h2 class="text-lg font-semibold">Menu Images</h2>
						<p class="text-neutral-600">Upload images that will be used for your menu.</p>
					</div>
					<div class="col-span-full flex justify-center md:col-span-1 md:justify-end">
						<button
							type="submit"
							class="btn-primary w-full md:w-auto"
							on:click={() => {
								openModal = 'uploadMenuImage';
							}}
						>
							Upload Image
						</button>
						{#if openModal === 'uploadMenuImage'}
							<Modal open={true} onClose={closeModal}>
								<form
									class="flex flex-col gap-3"
									method="post"
									action="?/uploadMenuImage"
									enctype="multipart/form-data"
									use:enhance
								>
									<div class="flex flex-row items-center">
										<input
											name="menuImageFile"
											type="file"
											id="custom-input"
											accept=".jpg, .jpeg, .png"
											on:change={(e) => {
												const file = e.target?.files[0];
												if (!file) return;
												menuImageFile = file.name;
											}}
											hidden
										/>
										<label for="custom-input" class="btn-outline w-full cursor-pointer">
											Select a file
										</label>
									</div>

									<input
										type="text"
										class="input"
										value={menuImageFile}
										placeholder="No file selected"
										disabled
									/>

									<button type="submit" class="btn-primary"> Upload </button>
								</form>
							</Modal>
						{/if}
					</div>
					<div class="col-span-full flex flex-wrap gap-2">
						{#each data.menuImages as menuImage}
							<div>
								<img
									src={`https://cpqmfpdmwfoaxcxituch.supabase.co/storage/v1/render/image/public/client-assets/${menuImage.name}?width=100&height=100`}
									alt="Menu Item"
									class="h-24 min-w-24 flex-shrink-0 cursor-pointer rounded-lg object-cover"
								/>
							</div>
						{/each}
					</div>
				</div>
			{/await}
		</div>
	</div>
</div>
