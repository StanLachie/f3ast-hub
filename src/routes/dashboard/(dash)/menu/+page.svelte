<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  // import type { MenuItem, MenuCategory } from "@prisma/client";

  import SettingHead from "$lib/components/dashboard/SettingHead.svelte";
  import SettingList from "$lib/components/dashboard/SettingList.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import ItemModalForm from "$lib/components/dashboard/menu/ItemModalForm.svelte";
  import Icon from "@iconify/svelte";
  import CategoryModalForm from "$lib/components/dashboard/menu/CategoryModalForm.svelte";

  export let data: PageData;

  let currentCategory: any | null = null;
  let currentItem: any | null = null;
  let categories: any[] = [];
  let menuItems: any[] = [];
  let previewImage: string | null = null;

  let initialLoading = true;
  let isSaving = false;
  let isReordering = false;
  let openModal = "";

  const closeModal = () => {
    openModal = "";
    previewImage = null;
    currentCategory = null;
    currentItem = null;
  };

  onMount(async () => {
    categories = (await data.pageData).categories.sort(
      (a, b) => a.sortingIndex - b.sortingIndex
    );
    menuItems = (await data.pageData).menuItems.sort(
      (a, b) => a.sortingIndex - b.sortingIndex
    );

    initialLoading = false;
  });

  async function handleCreateCategory(event: SubmitEvent) {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;

    if (!name) return;

    isSaving = true;

    try {
      const res = await fetch("/api/menu/category", {
        method: "POST",
        body: JSON.stringify({
          name,
          description: formData.get("description"),
          sortingIndex: Date.now(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create category");

      const { category } = await res.json();
      categories = [...categories, category];
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Failed to create category. Please try again.");
    } finally {
      isSaving = false;
    }
  }

  async function handleUpdateCategory(id: number, event: SubmitEvent) {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;

    if (!name) return;

    isSaving = true;

    try {
      const res = await fetch(`/api/menu/category`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          description: formData.get("description"),
        }),
      });

      if (!res.ok) throw new Error("Failed to update category");

      const { category } = await res.json();
      categories = categories.map((c) => (c.id === id ? category : c));
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Failed to update category. Please try again.");
    } finally {
      isSaving = false;
    }
  }

  async function handleCreateItem(event: SubmitEvent) {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const categoryId = formData.get("category") as string;

    if (!name || !price || !categoryId) return;

    isSaving = true;

    try {
      const res = await fetch("/api/menu/item", {
        method: "POST",
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          categoryId: parseInt(categoryId),
          description: formData.get("description"),
          img: previewImage,
          sortingIndex: Date.now(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create item");

      const { item } = await res.json();
      menuItems = [...menuItems, item];
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Failed to create item. Please try again.");
    } finally {
      isSaving = false;
    }
  }

  async function handleUpdateItem(id: number, event: SubmitEvent) {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const categoryId = formData.get("category") as string;

    if (!name || !price || !categoryId) return;

    isSaving = true;

    try {
      const res = await fetch(`/api/menu/item`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          price: parseFloat(price),
          categoryId: parseInt(categoryId),
          description: formData.get("description"),
          img: previewImage,
        }),
      });

      if (!res.ok) throw new Error("Failed to update item");

      const { item } = await res.json();
      menuItems = menuItems.map((i) => (i.id === id ? item : i));
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Failed to update item. Please try again.");
    } finally {
      isSaving = false;
    }
  }
</script>

{#if isReordering}
  <div
    in:fly={{ x: 100, duration: 200, easing: quintOut }}
    out:fly={{ x: 100, duration: 200, easing: quintOut }}
    class="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg border border-neutral-400 bg-white px-3 py-2 shadow-sm"
  >
    <Icon
      icon="mingcute:loading-3-fill"
      class="h-5 w-5 animate-spin text-emerald-500"
    />
    <span class="font-semibold">Updating order...</span>
  </div>
{/if}

<SettingHead title="Your Menu" description="Make changes to your menu here." />

<SettingList
  title="Categories"
  description="Create & edit categories for your restaurant's menu."
  loading={initialLoading}
  action={{
    name: "Create Category",
    type: "primary",
    createFunc: () => {
      openModal = "categoryCreate";
    },
    editFunc: async (id) => {
      console.log(categories);
      currentCategory = categories.find((c) => c.sortingIndex === id) ?? null;
      openModal = "categoryEdit";
    },
    deleteFunc: async (id) => {
      if (!confirm("Are you sure you want to delete this category?")) return;

      let category = categories.find((c) => c.sortingIndex === id);

      if (!category) return;

      const res = await fetch(`/api/menu/category`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: category?.id }),
      });

      if (res.ok) {
        categories = categories.filter((c) => c.id !== category.id);
      } else {
        alert("Failed to delete category");
      }
    },
  }}
  reorderUrl="/api/menu/category/reorder"
  listItems={categories}
/>

{#if categories.length > 0}
  <SettingList
    title="Items"
    description="Create & edit menu items for your restaurant."
    loading={initialLoading}
    action={{
      name: "Create Item",
      type: "primary",
      createFunc: () => {
        openModal = "itemCreate";
      },
      editFunc: async (id) => {
        currentItem = menuItems.find((i) => i.sortingIndex === id) ?? null;
        openModal = "itemEdit";
      },
      deleteFunc: async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        let item = menuItems.find((i) => i.sortingIndex === id);

        if (!item) return;

        const res = await fetch("/api/menu/item", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: item?.id }),
        });

        if (res.ok) {
          menuItems = menuItems.filter((i) => i.id !== item?.id);
        } else {
          alert("Failed to delete item");
        }
      },
    }}
    reorderUrl="/api/menu/item/reorder"
    listItems={menuItems}
  />
{/if}

<Modal
  title="Create Category"
  showModal={openModal === "categoryCreate"}
  onClose={closeModal}
>
  <CategoryModalForm
    currentCategory={null}
    {isSaving}
    handleCreateCategory={(e: SubmitEvent) => handleCreateCategory(e)}
  />
</Modal>

<Modal
  title="Edit Category"
  showModal={openModal === "categoryEdit"}
  onClose={closeModal}
>
  <CategoryModalForm
    {currentCategory}
    {isSaving}
    handleUpdateCategory={(id: number, e: SubmitEvent) =>
      handleUpdateCategory(id, e)}
  />
</Modal>

<Modal
  title="Create Item"
  showModal={openModal === "itemCreate"}
  onClose={closeModal}
>
  <ItemModalForm
    currentItem={null}
    {categories}
    {isSaving}
    handleCreateItem={(e: SubmitEvent) => handleCreateItem(e)}
  />
</Modal>

<Modal
  title="Edit Item"
  showModal={openModal === "itemEdit"}
  onClose={closeModal}
>
  <ItemModalForm
    {currentItem}
    {categories}
    {isSaving}
    handleUpdateItem={(id: number, e: SubmitEvent) => handleUpdateItem(id, e)}
  />
</Modal>
