<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div
	class="grid w-full grid-cols-2 gap-8 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10"
>
	<div class="col-span-2 rounded-lg border border-neutral-400 p-6">Hello, World.</div>
</div>
