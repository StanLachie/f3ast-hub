<script lang="ts">
  import SettingHead from "$lib/components/dashboard/SettingHead.svelte";
  import SettingAction from "$lib/components/dashboard/SettingAction.svelte";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import BillingInfo from "$lib/components/dashboard/BillingInfo.svelte";
  import SettingActions from "$lib/components/dashboard/SettingActions.svelte";

  export let data: PageData;
  const { layoutData } = data;

  let initialLoading = true;

  let subscription = {
    status: "",
  };

  onMount(async () => {
    subscription.status = layoutData.subscription?.status ?? "";

    initialLoading = false;
  });
</script>

<SettingHead title="Billing" description="Update your billing details here." />

<BillingInfo subscription={layoutData.subscription} loading={initialLoading} />

{#if subscription.status !== "active"}
  <SettingActions
    title="Subscribe to F3AST"
    description="Subscribe to a plan to get started."
    loading={initialLoading}
    actions={[
      {
        name: "Subscribe to Basic",
        type: "outline",
        func: async () => {
          const res = await fetch(
            "/api/billing/subscriptions?subscriptionTier=Basic"
          );
          const data = await res.json();

          if (!res.ok) {
            return alert(data.error);
          }

          window.location.href = data.url;
        },
      },
      {
        name: "Subscribe to Elite",
        type: "primary",
        func: async () => {
          const res = await fetch(
            "/api/billing/subscriptions?subscriptionTier=Elite"
          );
          const data = await res.json();

          if (!res.ok) {
            return alert(data.error);
          }

          window.location.href = data.url;
        },
      },
    ]}
  />
{:else}
  <SettingAction
    title="Update Billing"
    description="Update your billing details here."
    loading={initialLoading}
    action={{
      name: "Update",
      type: "primary",
      func: async () => {
        const res = await fetch("/api/billing/subscriptions/active");
        const data = await res.json();

        if (!res.ok) {
          return alert(data.error);
        }

        window.open(data.url, "_blank");
      },
    }}
  />
{/if}
