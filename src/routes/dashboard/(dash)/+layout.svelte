<script lang="ts">
  import Icon from "@iconify/svelte";
  import { page } from "$app/stores";
  import Meta from "$lib/components/utils/Meta.svelte";
  import { slide } from "svelte/transition";
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";

  let sidebarItems = [
    {
      name: "Restaurant Info",
      description: "Update your restaurant's details here.",
      type: "top",
      icon: "mingcute:chef-hat-fill",
      link: "/dashboard/restaurant",
    },
    {
      name: "Theming",
      description: "Customize your restaurant's theme here.",
      type: "top",
      icon: "mingcute:palette-fill",
      link: "/dashboard/theme",
    },
    {
      name: "Menu",
      description: "Make changes to your menu here.",
      type: "top",
      icon: "mdi:burger",
      link: "/dashboard/menu",
    },
    {
      name: "Billing",
      description: "Your billing",
      type: "top",
      icon: "mingcute:bank-card-fill",
      link: "/dashboard/billing",
    },
    {
      name: "Profile",
      description: "Your profile",
      type: "bottom",
      icon: "mingcute:user-3-fill",
      link: "/dashboard/profile",
    },
    {
      name: "Support",
      description:
        "Need help with your restaurant? Running into issues? We're here to help.",
      type: "bottom",
      icon: "mingcute:question-fill",
      link: "/dashboard/support",
    },
    {
      name: "Logout",
      description: "Logout",
      type: "bottom",
      icon: "mingcute:exit-line",
      action: async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              goto("/dashboard/login");
            },
          },
        });
      },
    },
  ];

  let expandSidebar = false;

  $: currentRoute = sidebarItems.find(
    (item) => item.link === $page.url.pathname
  );
</script>

<Meta title="Dashboard" description="Your dashboard" />

<div class=" max-w-screen flex min-h-screen">
  <div
    class={`fixed flex h-dvh ${expandSidebar ? "min-w-64" : "min-w-16"} z-40 flex-col justify-between border-r border-neutral-400 bg-white transition-all duration-300 ease-in-out`}
    role="contentinfo"
    on:pointerenter={() => {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      )
        return;
      expandSidebar = true;
    }}
    on:pointerleave={() => {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      )
        return;
      expandSidebar = false;
    }}
  >
    <div
      class="flex flex-col divide-y divide-neutral-400 border-b border-neutral-400"
    >
      <a
        href="/"
        class="flex h-16 items-center justify-center font-norwester text-xl"
      >
        F3AST
      </a>
      {#each sidebarItems as item}
        {#if item.type === "top"}
          {#if item.action}
            <button
              on:click={item.action}
              title={item.name}
              class={`group flex h-16 items-center justify-start text-2xl hover:bg-neutral-100`}
            >
              <Icon
                icon={item.icon}
                class={`mx-[19.5px] ${currentRoute?.link === item.link ? "scale-[120%] text-emerald-300" : ""} transition-all group-hover:scale-[125%]`}
              />

              {#if expandSidebar}
                <span
                  transition:slide={{ duration: 250, axis: "x" }}
                  class="flex-1 text-nowrap text-sm font-semibold"
                  >{item.name}</span
                >
              {/if}
            </button>
          {:else}
            <a
              data-sveltekit-preload-data
              href={item.link}
              title={item.name}
              class={`group flex h-16 items-center justify-start text-2xl hover:bg-neutral-100`}
            >
              <Icon
                icon={item.icon}
                class={`mx-[19.5px] ${currentRoute?.link === item.link ? "scale-[120%] text-emerald-300" : ""} transition-all group-hover:scale-[125%]`}
              />

              {#if expandSidebar}
                <span
                  transition:slide={{ duration: 250, axis: "x" }}
                  class="flex-1 text-nowrap text-sm font-semibold"
                  >{item.name}</span
                >
              {/if}
            </a>
          {/if}
        {/if}
      {/each}
    </div>
    <div
      class="flex flex-col divide-y divide-neutral-400 border-t border-neutral-400"
    >
      {#each sidebarItems as item}
        {#if item.type === "bottom"}
          {#if item.action}
            <button
              on:click={item.action}
              title={item.name}
              class={`group flex h-16 items-center justify-start text-2xl hover:bg-neutral-100 text-left`}
            >
              <Icon
                icon={item.icon}
                class={`mx-[19.5px] ${currentRoute?.link === item.link ? "scale-[120%] text-emerald-300" : ""} transition-all group-hover:scale-[125%]`}
              />

              {#if expandSidebar}
                <span
                  transition:slide={{ duration: 250, axis: "x" }}
                  class="flex-1 text-sm font-semibold">{item.name}</span
                >
              {/if}
            </button>
          {:else}
            <a
              data-sveltekit-preload-data
              href={item.link}
              title={item.name}
              class={`group flex h-16 items-center justify-start text-2xl hover:bg-neutral-100`}
            >
              <Icon
                icon={item.icon}
                class={`mx-[19.5px] ${currentRoute?.link === item.link ? "scale-[120%] text-emerald-300" : ""} transition-all group-hover:scale-[125%]`}
              />

              {#if expandSidebar}
                <span
                  transition:slide={{ duration: 250, axis: "x" }}
                  class="flex-1 text-sm font-semibold">{item.name}</span
                >
              {/if}
            </a>
          {/if}
        {/if}
      {/each}
    </div>
  </div>

  <div class="ml-16 flex-grow bg-neutral-100 p-2 sm:p-8 md:p-16">
    <div class="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <Meta
        title={currentRoute?.name + " | Dashboard"}
        description={currentRoute?.description || ""}
      />
      <slot />
    </div>
  </div>
</div>
