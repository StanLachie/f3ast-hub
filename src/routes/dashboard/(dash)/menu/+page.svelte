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
  import SettingAction from "$lib/components/dashboard/SettingAction.svelte";
  import MenuUploadModalInput from "$lib/components/dashboard/menu/MenuUploadModalInput.svelte";

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

  async function handleAiUpload(data: {
    categories: {
      name: string;
      existingId: number | null;
      items: { name: string; price: number }[];
    }[];
  }) {
    console.log(data);

    try {
      await Promise.all(
        data.categories.map(async (category: any) => {
          let categoryId: number;

          if (category.existingId) {
            // Use existing category
            categoryId = category.existingId;
          } else {
            // Create new category
            const res = await fetch("/api/menu/category", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: category.name,
                description: "",
                sortingIndex: Date.now(),
              }),
            });
            const { category: uploadedCategory } = await res.json();
            categories = [...categories, uploadedCategory];
            categoryId = uploadedCategory.id;
          }

          // Upload items to category
          await Promise.all(
            category.items.map(async (item: any) => {
              const res = await fetch("/api/menu/item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: item.name,
                  price: item.price,
                  categoryId: categoryId,
                  description: "",
                  sortingIndex: Date.now(),
                }),
              });
              const { item: uploadedItem } = await res.json();
              menuItems = [...menuItems, uploadedItem];
            })
          );
        })
      );

      closeModal();
    } catch (error) {
      console.error("Error uploading menu:", error);
      alert("Failed to upload menu. Please try again.");
    }
  }

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

<SettingAction
  title="AI Menu Uploader"
  description="Upload an image of your menu and let the AI do the work!"
  action={{
    name: "Upload",
    icon: "mingcute:ai-fill",
    type: "primary",
    func: () => {
      if (data.layoutData.subscription?.tier !== "Elite") {
        alert("You must be subscribed to Elite to use this feature");
        return;
      }
      openModal = "aiUpload";
    },
  }}
/>
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
        menuItems = menuItems.filter((item) => item.categoryId !== category.id);
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
  title="AI Menu Uploader"
  showModal={openModal === "aiUpload"}
  onClose={closeModal}
>
  <MenuUploadModalInput
    prompt={`You are a menu parsing assistant. Your task is to extract menu categories and items from the provided image.
      Each category must have a name, and each item must include a name and price.
    
      Ensure the following:
      - Extracted data must be accurate and strictly formatted according to the given schema.
      - Group items logically under the most relevant category. Avoid overly broad or general grouping. For instance, items like sausage rolls should not automatically be grouped with pies unless they are explicitly part of the same category.
      - Create new categories when existing categories do not logically encompass the items, but only when truly necessary.
      - Prices must be numeric and accurately matched to their respective items. If a price is not visible, set it to 0.
      - Use the provided pre-existing categories: ${categories.map((c) => `${c.name} (ID: ${c.id})`).join(", ")}. Indicate their ID using the existingId property. For new categories, set existingId to null.
      - If an item does not fit into any of the pre-existing categories, group it under "Miscellaneous."
      - Adhere strictly to the schema to ensure consistency and accuracy.
      `}
    handleUpload={handleAiUpload}
  />
</Modal>

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
