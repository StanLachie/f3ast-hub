<script lang="ts">
  import Icon from "@iconify/svelte";

  export let isUploadingImage = false;
  export let imageToDisplay: string | null = null;
  export let initials: string = "";
  export let handleFileChange: (event: Event) => void;
</script>

<div class="flex items-center justify-center">
  {#if isUploadingImage}
    <div
      class="flex aspect-square w-full animate-pulse items-center justify-center rounded-xl bg-neutral-200"
    >
      <Icon
        icon="mingcute:loading-3-fill"
        class="h-32 w-32 animate-spin text-emerald-500"
      />
    </div>
  {:else}
    <div class="group relative w-full">
      {#if imageToDisplay}
        <img
          src={imageToDisplay}
          alt=""
          class="aspect-square w-full rounded-xl border border-neutral-400 object-cover"
        />
      {:else}
        <div
          class="flex aspect-square w-full items-center justify-center rounded-xl border border-neutral-400 bg-neutral-200 text-7xl font-bold"
        >
          {initials}
        </div>
      {/if}

      <label for="img" class="absolute inset-0 cursor-pointer">
        <div
          class="flex h-full w-full items-center justify-center rounded-xl bg-neutral-800 opacity-0 transition-opacity duration-500 group-hover:opacity-80"
        >
          <Icon
            icon="mingcute:edit-2-fill"
            class="h-1/3 w-1/3 text-emerald-500"
          />
        </div>
      </label>
      <input
        id="img"
        type="file"
        accept="image/*"
        on:change={handleFileChange}
        class="hidden"
      />
    </div>
  {/if}
</div>
