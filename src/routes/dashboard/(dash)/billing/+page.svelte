<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	let { layoutData } = data;
</script>

<meta:head>
	<title>Dashboard | Billing</title>
</meta:head>

<div class="mx-auto flex w-full max-w-3xl flex-col gap-8">
	<div>
		<h1 class="my-2 text-3xl font-semibold">Restaurant Billing</h1>
		<p class="text-neutral-600">Update your billing details here.</p>
		<div class="my-6 flex flex-col gap-4">
			{#await layoutData}
				<div
					class="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm"
				>
					<p class="font-semibold">Loading Your Billing</p>
				</div>
			{:then layoutData}
				<div
					class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
				>
					<div class="flex-1">
						<h2 class="text-lg font-semibold">Billing Status</h2>
						<p class="text-neutral-600">
							The current billing status of {layoutData.restaurant?.name}
						</p>
					</div>
					<form method="post" action="?/reactivate" class="">
						<button
							class={`btn-primary cursor-default hover:bg-emerald-300 ${layoutData.subscription?.status !== 'active' && 'cursor-pointer bg-red-300 hover:scale-[97.5%] hover:bg-red-400'}`}
							disabled={layoutData.subscription?.status === 'active'}
							type="submit"
							>{layoutData.subscription?.status === 'active' ? 'Active' : 'Reactivate'}</button
						>
					</form>
				</div>
				{#if layoutData.subscription?.status === 'active'}
					<div
						class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
					>
						<div class="flex-1">
							<h2 class="text-lg font-semibold">Update Billing</h2>
							<p class="text-neutral-600">Update your billing details here.</p>
						</div>
						<form method="post" action="?/update" class="">
							<button class="btn-outline" type="submit">Update</button>
						</form>
					</div>
				{/if}
			{/await}
		</div>
	</div>
</div>
