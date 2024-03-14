<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<div class="min-h-screen w-screen bg-red-400">
	<slot />
</div>
