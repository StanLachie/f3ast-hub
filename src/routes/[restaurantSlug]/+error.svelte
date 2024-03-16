<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="w-dvh flex h-dvh flex-col items-center justify-center">
	<h1 class="text-6xl font-bold text-emerald-300">
		{$page.status}
	</h1>
	<span class="text-lg font-semibold text-neutral-600">
		{$page.error?.message}
	</span>
</div>
