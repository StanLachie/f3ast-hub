<script lang="ts">
	export let title: string;
	export let description: string;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://f3ast.com" />
	<!-- <meta property="og:image" content="https://f3ast.com/og.png" /> -->
	<!-- <meta name="twitter:card" content="summary_large_image" /> -->
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<!-- <meta name="twitter:image" content="https://f3ast.com/og.png" /> -->
</svelte:head>
