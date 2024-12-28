<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client";

  let email: string;
  let password: string;
  let error: string | null = null;
  let isSubmitting = false;

  const handleSignIn = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          isSubmitting = true;
        },
        onSuccess: async () => {
          await goto("/dashboard/restaurant");
        },
        onError: (ctx: any) => {
          isSubmitting = false;
          error = ctx.error.message;
        },
      }
    );
  };
</script>

<form class="form">
  <h1 class="text-2xl font-semibold">Login</h1>
  {#if error}
    <div
      class="w-full rounded-lg border border-neutral-800 bg-red-400 px-3 py-2 text-center font-normal text-sm"
    >
      {error}
    </div>
  {/if}
  <input
    class="input"
    type="email"
    name="email"
    placeholder="Email"
    required
    bind:value={email}
  />
  <input
    class="input"
    type="password"
    name="password"
    placeholder="Password"
    required
    bind:value={password}
  />
  <button
    class="btn-primary w-full"
    disabled={isSubmitting}
    on:click={handleSignIn}
  >
    {isSubmitting ? "Logging in..." : "Login"}
  </button>
  <span class="text-neutral-600">
    Need an account?
    <a class="text-emerald-500 underline" href="/dashboard/register">
      register
    </a>
  </span>
</form>
