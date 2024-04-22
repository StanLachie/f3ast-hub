<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<meta:head>
	<title>Dashboard | Support</title>
</meta:head>

<div class="mx-auto flex w-full max-w-3xl flex-col gap-8">
	<div>
		<h1 class="my-2 text-3xl font-semibold">Support</h1>
		<p class="text-neutral-600">
			Need help with your restaurant? Running into issues? We're here to help.
		</p>

		{#await data.layoutData}
			<div
				class="my-6 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm"
			>
				<p class="font-semibold">Loading Support Options</p>
			</div>
		{:then layoutData}
			<div class="my-6 flex flex-col gap-4">
				<div
					class="grid w-full grid-cols-4 gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
				>
					<div class="col-span-full md:col-span-2">
						<h2 class="text-lg font-semibold">Email Us</h2>
						<p class="text-neutral-600">We'll get back to you as soon as possible.</p>
					</div>
					<div class="col-span-full flex justify-end md:col-span-2">
						<a
							class="btn-primary"
							href={`mailto:support@f3ast.com?subject=Client%20Support%20Needed%20%7C%20%40%20${layoutData.restaurant?.name}`}
							target="_blank"
							rel="noopener noreferrer"
						>
							Email Us
						</a>
					</div>
				</div>
			</div>
		{/await}
	</div>
</div>
