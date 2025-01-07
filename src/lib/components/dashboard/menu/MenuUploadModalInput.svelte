<script lang="ts">
  import Icon from "@iconify/svelte";

  interface MenuItem {
    name: string;
    price: number;
  }

  interface MenuCategory {
    name: string;
    existingId: number | null;
    items: MenuItem[];
  }

  interface MenuData {
    categories: MenuCategory[];
  }

  export let handleUpload: (data: MenuData) => Promise<void>;
  export let prompt: string;

  let file: File | null = null;
  let generating = false;
  let editing = false;
  let data: MenuData | null = null;

  const LOADING_STEPS = [
    { message: "Reading your menu...", duration: 2000 },
    { message: "Analyzing menu structure...", duration: 3000 },
    { message: "Identifying categories...", duration: 3000 },
    { message: "Extracting menu items...", duration: 4000 },
    { message: "Processing prices...", duration: 3000 },
    { message: "Finalizing menu data...", duration: 2000 },
  ] as const;

  let currentStep = 0;
  let progress = 0;

  async function simulateProgress() {
    let totalDuration = LOADING_STEPS.reduce(
      (acc, step) => acc + step.duration,
      0
    );
    let elapsedTime = 0;

    for (let i = 0; i < LOADING_STEPS.length; i++) {
      currentStep = i;
      const step = LOADING_STEPS[i];
      const startProgress = (elapsedTime / totalDuration) * 100;
      const endProgress = ((elapsedTime + step.duration) / totalDuration) * 100;

      const startTime = performance.now();
      while (performance.now() - startTime < step.duration) {
        const timeElapsed = performance.now() - startTime;
        const stepProgress =
          startProgress +
          (endProgress - startProgress) * (timeElapsed / step.duration);
        progress = stepProgress;
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      elapsedTime += step.duration;
    }
    progress = 100;
  }

  async function handleOpenAiUpload() {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    generating = true;
    currentStep = 0;

    try {
      const base64String = await readFileAsBase64(file);
      const progressPromise = simulateProgress();

      const response = await fetch("/api/menu/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ base64Image: base64String, prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      data = JSON.parse(result.message.content);

      await finishLoadingSteps();

      generating = false;
      editing = true;
    } catch (error) {
      console.error("Failed to process menu:", error);
      alert("Failed to process menu. Please try again.");
      generating = false;
    }
  }

  async function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function finishLoadingSteps() {
    if (currentStep < LOADING_STEPS.length - 1) {
      for (let i = currentStep; i < LOADING_STEPS.length; i++) {
        currentStep = i;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }

  function handlePriceChange(
    categoryIndex: number,
    itemIndex: number,
    event: Event & { currentTarget: HTMLInputElement }
  ) {
    if (!data) return;

    const value = parseFloat(event.currentTarget.value);
    data.categories[categoryIndex].items[itemIndex].price = isNaN(value)
      ? 0
      : value;
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

  $: isSubmitDisabled =
    data?.categories.length === 0 ||
    data?.categories.some(
      (category) =>
        category.items.length === 0 ||
        category.items.some((item) => !item.price || item.price <= 0)
    );
</script>

<div class="flex flex-col gap-6">
  {#if !editing}
    <div class="flex flex-col gap-4">
      <div
        class="flex flex-col items-center justify-center h-[200px] rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 p-8"
        role="region"
        aria-label={generating ? "Processing menu" : "File upload area"}
      >
        {#if !generating}
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
        {:else}
          <div class="flex flex-col items-center justify-center w-full gap-4">
            <div class="text-center">
              <div class="mb-2 text-4xl text-neutral-400 animate-pulse">⚙️</div>
              <div class="mb-1 font-medium text-neutral-700">
                {LOADING_STEPS[currentStep].message}
              </div>
              <div class="text-sm text-neutral-500">
                This may take upto a minute.
              </div>
            </div>
            <div class="w-full max-w-md">
              <div
                class="h-2 w-full overflow-hidden rounded-full bg-neutral-200"
              >
                <div
                  class="h-full bg-emerald-500 transition-all duration-700"
                  style="width: {((currentStep + 1) / LOADING_STEPS.length) *
                    100}%"
                ></div>
              </div>
            </div>
          </div>
        {/if}
      </div>

      <button
        class="btn-primary w-full"
        on:click={handleOpenAiUpload}
        disabled={generating || !file}
        aria-busy={generating}
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

      <div class="rounded-lg bg-amber-50 p-3">
        <div>
          <p class="text-sm text-amber-700">
            <span class="font-medium">Please review carefully.</span> The AI doesn't
            check for existing menu items, so duplicates may occur.
          </p>
        </div>
      </div>

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
          disabled={isSubmitDisabled}
        >
          Save Menu Items
        </button>
      </div>
    </div>
  {/if}
</div>
