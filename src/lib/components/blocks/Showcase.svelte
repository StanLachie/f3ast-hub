<script lang="ts">
  import { onMount } from "svelte";
  import FeatureCard from "./FeatureCard.svelte";
  import Splide from "@splidejs/splide";

  const slides = [
    {
      title: "Dashboard",
      description: "Manage your menu and customers from one place.",
      imageSrc: "/dashboard.png",
      imageAlt: "Dashboard",
    },
    {
      title: "Menu Editor",
      description: "Create and manage your menu with ease.",
      imageSrc: "/menuEditor.png",
      imageAlt: "Menu Editor",
    },
    {
      title: "Your Website",
      description: "Your menu, your customers, your way.",
      imageSrc: "/menu.png",
      imageAlt: "Your Website",
    },
    {
      title: "Customer Enquiries",
      description: "Let your customers get in touch with you via email.",
      imageSrc: "/enquiries.png",
      imageAlt: "Customer Enquiries",
    },
    {
      title: "Themes",
      description: "Customize your website with our themes.",
      imageSrc: "/themes.png",
      imageAlt: "Themes",
    },
  ];

  let perPage = 4;
  let splideElement: HTMLElement;
  let splide: Splide;

  onMount(() => {
    splide = new Splide(splideElement, {
      perPage,
      gap: "1rem",
      omitEnd: true,
      type: "loop",
      pagination: false,
      focus: "center",
      autoplay: true,
      interval: 2500,
      // pauseOnFocus: true,
      // pauseOnHover: true,
      easing: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
      breakpoints: {
        720: { perPage: 1.1 },
        1024: { perPage: 1.3 },
        1600: { perPage: 2 },
        2000: { perPage: 3 },
      },
      arrows: false,
      drag: false,
      lazyLoad: "nearby",
    });

    splide.mount();
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@splidejs/splide@3.0.9/dist/css/splide.min.css"
  />
</svelte:head>

<div class="w-full py-24" id="showcase">
  <div class="mx-auto max-w-7xl px-6 text-center">
    <h1 class="text-4xl font-bold md:text-5xl lg:text-6xl">
      Take A Look For Yourself
    </h1>
    <p class="mx-auto mt-8 max-w-2xl text-lg text-gray-500">
      Here's a little look at what F3AST will look like for you.
    </p>
  </div>

  <section bind:this={splideElement} class="splide mt-16 text-[0px]">
    <div class="splide__track">
      <div class="splide__pagination hidden"></div>
      <ul class="splide__list">
        {#each slides as slide}
          <li class="splide__slide">
            <div
              class="mx-auto flex-shrink-0 px-4 bg-white rounded-lg shadow-sm mb-4 p-4"
            >
              <img
                src={slide.imageSrc}
                alt={slide.imageAlt}
                class="rounded-lg w-full aspect-video"
              />
              <p class="text-xl font-bold mt-4">{slide.title}</p>
              <p class="text-lg text-gray-600 mt-2">{slide.description}</p>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </section>

  <div class="relative mt-12"></div>
</div>
