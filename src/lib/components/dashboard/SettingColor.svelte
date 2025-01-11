<script lang="ts">
  import Icon from "@iconify/svelte";
  import SettingSkeleton from "./SettingSkeleton.svelte";
  import { slide } from "svelte/transition";

  let { title, description, loading, initialValue, input } = $props();

  let updating = $state(false);
  let color = $state(initialValue);
  let colorInput: HTMLInputElement | null = $state(null);
  let colorButton: HTMLButtonElement | null = $state(null);

  function isLightColor(hexColor: string) {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128;
  }

  function handleButtonClick() {
    if (colorInput) {
      colorInput.click();
    }
  }

  let saveChanges = async () => {
    if (!input.submitUrl) return;

    updating = true;

    const response = await fetch(input.submitUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: color }),
    });

    if (!response.ok) {
      const error = await response.json();
      updating = false;
      alert(error.error || "Failed to save changes");
      return;
    }

      initialValue = color;

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
    <div class="flex flex-1 justify-end items-center gap-2">
      <div class="relative">
        <button
          bind:this={colorButton}
          class="border border-neutral-400 p-2"
          style="background-color: {color}; border-radius: 6px; color: {isLightColor(
            color
          )
            ? 'black'
            : 'white'};"
          onclick={handleButtonClick}
        >
          {color}
        </button>

        <input
          class="hidden"
          bind:this={colorInput}
          type="color"
          bind:value={color}
        />
      </div>

      {#if color !== initialValue}
        <button
          class="btn-primary w-[50px]"
          onclick={saveChanges}
          disabled={color === initialValue}
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
