<script lang="ts">
  import Icon from "@iconify/svelte";
  export let showModal: boolean;
  export let onClose: () => void;
  export let title: string;
</script>

{#if showModal}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    role="presentation"
    on:click|self={onClose}
  >
    <dialog
      open
      class="relative m-0 max-h-[90vh] w-full max-w-lg cursor-default overflow-y-auto rounded-2xl border-2 border-neutral-400 bg-white p-6 shadow-lg m-2"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <button
        class="absolute right-1 top-1 p-1 text-neutral-400 hover:text-neutral-600"
        on:click={onClose}
        aria-label="Close modal"
      >
        <Icon icon="mingcute:close-fill" class="h-5 w-5" />
      </button>

      <h2 id="modal-title" class="sr-only">{title}</h2>

      <div class="mt-2">
        <slot />
      </div>
    </dialog>
  </div>
{/if}

<svelte:window on:keydown={(e) => e.key === "Escape" && onClose()} />
