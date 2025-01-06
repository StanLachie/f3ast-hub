<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  let error: string | null = null;
  let isSubmitting = false;
</script>

<form
  method="POST"
  class="form"
  use:enhance={() => {
    isSubmitting = true;
    return async ({ result }) => {
      if (result.type === "failure") {
        error =
          typeof result.data?.message === "string"
            ? result.data.message
            : "An error occurred";
        isSubmitting = false;
      } else {
        goto("/dashboard/restaurant");
      }
    };
  }}
>
  <h1 class="text-2xl font-semibold">Setup Your Restaurant</h1>
  {#if error}
    <div
      class="w-full rounded-lg border border-neutral-800 bg-red-400 px-3 py-2 text-center font-normal text-sm"
    >
      {error}
    </div>
  {/if}
  <input
    class="input"
    type="text"
    name="name"
    placeholder="Restaurant Name"
    required
  />
  <input
    class="input"
    type="text"
    name="address"
    placeholder="Restaurant Address"
    required
  />
  <input
    class="input"
    type="text"
    name="slug"
    placeholder="URL Slug (e.g., my-restaurant)"
    required
  />
  <button class="btn-primary w-full" disabled={isSubmitting} type="submit">
    {isSubmitting ? "Creating..." : "Create Restaurant"}
  </button>
</form>
