<script lang="ts">
  import type { MenuCategory } from "@prisma/client";

  interface Props {
    currentCategory: MenuCategory | null;
    isSaving: boolean;
    handleUpdateCategory?: (id: number, e: SubmitEvent) => Promise<void>;
    handleCreateCategory?: (e: SubmitEvent) => Promise<void>;
  }

  let {
    currentCategory,
    isSaving,
    handleUpdateCategory,
    handleCreateCategory,
  }: Props = $props();

  let formData = $state(
    currentCategory ?? {
      name: "",
      description: "",
    }
  );
</script>

<form
  class="flex flex-col gap-3"
  onsubmit={(event) => {
    event.preventDefault();
    if (currentCategory && handleUpdateCategory) {
      handleUpdateCategory(currentCategory.id, event);
    } else if (handleCreateCategory) {
      handleCreateCategory(event);
    }
  }}
>
  <input
    name="name"
    type="text"
    class="input"
    placeholder="Name"
    required
    bind:value={formData.name}
  />
  <textarea
    name="description"
    class="input"
    placeholder="Description"
    bind:value={formData.description}
  ></textarea>
  <button type="submit" disabled={isSaving} class="btn-primary">
    {isSaving
      ? currentCategory
        ? "Updating..."
        : "Creating..."
      : currentCategory
        ? "Update"
        : "Create"}
  </button>
</form>
