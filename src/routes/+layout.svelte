<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';
	import Meta from '$lib/components/utils/Meta.svelte';

	export let data;

	$: ({ supabase } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, _session) => {
			invalidate('supabase:auth');
			invalidateAll();
		});
		return () => subscription.unsubscribe();
	});
</script>

<Meta title="F3AST" description="Create an online presence for your food business with F3AST." />

<slot />
