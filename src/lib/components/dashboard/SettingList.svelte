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
  let dropdownStates = new Array(listItems.length).fill(false);

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

  $: mappedItems = mapItemsForDisplay(listItems);

  const handleConsider = (event: any) => {
    mappedItems = event.detail.items;
  };

  const handleFinalize = async (event: any) => {
    mappedItems = event.detail.items;

    if (reorderUrl) {
      reordering = true;

      await fetch(reorderUrl, {
        method: "PUT",
        body: JSON.stringify({
          items: mapItemsForApi(mappedItems),
        }),
      });

      reordering = false;
    }

    dragDisabled = true;
  };

  const toggleDropdown = (index: number, event: MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    const buttonRect = button.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const isNearBottom = buttonRect.bottom > viewportHeight - 128;

    dropdownStates = dropdownStates.map((state, i) =>
      i === index ? !state : false
    );

    if (isNearBottom) {
      const dropdown = button.nextElementSibling as HTMLElement;
      if (dropdown) {
        dropdown.style.bottom = "100%";
        dropdown.style.top = "auto";
      }
    }
  };

  const moveItem = async (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= mappedItems.length) return;

    const newItems = [...mappedItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    mappedItems = newItems;

    if (reorderUrl) {
      reordering = true;
      await fetch(reorderUrl, {
        method: "PUT",
        body: JSON.stringify({
          items: mapItemsForApi(mappedItems),
        }),
      });
      reordering = false;
    }
  };
</script>

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
      <div
        class="flex flex-col gap-2"
        use:dndzone={{
          items: mappedItems,
          flipDurationMs: 100,
          dropTargetStyle: {},
          transformDraggedElement: (element) => {
            return element;
          },
          dropFromOthersDisabled: true,
          dragDisabled,
        }}
        on:consider={(e) => handleConsider(e)}
        on:finalize={(e) => handleFinalize(e)}
      >
        {#each mappedItems as item, index (item.id)}
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
            <div class="relative">
              <button
                class="btn-outline flex h-[42px] w-[42px] justify-center bg-white !p-2 sm:hidden"
                on:click={(e) => toggleDropdown(index, e)}
              >
                <Icon icon="mingcute:more-2-fill" class="h-5 w-5" />
              </button>
              <div
                class={`absolute z-50 right-0 mt-2 w-48 bg-white border border-neutral-400 rounded-lg shadow-lg ${dropdownStates[index] ? "block" : "hidden"} sm:hidden`}
              >
                {#if index > 0}
                  <button
                    class="w-full flex items-center justify-between gap-2 text-left px-4 py-2 hover:bg-neutral-100 sm:hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    on:click={() => {
                      moveItem(index, index - 1);
                      dropdownStates[index] = false;
                    }}
                    disabled={index === 0}
                  >
                    Move Up
                    <Icon icon="mingcute:arrow-up-fill" class="h-4 w-4" />
                  </button>
                {/if}
                {#if index < mappedItems.length - 1}
                  <button
                    class="w-full flex items-center justify-between gap-2 text-left px-4 py-2 hover:bg-neutral-100 sm:hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    on:click={() => {
                      moveItem(index, index + 1);
                      dropdownStates[index] = false;
                    }}
                    disabled={index === mappedItems.length - 1}
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
                    dropdownStates[index] = false;
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
                    dropdownStates[index] = false;
                  }}
                >
                  Delete
                  <Icon icon="mingcute:delete-2-fill" class="h-4 w-4" />
                </button>
              </div>
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
    {/if}
  </div>
{:else}
  <SettingSkeleton size="lg" />
{/if}
