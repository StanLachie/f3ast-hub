<script lang="ts">
  import Icon from "@iconify/svelte";
  import SettingSkeleton from "./SettingSkeleton.svelte";
  import { dndzone } from "svelte-dnd-action";
  import { flip } from "svelte/animate";

  export let title: string;
  export let description: string;
  export let loading: boolean = false;
  export let action: {
    name: string;
    type: "primary" | "danger";
    href?: string;
    createFunc?: () => void;
    editFunc?: (id: number) => Promise<void>;
    deleteFunc?: (id: number) => void;
  };
  export let reorderUrl: string;
  export let listItems: any[] = [];

  let dragDisabled = true;
  let reordering = false;
  let dropdownStates: Record<string, number | null> = {};

  // Initialize dropdownStates whenever listItems changes
  $: {
    Object.keys(groupedItems).forEach(categoryId => {
      if (!(categoryId in dropdownStates)) {
        dropdownStates[categoryId] = null;
      }
    });
  }

  const mapItemsForDisplay = (items: any[]) => {
    return items.map((item, index) => ({
      ...item,
      dbId: item.id,
      id: index,
      sortingIndex: index,
    }));
  };

  const mapItemsForApi = (items: any[]) => {
    return items.map((item) => ({
      ...item,
      id: item.dbId,
    }));
  };

  // Group items by categoryId
  $: groupedItems = listItems.reduce((acc, item) => {
    const categoryId = item.categoryId || "uncategorized";
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(item);
    return acc;
  }, {});

  $: mappedGroupedItems = Object.entries(groupedItems).reduce(
    (acc, [categoryId, items]) => {
      acc[categoryId] = mapItemsForDisplay(items as any[]);
      return acc;
    },
    {} as Record<string, any[]>
  );

  const handleConsider = (event: any, categoryId: string) => {
    mappedGroupedItems[categoryId] = event.detail.items;
  };

  const handleFinalize = async (event: any, categoryId: string) => {
    mappedGroupedItems[categoryId] = event.detail.items;

    if (reorderUrl) {
      reordering = true;

      await fetch(reorderUrl, {
        method: "PUT",
        body: JSON.stringify({
          items: mapItemsForApi(mappedGroupedItems[categoryId]),
        }),
      });

      reordering = false;
    }

    dragDisabled = true;
  };

  // Close dropdowns when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown-container')) {
      Object.keys(dropdownStates).forEach(key => {
        dropdownStates[key] = null;
      });
      dropdownStates = {...dropdownStates}; // Force reactivity
    }
  }

  const toggleDropdown = (categoryId: string, index: number, event: MouseEvent) => {
    event.stopPropagation(); // Prevent event from bubbling
    
    // Close all other category dropdowns and toggle current one
    Object.keys(dropdownStates).forEach(key => {
      if (key !== categoryId) {
        dropdownStates[key] = null;
      }
    });
    
    dropdownStates[categoryId] = dropdownStates[categoryId] === index ? null : index;
    dropdownStates = {...dropdownStates}; // Force reactivity

    // Position dropdown
    const button = event.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const isNearBottom = buttonRect.bottom > viewportHeight - 200;

    // Get dropdown element after state update
    setTimeout(() => {
      const dropdown = button.nextElementSibling as HTMLElement;
      if (dropdown && isNearBottom) {
        dropdown.style.bottom = "100%";
        dropdown.style.top = "auto";
      } else if (dropdown) {
        dropdown.style.top = "100%";
        dropdown.style.bottom = "auto";
      }
    }, 0);
  };

  const moveItem = async (
    fromIndex: number,
    toIndex: number,
    categoryId: string
  ) => {
    if (toIndex < 0 || toIndex >= mappedGroupedItems[categoryId].length) return;

    const newItems = [...mappedGroupedItems[categoryId]];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    mappedGroupedItems[categoryId] = newItems;

    if (reorderUrl) {
      reordering = true;
      await fetch(reorderUrl, {
        method: "PUT",
        body: JSON.stringify({
          items: mapItemsForApi(mappedGroupedItems[categoryId]),
        }),
      });
      reordering = false;
    }
  };
</script>

<svelte:window on:click={handleClickOutside} />

