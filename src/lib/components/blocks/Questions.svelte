<script lang="ts">
  import { slide } from "svelte/transition";
  let questions = [
    {
      question: "What is F3AST?",
      answer:
        "F3AST is a platform designed to help you create, manage, and showcase your restaurant's online menu with ease.",
    },
    {
      question: "What are the differences between the Basic and Elite plans?",
      answer:
        "The Basic plan provides access to essential features at an affordable price. The Elite plan unlocks premium benefits, including customer inquiries and advanced AI tools.",
    },
    {
      question: "How do I create my menu on F3AST?",
      answer:
        'Sign up, log in, and navigate to the "Menu" section in your dashboard. Add menu items, descriptions, and prices manually, or, as an Elite member, upload an image of your menu and let our AI handle the rest.',
    },
    {
      question: "Can I customize the look of my menu?",
      answer:
        "Absolutely! Personalize your menu with your logo, banner, and a selection of pre-designed themes to match your restaurant’s brand.",
    },
    {
      question: "Can my customers send inquiries?",
      answer:
        "Yes! With the Elite plan, you can enable customer inquiries to be sent directly to your email for better communication.",
    },
    {
      question: "Can I use F3AST for free?",
      answer:
        "Yes, you can create a free account to set up your menu. To publish it online and access additional features, you’ll need to upgrade to a paid plan.",
    },
  ];

  let openIndexs: number[] = [];

  function toggleQuestion(index: number) {
    if (openIndexs.includes(index)) {
      openIndexs = openIndexs.filter((i) => i !== index);
    } else {
      openIndexs = [...openIndexs, index];
    }
  }
</script>

<div class="w-full bg-gray-950 py-24 text-white" id="faq">
  <div class="mx-auto max-w-7xl px-6 text-center">
    <h1 class="text-4xl font-bold md:text-5xl lg:text-6xl">
      Frequently Asked Questions
    </h1>
    <p class="mx-auto mt-8 max-w-2xl text-lg text-gray-300">
      Here are some of the most common questions we receive. If you have any
      other questions, please don't hesitate to <a
        href="/contact"
        class="text-emerald-500 hover:text-emerald-400"
      >
        contact us</a
      >.
    </p>
  </div>
  <div class="mx-auto max-w-4xl mt-16 px-6">
    <div class="divide-y divide-gray-800">
      {#each questions as { question, answer }, index}
        <div class="py-6">
          <div class="group">
            <button
              class="flex w-full cursor-pointer items-center justify-between text-left"
              on:click={() => toggleQuestion(index)}
            >
              <h2 class="text-2xl font-medium text-white">{question}</h2>
              <span class="ml-6 flex h-7 items-center">
                <svg
                  class="h-6 w-6 transform text-gray-400 transition-transform duration-200 {openIndexs.includes(
                    index
                  )
                    ? 'rotate-180'
                    : 'rotate-0'}"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            {#if openIndexs.includes(index)}
              <div class="mt-3 pr-12" transition:slide>
                <p class="text-lg text-gray-300">{answer}</p>
              </div>
            {:else}
              <div class="h-0 overflow-hidden">
                <p class="text-lg text-gray-300">{answer}</p>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
