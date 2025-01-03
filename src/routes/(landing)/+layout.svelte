<script lang="ts">
  import "../../app.css";
  import Meta from "$lib/components/utils/Meta.svelte";
  import Footer from "$lib/components/blocks/Footer.svelte";
</script>

<Meta
  title="F3AST"
  description="Create an online presence for your food business with F3AST."
/>

<slot />
<img src="/waveUp.svg" alt="wave" class="w-full" />
<Footer />
