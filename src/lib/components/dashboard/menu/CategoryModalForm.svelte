<script lang="ts">
  // import type { MenuCategory } from "@prisma/client";

  interface Props {
    currentCategory: any | null;
    isSaving: boolean;
    handleUpdateCategory?: (id: number, formData: FormData) => Promise<void>;
    handleCreateCategory?: (formData: FormData) => Promise<void>;
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
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    if (currentCategory && handleUpdateCategory) {
      handleUpdateCategory(currentCategory.id, formData);
    } else if (handleCreateCategory) {
      handleCreateCategory(formData);
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
