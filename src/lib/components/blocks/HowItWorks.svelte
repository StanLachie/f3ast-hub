<script lang="ts">
  let steps = [
    {
      title: "Sign Up",
      description:
        "Simply sign up for an account with us in just a few clicks for as little as $29.99/month.",
      //   src: "https://www.f3ast.com/_next/image?url=%2Fimages%2Fscreenshots%2F1.webp&w=1920&q=75",
    },
    {
      title: "Add Your Menu",
      description:
        "Eaisly add your menu to F3AST with our easy to use AI menu builder.",
      //   src: "https://www.f3ast.com/_next/image?url=%2Fimages%2Fscreenshots%2F3.webp&w=1920&q=75",
    },
    {
      title: "Go Live",
      description:
        "Your menu is now online and ready for your customers to find & share.",
      //   src: "https://www.f3ast.com/_next/image?url=%2Fimages%2Fscreenshots%2F4.webp&w=1920&q=75",
    },
  ];
</script>

<div class="relative py-32" id="howItWorks">
  <div class="mx-auto max-w-[100rem] px-8">
    <h2 class="text-6xl font-bold text-center mb-16 text-emerald-950">
      It's as simple as:
    </h2>
    <div class="flex flex-col md:flex-row justify-between sm:space-x-8">
      {#each steps as step, i}
        <div class="flex-1 px-6 py-4 text-center text-emerald-950">
          <div class="flex justify-center mb-4">
            <span
              class="text-3xl font-bold border-2 border-emerald-950 rounded-full w-12 h-12 flex items-center justify-center"
            >
              {i + 1}
            </span>
          </div>
          <div class="flex justify-center mb-4">
            <span class="text-4xl font-bold">
              {step.title}
            </span>
          </div>
          <p class="text-lg font-medium text-neutral-500">{step.description}</p>
        </div>
      {/each}
    </div>
    <div class="flex justify-center mt-16">
      <a href="/pricing" class="btn-primary text-xl rounded-full">Get Started</a
      >
    </div>
  </div>
</div>
