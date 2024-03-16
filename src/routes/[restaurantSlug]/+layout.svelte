<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="h-dvh w-screen">
	<div class="mx-auto h-1/2 max-w-4xl p-2 sm:p-8 md:p-16">
		<slot />
	</div>
</div>
