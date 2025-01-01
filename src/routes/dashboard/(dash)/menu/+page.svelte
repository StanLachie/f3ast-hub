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

  async function handleCreateCategory(formData: FormData) {
    const name = formData.get("name") as string;

    if (!name) return;

    isSaving = true;

    try {
      const res = await fetch("/api/menu/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  async function handleUpdateCategory(id: number, formData: FormData) {
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

  async function handleCreateItem(formData: FormData) {
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const categoryId = formData.get("category") as string;
    const image = formData.get("image") as File;

    if (!name || !price || !categoryId) return;

    isSaving = true;

    try {
      // First create the item without the image
      const res = await fetch("/api/menu/item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          categoryId: parseInt(categoryId),
          description: formData.get("description"),
          sortingIndex: Date.now(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create item");

      const { item } = await res.json();

      // If we have an image, upload it
      if (image) {
        const imageFormData = new FormData();
        imageFormData.append("image", image);
        imageFormData.append("itemId", item.id.toString());

        const imageRes = await fetch("/api/menu/item/cover", {
          method: "POST",
          body: imageFormData,
        });

        if (!imageRes.ok) throw new Error("Failed to upload image");

        const { url } = await imageRes.json();
        item.img = url;

        // Update the item with the image URL
        const updateRes = await fetch("/api/menu/item", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: item.id,
            name: item.name,
            price: item.price,
            categoryId: item.categoryId,
            description: item.description,
            img: url,
          }),
        });

        if (!updateRes.ok) throw new Error("Failed to update item with image");
      }

      menuItems = [...menuItems, item];
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Failed to create item. Please try again.");
    } finally {
      isSaving = false;
    }
  }

  async function handleUpdateItem(id: number, formData: FormData) {
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const categoryId = formData.get("category") as string;
    const image = formData.get("image") as File;

    if (!name || !price || !categoryId) return;

    isSaving = true;

    try {
      // First update the item without the image
      const res = await fetch(`/api/menu/item`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name,
          price: parseFloat(price),
          categoryId: parseInt(categoryId),
          description: formData.get("description"),
        }),
      });

      if (!res.ok) throw new Error("Failed to update item");

      const { item } = await res.json();

      // If we have a new image, upload it
      if (image) {
        const imageFormData = new FormData();
        imageFormData.append("image", image);
        imageFormData.append("itemId", id.toString());

        const imageRes = await fetch("/api/menu/item/cover", {
          method: "POST",
          body: imageFormData,
        });

        if (!imageRes.ok) throw new Error("Failed to upload image");

        const { url } = await imageRes.json();
        item.img = url;

        // Update the item with the new image URL
        const updateRes = await fetch("/api/menu/item", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: item.id,
            name: item.name,
            price: item.price,
            categoryId: item.categoryId,
            description: item.description,
          }),
        });

        if (!updateRes.ok) throw new Error("Failed to update item with image");
      }

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
      currentCategory = categories.find((c) => c.id === id) ?? null;
      openModal = "categoryEdit";
    },
    deleteFunc: async (id) => {
      if (!confirm("Are you sure you want to delete this category?")) return;

      let category = categories.find((c) => c.id === id);

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
        currentItem = menuItems.find((i) => i.id === id) ?? null;
        openModal = "itemEdit";
      },
      deleteFunc: async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        let item = menuItems.find((i) => i.id === id);

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
    handleCreateCategory={(formData: FormData) =>
      handleCreateCategory(formData)}
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
    handleUpdateCategory={(id: number, formData: FormData) =>
      handleUpdateCategory(id, formData)}
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
    handleCreateItem={(formData: FormData) => handleCreateItem(formData)}
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
    handleUpdateItem={(id: number, formData: FormData) =>
      handleUpdateItem(id, formData)}
  />
</Modal>
