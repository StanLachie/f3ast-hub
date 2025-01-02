<script lang="ts">
  import HeadlessNav from "$lib/components/HeadlessNav.svelte";
  import type { PageData } from "./$types";
  import { enhance } from "$app/forms";
  import Meta from "$lib/components/utils/Meta.svelte";

  export let data: PageData;

  let isSubmitting = false;
  let error: string | null = null;
  let isSuccess = false;
</script>

<Meta title="Contact Us" description="Contact us for more information." />

{#if isSuccess}
  <div
    class="flex min-h-screen w-full flex-col items-center justify-center bg-neutral-100"
  >
    <div
      class="mx-auto w-full max-w-2xl px-8 py-16 sm:px-16 sm:py-24 md:px-8 lg:px-16"
    >
      <h1 class="text-center text-2xl font-semibold">Thank you!</h1>
      <p class="text-center text-neutral-600">
        We'll get back to you as soon as possible.
      </p>
      <a href="/" class="btn-primary mt-4">Back to Home</a>
    </div>
  </div>
{:else}
  <div
    class="flex min-h-screen w-full flex-col items-center justify-center bg-neutral-100"
  >
    <div
      class="mx-auto w-full max-w-2xl px-8 py-16 sm:px-16 sm:py-24 md:px-8 lg:px-16"
    >
      <form
        class="flex w-full flex-col gap-4 rounded-lg border border-neutral-400 bg-white p-4 shadow-md"
        method="POST"
        enctype="multipart/form-data"
        action="?/contact"
        use:enhance={() => {
          isSubmitting = true;
          return async ({ result }) => {
            console.log(result);
            if (
              result.type === "failure" &&
              result.data &&
              result.data.error &&
              result.data.error &&
              typeof result.data.message === "string"
            ) {
              error = result.data.message;
              isSubmitting = false;
            } else {
              isSuccess = true;
            }
          };
        }}
      >
        <div>
          <h1 class="text-center text-2xl font-semibold">Contact Us</h1>
          <p class="text-center text-neutral-600">
            Have a question? Want to get in touch? <br /> We're here to help.
          </p>
        </div>

        {#if error}
          <div
            class="w-full rounded-lg border border-neutral-800 bg-red-400 px-3 py-2 text-center text-sm font-normal"
          >
            {error}
          </div>
        {/if}

        <input class="input" type="text" name="name" placeholder="Name" />
        <input class="input" type="email" name="email" placeholder="Email" />
        <input class="input" type="text" name="subject" placeholder="Subject" />
        <textarea class="input" name="message" placeholder="Message"></textarea>
        <button
          class="btn-primary w-full"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  </div>
{/if}

<HeadlessNav />
