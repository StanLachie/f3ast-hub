<script lang="ts">
  import Icon from "@iconify/svelte";
  import SettingSkeleton from "./SettingSkeleton.svelte";
  import { slide } from "svelte/transition";

  export let title: string;
  export let description: string;
  export let loading: boolean = false;
  export let initialValue: string;
  export let input: {
    name: string;
    type: string;
    value: string;
    placeholder: string;
    submitUrl: string;
  };

  let updating = false;

  let saveChanges = async () => {
    if (!input.submitUrl) return;

    updating = true;

    const response = await fetch(input.submitUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: input.value }),
    });

    if (!response.ok) {
      const error = await response.json();
      updating = false;
      alert(error.error || "Failed to save changes");
      return;
    }

    initialValue = input.value;

    updating = false;
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
    <div class="flex flex-1 gap-2">
      <input
        class="input flex-1 p-3"
        bind:value={input.value}
        placeholder={input.placeholder}
      />

      {#if input.value !== initialValue}
        <button
          class="btn-primary w-[50px]"
          on:click={saveChanges}
          disabled={input.value === initialValue}
          transition:slide={{ duration: 250, axis: "x" }}
        >
          <Icon
            icon={updating ? "mingcute:loading-3-fill" : "mingcute:save-2-fill"}
            class={updating ? "h-6 w-6 animate-spin" : "h-6 w-6"}
          />
        </button>
      {/if}
    </div>
  </div>
{:else}
  <SettingSkeleton />
{/if}
