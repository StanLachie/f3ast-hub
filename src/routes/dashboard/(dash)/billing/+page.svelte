<script lang="ts">
  import SettingHead from "$lib/components/dashboard/SettingHead.svelte";
  import SettingAction from "$lib/components/dashboard/SettingAction.svelte";
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import BillingInfo from "$lib/components/dashboard/BillingInfo.svelte";
  import SettingActions from "$lib/components/dashboard/SettingActions.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Icon from "@iconify/svelte";

  export let data: PageData;
  const { layoutData } = data;

  let initialLoading = true;
  let showSubscribeModal = false;
  let selectedTier: "Basic" | "Elite" | null = null;
  let selectedTerm: "monthly" | "yearly" = "monthly";

  let subscription = {
    status: "",
  };

  const prices = {
    Basic: {
      monthly: 29.99,
      yearly: 299.99,
      features: [
        "Unlimited Menu Items",
        "Unlimited Categories",
        "Unlimited Customers",
      ],
    },
    Elite: {
      monthly: 49.99,
      yearly: 499.99,
      features: [
        "Everything in Basic",
        "AI Menu Uploader",
        "Customer Enquiries",
      ],
    },
  };

  async function handleSubscribe() {
    if (!selectedTier) return;

    const res = await fetch(
      `/api/billing/subscriptions?subscriptionTier=${selectedTier}&term=${selectedTerm}`
    );
    const data = await res.json();

    if (!res.ok) {
      return alert(data.error);
    }

    window.location.href = data.url;
  }

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
        func: () => {
          selectedTier = "Basic";
          showSubscribeModal = true;
        },
      },
      {
        name: "Subscribe to Elite",
        type: "primary",
        func: () => {
          selectedTier = "Elite";
          showSubscribeModal = true;
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

<Modal
  showModal={showSubscribeModal}
  onClose={() => {
    showSubscribeModal = false;
    selectedTier = null;
  }}
  title="Choose Subscription Term"
>
  <div class="flex flex-col gap-6">
    <div class="text-center">
      <h3 class="text-2xl font-semibold">Subscribe to {selectedTier}</h3>
      <p class="text-neutral-600">Choose your billing cycle</p>
    </div>

    <div class="flex flex-col gap-4">
      <button
        class="flex items-center justify-between rounded-lg border-2 p-4 {selectedTerm ===
        'monthly'
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-neutral-300'}"
        on:click={() => (selectedTerm = "monthly")}
      >
        <div class="text-left">
          <div class="font-semibold">Monthly</div>
          <div class="text-sm text-neutral-600">Billed every month</div>
        </div>
        <div class="text-xl font-semibold">
          ${selectedTier ? prices[selectedTier].monthly : 0}/mo
        </div>
      </button>

      <button
        class="flex items-center justify-between rounded-lg border-2 p-4 {selectedTerm ===
        'yearly'
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-neutral-300'}"
        on:click={() => (selectedTerm = "yearly")}
      >
        <div class="text-left">
          <div class="font-semibold">Yearly</div>
          <div class="text-sm text-neutral-600">
            Billed annually (save ~16%)
          </div>
        </div>
        <div class="text-xl font-semibold">
          ${selectedTier ? prices[selectedTier].yearly : 0}/yr
        </div>
      </button>
    </div>

    {#if selectedTier === "Elite"}
      <div class="rounded-lg bg-emerald-50 p-3">
        <p class="text-sm text-emerald-700">
          <span class="font-medium">Great choice!</span> You'll get access to all
          of our premium features.
        </p>
      </div>
    {:else if selectedTier === "Basic"}
      <div class="rounded-lg bg-emerald-50 p-3">
        <p class="text-sm text-emerald-700">
          <span class="font-medium">Upgrade to Elite</span> to unlock AI Menu Uploader
          and Customer Enquiries, the perfect tool for growing business!
        </p>
      </div>
    {/if}
    <div class="flex flex-col gap-3">
      <div class="rounded-lg border border-neutral-200">
        <table class="w-full">
          <tbody class="divide-y divide-neutral-200">
            <tr>
              <td class="px-4 py-2 text-sm text-neutral-600"
                >Unlimited Menu Items</td
              >
              <td class="w-20 px-4 py-2 text-center">
                <Icon
                  icon="mingcute:check-fill"
                  class="inline h-4 w-4 text-emerald-500"
                />
              </td>
              <td class="w-20 px-4 py-2 text-center">
                <Icon
                  icon="mingcute:check-fill"
                  class="inline h-4 w-4 text-emerald-500"
                />
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 text-sm text-neutral-600"
                >Unlimited Categories</td
              >
              <td class="w-20 px-4 py-2 text-center">
                <Icon
                  icon="mingcute:check-fill"
                  class="inline h-4 w-4 text-emerald-500"
                />
              </td>
              <td class="w-20 px-4 py-2 text-center">
                <Icon
                  icon="mingcute:check-fill"
                  class="inline h-4 w-4 text-emerald-500"
                />
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 text-sm text-neutral-600"
                >Unlimited Customers</td
              >
              <td class="w-20 px-4 py-2 text-center">
                <Icon
                  icon="mingcute:check-fill"
                  class="inline h-4 w-4 text-emerald-500"
                />
              </td>
              <td class="w-20 px-4 py-2 text-center">
                <Icon
                  icon="mingcute:check-fill"
                  class="inline h-4 w-4 text-emerald-500"
                />
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 text-sm text-neutral-600"
                >AI Menu Uploader</td
              >
              <td class="w-20 px-4 py-2 text-center">
                <Icon
                  icon="mingcute:close-fill"
                  class="inline h-4 w-4 text-neutral-300"
                />
              </td>
              <td class="w-20 px-4 py-2 text-center">
                <Icon
                  icon="mingcute:check-fill"
                  class="inline h-4 w-4 text-emerald-500"
                />
              </td>
            </tr>
            <tr>
              <td class="px-4 py-2 text-sm text-neutral-600"
                >Customer Enquiries</td
              >
              <td class="w-20 px-4 py-2 text-center">
                <Icon
                  icon="mingcute:close-fill"
                  class="inline h-4 w-4 text-neutral-300"
                />
              </td>
              <td class="w-20 px-4 py-2 text-center">
                <Icon
                  icon="mingcute:check-fill"
                  class="inline h-4 w-4 text-emerald-500"
                />
              </td>
            </tr>
          </tbody>
          <thead>
            <tr class="border-b border-neutral-200 bg-neutral-50">
              <th
                class="px-4 py-2 text-left text-sm font-medium text-neutral-600"
                >Features</th
              >
              <th
                class="w-20 px-4 py-2 text-center text-sm font-medium text-neutral-600"
                >Basic</th
              >
              <th
                class="w-20 px-4 py-2 text-center text-sm font-medium text-neutral-600"
                >Elite</th
              >
            </tr>
          </thead>
        </table>
      </div>

      {#if selectedTier === "Basic"}
        <button
          class="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          on:click={() => (selectedTier = "Elite")}
        >
          Switch to Elite tier →
        </button>
      {/if}
    </div>

    <button class="btn-primary" on:click={handleSubscribe}>
      Continue to Checkout
    </button>
  </div>
</Modal>
