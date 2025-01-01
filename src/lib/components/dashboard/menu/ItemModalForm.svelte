<script lang="ts">
  import Icon from "@iconify/svelte";
  import ImageSelector from "../ImageSelector.svelte";
  // import type { MenuCategory, MenuItem } from "@prisma/client";

  interface Props {
    currentItem: any | null;
    categories: any[];
    handleUpdateItem?: (id: number, formData: FormData) => Promise<void>;
    handleCreateItem?: (formData: FormData) => Promise<void>;
    isSaving: boolean;
  }

  let {
    currentItem,
    categories,
    handleUpdateItem,
    handleCreateItem,
    isSaving,
  }: Props = $props();

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
  let imageFile: File | null = $state(null);

  $effect(() => {
    // Initialize image display from current item if editing
    if (currentItem?.img) {
      imageToDisplay = previewImage || currentItem.img;
    } else {
      imageToDisplay = previewImage || formData.img;
    }

    initials = formData.name
      .split(" ")
      .map((word: string) => word[0])
      .join("");
  });

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Store the file for later upload
    imageFile = file;

    // Create a temporary preview URL
    previewImage = URL.createObjectURL(file);
  }
</script>

<form
  class="flex flex-col gap-3"
  onsubmit={(event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Append the image file if we have one
    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (currentItem && handleUpdateItem) {
      handleUpdateItem(currentItem.id, formData);
    } else if (handleCreateItem) {
      handleCreateItem(formData);
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

  <ImageSelector
    {isUploadingImage}
    {previewImage}
    {handleFileChange}
    {imageToDisplay}
    {initials}
  />

  <input name="img" type="hidden" value={imageToDisplay ?? ""} />

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
