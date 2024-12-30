<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Button from "../Button.svelte";
  import Icon from "@iconify/svelte";

  let learnMore: HTMLElement | null = null;

  onMount(() => {
    learnMore = document.getElementById("learnMore");
  });
</script>

<div
  class="my-16 flex flex-col lg:flex-row w-full items-center justify-center xl:justify-between px-4 md:px-8 lg:px-16"
>
  <div class="flex max-w-3xl flex-col items-center xl:items-start text-left">
    <h1
      class="text-pretty font-bold leading-snug text-5xl sm:text-6xl lg:text-6xl xl:text-7xl text-center xl:text-left"
    >
      <span class="text-emerald-300 text-outline font-[775]"
        >Connect with Your Customers Online</span
      >
    </h1>

    <p
      class="mt-6 text-lg sm:text-lg lg:text-xl xl:text-2xl text-neutral-700 font-[400] text-center xl:text-left mx-4 xl:mx-0"
    >
      With <span class="font-norwester">F3AST</span>, you can easily create a
      stunning online menu, share it with QR codes, and help your food business
      evolve into the modern age.
    </p>
    <div class="mt-8 flex gap-4">
      <a class="btn-primary" href="/pricing"
        >View Pricing<Icon
          icon="mingcute:arrow-right-circle-fill"
          class="text-xl"
        /></a
      >
      <button
        class="btn-outline"
        on:click={() =>
          learnMore &&
          learnMore.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          })}
      >
        See How It Works <Icon
          icon="mingcute:information-fill"
          class="text-xl"
        />
      </button>
    </div>
  </div>

  <div class="mt-12 hidden xl:block lg:ml-8">
    <img
      src="/hero.png"
      alt="hero"
      class="w-[350px] sm:w-[400px] lg:w-[450px] xl:w-[500px]"
    />
  </div>
</div>
