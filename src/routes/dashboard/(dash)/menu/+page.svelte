<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="mx-auto flex w-full max-w-4xl flex-col gap-8">
	<div>
		<h1 class="my-2 text-3xl font-semibold">Menu Editor</h1>
		<p class="text-neutral-600">Edit your menu items here.</p>

		<div class="my-6 flex flex-col gap-4">
			<div
				class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
			>
				<div class="flex-1">
					<h2 class="text-lg font-semibold">Categories</h2>
					<p class="text-neutral-600">Create or edit menu categories</p>
				</div>
				<div class="flex gap-2">
					<button> Edit </button>
					<button> Add </button>
				</div>
			</div>
		</div>
	</div>
</div>
