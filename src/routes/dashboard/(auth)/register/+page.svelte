<script lang="ts">
  import { goto } from "$app/navigation";
  import { authClient } from "$lib/auth-client";

  let firstName: string;
  let lastName: string;
  let email: string;
  let password: string;
  let confirmPassword: string;
  let error: string | null = null;
  let isSubmitting = false;

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      error = "Passwords do not match";
      return;
    }

    await authClient.signUp.email(
      {
        name: email,
        email,
        password,
        firstName,
        lastName,
      },
      {
        onRequest: () => {
          isSubmitting = true;
        },
        onSuccess: () => {
          goto("/dashboard/setup-restaurant");
        },
        onError(ctx: any) {
          isSubmitting = false;
          error = ctx.error.message;
        },
      }
    );
  };
</script>

<form class="form">
  <h1 class="text-2xl font-semibold">Register</h1>
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
    name="firstName"
    placeholder="First Name"
    required
    bind:value={firstName}
  />
  <input
    class="input"
    type="text"
    name="lastName"
    placeholder="Last Name"
    required
    bind:value={lastName}
  />
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
  <input
    class="input"
    type="password"
    name="confirmPassword"
    placeholder="Confirm Password"
    required
    bind:value={confirmPassword}
  />
  <button
    class="btn-primary w-full"
    disabled={isSubmitting}
    on:click={handleRegister}
  >
    {isSubmitting ? "Registering..." : "Register"}
  </button>
  <span class="text-neutral-600">
    Already have an account?
    <a class="text-emerald-500 underline" href="/dashboard/login">login</a>
  </span>
</form>
