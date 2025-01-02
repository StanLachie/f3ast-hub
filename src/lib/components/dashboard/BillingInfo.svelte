<script lang="ts">
  import type { Subscription } from "@prisma/client";
  import SettingSkeleton from "./SettingSkeleton.svelte";

  export let subscription: Subscription | null;
  export let loading: boolean = false;
</script>

{#if !loading}
  <div
    class="flex w-full flex-col divide-y divide-neutral-400 md:divide-y-0 md:divide-x rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
  >
    <div class="flex-1 text-center">
      <h2 class="text-lg font-semibold">Plan</h2>
      <p class="text-neutral-600">
        {subscription?.tier || "Free"}
      </p>
    </div>
    <div class="flex-1 text-center">
      <h2 class="text-lg font-semibold">Status</h2>
      <p class="text-neutral-600">
        {subscription?.status || "Inactive"}
      </p>
    </div>
    <div class="flex-1 text-center">
      <h2 class="text-lg font-semibold">Next Billing Date</h2>
      <p class="text-neutral-600">
        {subscription?.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
          : "N/A"}
      </p>
    </div>
  </div>
{:else}
  <SettingSkeleton />
{/if}
