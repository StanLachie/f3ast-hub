<script lang="ts">
  import { slide } from "svelte/transition";
  let questions = [
    {
      question: "What is F3AST?",
      answer:
        "F3AST is a platform that allows you to create and manage your restaurant's online menu.",
    },
    {
      question: "What are the differences between the Basic and Elite plans?",
      answer:
        "The Basic plan is our most affordable plan and includes access to our core features. The Elite plan includes additional features, including receiving customer inquiries & access to our AI tools.",
    },
    {
      question: "How do I create my menu on F3AST?",
      answer:
        'After signing up, you can log in to your account, navigate to the "Menu" section of your dashboard, from there you can add your menu items, descriptions, and prices one by one, or as an Elite member you can upload an image of your menu and we will do the rest with AI.',
    },
    {
      question: "Can I customize the look of my menu?",
      answer:
        "Yes, you can customize the look of your menu by adding your own logo and banner. You can also choose from a variety of pre-made themes.",
    },
    {
      question: "Can my customers send enquires?",
      answer:
        "Yes, with the Elite plan you can choose to allow your customers to send enquires to your email.",
    },
    {
      question: "Can I use F3AST for free?",
      answer:
        "You can register for a free account andsetup your menu. After that, if you wish to publish your menu online, you will need to upgrade to a paid plan.",
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