{#if !loading}
  <div
    class="flex w-full flex-col gap-4 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm"
  >
    <div
      class="flex flex-1 flex-col items-center gap-3 md:flex-row md:items-center"
    >
      <div class="w-full flex-1 md:w-auto">
        <h2 class="text-lg font-semibold">{title}</h2>
        <p class="text-neutral-600">{description}</p>
      </div>
      <button
        type="submit"
        class="btn-primary h-full w-full md:w-auto"
        on:click={action.createFunc}
      >
        {action.name}
      </button>
    </div>

    {#if listItems.length > 0}
      {#each Object.entries(mappedGroupedItems) as [categoryId, items], categoryIndex}
        {#if categoryIndex > 0}
          <hr class="border-t border-neutral-300 my-4" />
        {/if}

        <div
          class="flex flex-col gap-2"
          use:dndzone={{
            items,
            flipDurationMs: 100,
            dropTargetStyle: {},
            transformDraggedElement: (element) => {
              return element;
            },
            dropFromOthersDisabled: true,
            dragDisabled,
          }}
          on:consider={(e) => handleConsider(e, categoryId)}
          on:finalize={(e) => handleFinalize(e, categoryId)}
        >
          {#each items as item, index (item.id)}
            <div
              id={`${title}-item`}
              class="col-span-full flex items-center gap-2"
              animate:flip={{ duration: 100 }}
            >
              <button
                class="btn-outline h-[42px] w-[42px] bg-white !p-2 hidden sm:flex"
                on:mousedown={() => {
                  if (reordering) return;
                  dragDisabled = false;
                }}
                on:mouseup={() => {
                  if (reordering) return;
                  dragDisabled = true;
                }}
                on:touchstart={() => {
                  if (reordering) return;
                  dragDisabled = false;
                }}
                on:touchend={() => {
                  if (reordering) return;
                  dragDisabled = true;
                }}
              >
                <Icon icon="uil:draggabledots" class="h-5 w-5" />
              </button>
              <input class="input flex-1 bg-white" disabled value={item.name} />
              {#if item.price}
                <input
                  class="input w-[4.5rem] sm:w-24 bg-white"
                  disabled
                  value={`$${item.price}`}
                />
              {/if}
              <div class="relative dropdown-container">
                <button
                  class="btn-outline flex h-[42px] w-[42px] justify-center bg-white !p-2 sm:hidden"
                  on:click={(e) => toggleDropdown(categoryId, index, e)}
                >
                  <Icon icon="mingcute:more-2-fill" class="h-5 w-5" />
                </button>
                {#if dropdownStates[categoryId] === index}
                  <div
                    class="absolute z-50 right-0 mt-2 w-48 bg-white border border-neutral-400 rounded-lg shadow-lg"
                  >
                    {#if index > 0}
                      <button
                        class="w-full flex items-center justify-between gap-2 text-left px-4 py-2 hover:bg-neutral-100 sm:hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        on:click={() => {
                          moveItem(index, index - 1, categoryId);
                          dropdownStates[categoryId] = null;
                          dropdownStates = {...dropdownStates};
                        }}
                      >
                        Move Up
                        <Icon icon="mingcute:arrow-up-fill" class="h-4 w-4" />
                      </button>
                    {/if}
                    {#if index < items.length - 1}
                      <button
                        class="w-full flex items-center justify-between gap-2 text-left px-4 py-2 hover:bg-neutral-100 sm:hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        on:click={() => {
                          moveItem(index, index + 1, categoryId);
                          dropdownStates[categoryId] = null;
                          dropdownStates = {...dropdownStates};
                        }}
                      >
                        Move Down
                        <Icon icon="mingcute:arrow-down-fill" class="h-4 w-4" />
                      </button>
                    {/if}
                    <button
                      class="w-full flex items-center justify-between gap-2 text-left px-4 py-2 hover:bg-neutral-100"
                      on:click={() => {
                        if (!action.editFunc) return;
                        action.editFunc(item.dbId);
                        dropdownStates[categoryId] = null;
                        dropdownStates = {...dropdownStates};
                      }}
                    >
                      Edit
                      <Icon icon="mingcute:edit-2-fill" class="h-4 w-4" />
                    </button>
                    <button
                      class="w-full flex items-center justify-between gap-2 text-left px-4 py-2 bg-red-300 hover:bg-red-400 rounded-b-lg"
                      on:click={() => {
                        if (!action.deleteFunc) return;
                        action.deleteFunc(item.dbId);
                        dropdownStates[categoryId] = null;
                        dropdownStates = {...dropdownStates};
                      }}
                    >
                      Delete
                      <Icon icon="mingcute:delete-2-fill" class="h-4 w-4" />
                    </button>
                  </div>
                {/if}
              </div>
              <button
                class="btn-outline h-[42px] w-[42px] justify-center bg-white !p-2 hidden sm:flex"
                on:click={() => {
                  if (!action.editFunc) return;
                  action.editFunc(item.dbId);
                }}
              >
                <Icon icon="mingcute:edit-2-fill" class="h-5 w-5" />
              </button>
              <button
                class="btn-danger h-[42px] w-[42px] justify-center !p-2 hidden sm:flex"
                on:click={() => {
                  if (!action.deleteFunc) return;
                  action.deleteFunc(item.dbId);
                }}
              >
                <Icon icon="mingcute:delete-2-fill" class="h-5 w-5" />
              </button>
            </div>
          {/each}
        </div>
      {/each}
    {/if}
  </div>
{:else}
  <SettingSkeleton size="lg" />
{/if}
