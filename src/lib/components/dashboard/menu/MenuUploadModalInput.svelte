<script lang="ts">
  import Icon from "@iconify/svelte";

  export let handleUpload: (data: {
    categories: {
      name: string;
      existingId: number | null;
      items: { name: string; price: number }[];
    }[];
  }) => Promise<void>;
  let file: File | null = null;
  let generating = false;
  let editing = false;
  let data: {
    categories: {
      name: string;
      existingId: number | null;
      items: { name: string; price: number }[];
    }[];
  } | null = null;
  export let prompt: string;

  async function handleOpenAiUpload() {
    generating = true;
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result as string;
      const response = await fetch("/api/menu/ai", {
        method: "POST",
        body: JSON.stringify({ base64Image: base64String, prompt }),
      });
      const result = await response.json();
      data = JSON.parse(result.message.content);
      generating = false;
      editing = true;
    };
    reader.readAsDataURL(file);
  }

  function handlePriceChange(
    categoryIndex: number,
    itemIndex: number,
    event: Event
  ) {
    const value = (event.target as HTMLInputElement).value;
    if (data) {
      data.categories[categoryIndex]!.items[itemIndex]!.price =
        parseFloat(value) || 0;
    }
  }

  function handleNameChange(
    categoryIndex: number,
    itemIndex: number,
    event: Event
  ) {
    const value = (event.target as HTMLInputElement).value;
    if (data) {
      data.categories[categoryIndex]!.items[itemIndex]!.name = value;
    }
  }

  function handleRemoveItem(categoryIndex: number, itemIndex: number) {
    if (data) {
      data.categories[categoryIndex]?.items.splice(itemIndex, 1);
      if (data.categories[categoryIndex]?.items.length === 0) {
        data.categories.splice(categoryIndex, 1);
      }
      data = data;
    }
  }

  async function handleSubmit() {
    if (data) {
      await handleUpload(data);
      editing = false;
      data = null;
    }
  }
</script>

<div class="flex flex-col gap-6">
  {#if !editing}
    <div class="flex flex-col gap-4">
      <div
        class="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-8"
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          class="hidden"
          id="file-upload"
          on:change={(e) =>
            (file = (e.target as HTMLInputElement).files?.[0] || null)}
        />
        <label for="file-upload" class="cursor-pointer text-center">
          <div class="mb-2 text-4xl text-neutral-400">📄</div>
          <div class="mb-1 font-medium text-neutral-700">
            {file ? file.name : "Drop your menu file here"}
          </div>
          <div class="text-sm text-neutral-500">
            or <span class="text-emerald-600">browse</span> to choose a file
          </div>
        </label>
      </div>

      <button
        class="btn-primary w-full"
        on:click={handleOpenAiUpload}
        disabled={generating || !file}
      >
        {generating ? "Processing..." : "Upload and Process"}
      </button>
    </div>
  {/if}

  {#if data && editing}
    <div class="space-y-4">
      <h1 class="text-3xl font-semibold text-neutral-800 text-center">
        Review your menu items
      </h1>
      <div class="max-h-[500px] overflow-y-auto space-y-4">
        {#each data.categories as category, categoryIndex}
          <div
            class="rounded-lg border border-neutral-400 bg-white p-4 shadow-sm"
          >
            <h3 class="mb-4 text-lg font-medium text-neutral-800">
              {category.name}
            </h3>
            <div class="space-y-3">
              {#each category.items as item, itemIndex}
                <div class="flex items-center gap-4">
                  <input
                    type="text"
                    class="input flex-1"
                    value={item.name}
                    placeholder="Item name"
                    on:input={(e) =>
                      handleNameChange(categoryIndex, itemIndex, e)}
                  />
                  <input
                    type="number"
                    class="input w-28"
                    step="0.01"
                    min="0"
                    placeholder="Price"
                    value={item.price}
                    on:input={(e) =>
                      handlePriceChange(categoryIndex, itemIndex, e)}
                  />
                  <button
                    class="btn-danger flex h-[42px] w-[42px] justify-center !p-2"
                    on:click={() => {
                      handleRemoveItem(categoryIndex, itemIndex);
                    }}
                  >
                    <Icon icon="mingcute:delete-2-fill" class="h-5 w-5" />
                  </button>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button
          class="btn-outline"
          on:click={() => {
            editing = false;
            data = null;
          }}
        >
          Cancel
        </button>
        <button
          class="btn-primary"
          on:click={handleSubmit}
          disabled={data.categories.length === 0 ||
            data.categories.some((category) => category.items.length === 0) ||
            data.categories.some((category) =>
              category.items.some((item) => !item.price || item.price <= 0)
            )}
        >
          Save Menu Items
        </button>
      </div>
    </div>
  {/if}
</div>
