<script lang="ts">
  import "../app.css";
  import Meta from "$lib/components/utils/Meta.svelte";

  export let data;
</script>

<Meta
  title="F3AST"
  description="Create an online presence for your food business with F3AST."
/>

<slot />
