<script lang="ts">
  import Icon from "@iconify/svelte";
  import { goto } from "$app/navigation";
  const { isLoggedIn, product, subscriptionBasis } = $props();

  async function handleSelectPlan() {
    if (isLoggedIn) {
      goto("/dashboard/billing");
    } else {
      goto("/dashboard/register");
    }
  }
</script>

<div
  class="flex flex-col items-center justify-between rounded-lg border border-neutral-400 bg-white p-4 shadow-sm w-64"
>
  <div class="text-lg font-semibold text-neutral-800">F3AST {product.name}</div>
  <div class="text-2xl font-semibold">
    ${(subscriptionBasis === "monthly"
      ? product.prices.monthly
      : product.prices.yearly
    ).toFixed(2)} AUD
  </div>
  <div
    class="my-4 flex flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-3 shadow-sm"
  >
    {#each product.features as feature}
      <div class="flex items-center gap-3">
        <Icon icon="mingcute:check-fill" class="h-5 w-5 text-emerald-300" />
        <span class="text-neutral-600">{feature}</span>
      </div>
    {/each}
  </div>
  <button class="btn-primary w-full" onclick={handleSelectPlan}
    >Select Plan</button
  >
</div>
