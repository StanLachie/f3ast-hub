<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount, onDestroy } from 'svelte';

	let currentIndex = 0;
	let images = [
		{
			title: 'Your Online Menu, Your Way',
			description: 'Allow customers to explore your menu with ease.',
			src: 'https://www.f3ast.com/_next/image?url=%2Fimages%2Fscreenshots%2F1.webp&w=1920&q=75'
		},
		{
			title: 'Customer Inquires Made Easy',
			description: 'Connect with your customers directly via email.',
			src: 'https://www.f3ast.com/_next/image?url=%2Fimages%2Fscreenshots%2F3.webp&w=1920&q=75'
		},
		{
			title: 'Customize Your Website',
			description: 'Your business is unique, and your online presence should be too.',
			src: 'https://www.f3ast.com/_next/image?url=%2Fimages%2Fscreenshots%2F4.webp&w=1920&q=75'
		}
	];

	let interval: ReturnType<typeof setInterval>;

	onMount(() => {
		interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
		}, 3500);
	});

	onDestroy(() => {
		clearInterval(interval);
	});

	function nextImage() {
		currentIndex = (currentIndex + 1) % images.length;
		clearInterval(interval);
		interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
		}, 3500);
	}

	function prevImage() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
		clearInterval(interval);
		interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % images.length;
		}, 3500);
	}
</script>

<div class="relative">
	<div class="mx-auto my-32 max-w-4xl px-8">
		{#each images as image, i}
			<img
				src={image.src}
				alt={`Image ${i + 1}`}
				class={`aspect-video w-full rounded-t-2xl  border border-b-0 border-emerald-950 ${i === currentIndex ? '' : 'hidden'}`}
			/>
		{/each}
		<div
			class="flex justify-between divide-x divide-emerald-950 rounded-b-2xl border border-emerald-950 bg-emerald-300 font-semibold text-emerald-950"
		>
			<button on:click={prevImage} class="rounded-bl-2xl p-6 transition-all hover:bg-emerald-400"
				><Icon icon="mingcute:arrow-left-circle-line" class="text-4xl" /></button
			>
			<div class="flex-1 bg-white px-6 py-4">
				<div class="flex justify-between">
					<span class="text-xl">
						{images[currentIndex].title}
					</span>
					<span class="text-xl">
						({currentIndex + 1}/{images.length})
					</span>
				</div>
				<p class="text-neutral-500">{images[currentIndex].description}</p>
			</div>
			<button on:click={nextImage} class="rounded-br-2xl p-6 transition-all hover:bg-emerald-400"
				><Icon icon="mingcute:arrow-right-circle-line" class="text-4xl" /></button
			>
		</div>
	</div>
</div>
