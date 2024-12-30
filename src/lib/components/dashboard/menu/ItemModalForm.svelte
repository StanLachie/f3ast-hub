<script lang="ts">
  import Icon from "@iconify/svelte";
  // import type { MenuCategory, MenuItem } from "@prisma/client";

  interface Props {
    currentItem: any | null;
    categories: any[];
    handleUpdateItem?: (id: number, e: SubmitEvent) => Promise<void>;
    handleCreateItem?: (e: SubmitEvent) => Promise<void>;
    isSaving: boolean;
  }

  let {
    currentItem,
    categories,
    handleUpdateItem,
    handleCreateItem,
    isSaving,
  }: Props = $props();

  // export let handleFileChange: (e: Event) => Promise<void>;

  let formData = $state(
    currentItem ?? {
      name: "",
      price: 0,
      categoryId: categories[0]?.id,
      description: "",
      img: "",
    }
  );

  let isUploadingImage = false;
  let previewImage: string | null = $state(null);
  let imageToDisplay: string | null = $state(null);
  let initials: string = $state("");

  $effect(() => {
    imageToDisplay = previewImage || formData.img;
    initials = formData.name
      .split(" ")
      .map((word: string) => word[0])
      .join("");
  });
</script>

<form
  class="flex flex-col gap-3"
  onsubmit={(event) => {
    event.preventDefault();
    if (currentItem && handleUpdateItem) {
      handleUpdateItem(currentItem.id, event);
    } else if (handleCreateItem) {
      handleCreateItem(event);
    }
  }}
>
  <input
    name="name"
    type="text"
    bind:value={formData.name}
    class="input"
    placeholder="Name"
    required
  />

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
            alt={currentItem?.name}
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
        <!-- <input
          id="img"
          type="file"
          accept="image/*"
          on:change={handleFileChange}
          class="hidden"
        /> -->
      </div>
    {/if}
  </div>

  <input name="img" type="hidden" value={currentItem?.img ?? ""} />

  <div class="flex items-center">
    <span
      class="rounded-l-lg border-y border-l border-neutral-400 px-4 py-2 font-semibold"
      >$</span
    >
    <input
      name="price"
      type="number"
      class="input rounded-l-none"
      placeholder="Price"
      bind:value={formData.price}
      step="0.01"
      min="0"
      required
    />
  </div>

  <select
    name="category"
    class="input cursor-pointer"
    bind:value={formData.categoryId}
    required
  >
    {#each categories as category (category.id)}
      <option value={category.id}>{category.name}</option>
    {/each}
  </select>

  <textarea
    name="description"
    class="input"
    bind:value={formData.description}
    placeholder="Description"
  ></textarea>

  <button type="submit" disabled={isSaving} class="btn-primary">
    {isSaving
      ? currentItem
        ? "Updating..."
        : "Creating..."
      : currentItem
        ? "Update"
        : "Create"}
  </button>
</form>
