<script lang="ts">
  import PricingCard from "$lib/components/landing/PricingCard.svelte";
  import HeadlessNav from "$lib/components/HeadlessNav.svelte";
  import Meta from "$lib/components/utils/Meta.svelte";
  import type { PageData } from "./$types";
  import type { Product } from "$lib/types";

  let { data }: { data: PageData } = $props();

  const products: Product[] = [
    {
      name: "Basic",
      icon: {
        name: "fa6-solid:seedling",
        color: "text-emerald-300",
      },
      prices: {
        monthly: 29.99,
        yearly: 299.99,
      },
      description: "Basic plan for small businesses",
      features: [
        "Unlimited Menu Items",
        "Unlimited Categories",
        "Unlimited Customers",
      ],
    },
    {
      name: "Elite",
      icon: {
        name: "mingcute:tree-4-fill",
        color: "text-emerald-300",
      },
      prices: {
        monthly: 49.99,
        yearly: 499.99,
      },
      description: "Pro plan for medium businesses",
      features: [
        "Everything in Basic",
        "AI Menu Uploader",
        "Customer Enquiries",
      ],
    },
  ];

  let subscriptionBasis = $state<"monthly" | "yearly">("monthly");
</script>

<Meta
  title="Pricing"
  description="Select the plan that best fits your business needs and get started today."
/>

<div
  class="flex min-h-screen w-full flex-col items-center justify-center bg-neutral-100 px-4 py-16 sm:py-24 md:px-8 lg:px-16"
>
  <div class="mx-auto max-w-4xl">
    <div
      class="flex h-full flex-col items-center justify-center gap-4 text-center"
    >
      <h1 class="text-4xl font-semibold">Select a plan</h1>
      <p class="text-neutral-600">
        Select the plan that best fits your business needs and get started
        today.
      </p>
    </div>
    <div class="my-8 flex w-full flex-col items-center justify-center gap-4">
      <div
        class=" grid w-fit grid-cols-2 divide-x divide-emerald-950 rounded-lg border border-emerald-950"
      >
        <button
          class={`${subscriptionBasis === "monthly" ? "bg-emerald-300" : "bg-white"} w-24 place-self-end rounded-l-lg px-4 py-1 font-semibold shadow-sm transition-colors duration-200`}
          onclick={() => {
            subscriptionBasis = "monthly";
          }}
        >
          Monthly
        </button>
        <button
          class={`${subscriptionBasis === "yearly" ? "bg-emerald-300" : "bg-white"} w-24 rounded-r-lg px-4 py-1 font-semibold shadow-sm transition-colors duration-200`}
          onclick={() => {
            subscriptionBasis = "yearly";
          }}
        >
          Yearly
        </button>
      </div>
    </div>

    <div class=" flex w-full flex-wrap justify-around gap-4">
      {#each products as product}
        <PricingCard
          {product}
          {subscriptionBasis}
          isLoggedIn={data.isLoggedIn}
        />
      {/each}
    </div>

    <div class="my-8 flex flex-col items-center justify-center gap-4">
      <p class=" text-neutral-600 drop-shadow-md">
        Want to see a demo first? <a
          class="font-semibold text-emerald-300"
          href="/contact">Contact us</a
        >
      </p>
    </div>
  </div>
</div>

<HeadlessNav contact />
