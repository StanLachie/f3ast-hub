<script lang="ts">
  import Icon from "@iconify/svelte";
  import SettingSkeleton from "./SettingSkeleton.svelte";

  export let title: string;
  export let description: string;
  export let loading: boolean = false;
  export let action: {
    name: string;
    icon?: string;
    type: "primary" | "danger";
    href?: string;
    func?: () => void;
  };
</script>

{#if !loading}
  <div
    class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
  >
    <div class="flex-1">
      <h2 class="text-lg font-semibold">{title}</h2>
      <p class="text-neutral-600">{description}</p>
    </div>
    {#if action.href}
      <a
        class="btn-primary"
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {action.name}
      </a>
    {:else if action.func}
      <button class={`btn-${action.type}`} on:click={action.func}>
        {#if action.icon}
          <Icon icon={action.icon} class="h-5 w-5" />
        {/if}
        {action.name}
      </button>
    {/if}
  </div>
{:else}
  <SettingSkeleton />
{/if}
