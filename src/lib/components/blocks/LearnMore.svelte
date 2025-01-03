<script lang="ts">
  import { onMount } from "svelte";
  import FeatureCard from "./FeatureCard.svelte";
  import Splide from "@splidejs/splide";

  const features = [
    {
      title: "Affordable Plans",
      description: "Starting at just $19.99/month with no hidden fees.",
      imageSrc: "/cash.png",
      imageAlt: "Affordable Plans",
      link: "/pricing",
      bgColorClass: "bg-purple-500/10",
    },
    {
      title: "Beautiful Online Menu",
      description:
        "Showcase your dishes with a highly customizable digital menu.",
      imageSrc: "/hamburger.png",
      imageAlt: "Online Menu",
      link: "/features",
      bgColorClass: "bg-emerald-500/10",
    },
    {
      title: "Customer Enquiries",
      description: "Connect with your customers directly via email.",
      imageSrc: "/email.png",
      imageAlt: "Customer Enquiries",
      link: "/features",
      bgColorClass: "bg-yellow-500/10",
    },

    {
      title: "Hands-on Support",
      description: "Get personalized assistance whenever you need it.",
      imageSrc: "/handshake.png",
      imageAlt: "Hands-on Support",
      link: "/support",
      bgColorClass: "bg-blue-500/10",
    },
    {
      title: "Show Up Online",
      description: "Show up when your customers search for you online.",
      imageSrc: "/globe.png",
      imageAlt: "Show Up Online",
      link: "/features",
      bgColorClass: "bg-purple-500/10",
    },
    {
      title: "QR Codes",
      description: "Connect physical and digital with custom QR codes.",
      imageSrc: "/camera.png",
      imageAlt: "QR Codes",
      link: "/features",
      bgColorClass: "bg-yellow-500/10",
    },
    {
      title: "Intuitive Dashboard",
      description: "Manage everything from one simple interface.",
      imageSrc: "/gear.png",
      imageAlt: "Dashboard",
      link: "/features",
      bgColorClass: "bg-red-500/10",
    },
  ];

  let perPage = 4;
  let splideElement: HTMLElement;
  let splide: Splide;

  onMount(() => {
    function getPerPage() {
      const width = window.innerWidth;
      if (width < 720) return 1.3;
      if (width < 1024) return 2;
      if (width < 1600) return 3;
      return 4;
    }

    perPage = getPerPage();

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
        720: { perPage: 1.3 },
        1024: { perPage: 2 },
        1600: { perPage: 3 },
      },
      arrows: false,
      drag: false,
      lazyLoad: "nearby",
    });

    splide.mount();

    const handleResize = () => {
      perPage = getPerPage();
    };

    window?.addEventListener("resize", handleResize);

    return () => {
      splide?.destroy();
      window?.removeEventListener("resize", handleResize);
    };
  });
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@splidejs/splide@3.0.9/dist/css/splide.min.css"
  />
</svelte:head>

<div class="w-full bg-gray-950 py-24 text-white" id="learnMore">
  <div class="mx-auto max-w-7xl px-6 text-center">
    <h1 class="text-4xl font-bold md:text-5xl lg:text-6xl">
      ONE PLATFORM.<br />ALL YOU NEED.
    </h1>
    <p class="mx-auto mt-8 max-w-2xl text-lg text-gray-300">
      Transform your restaurant's online presence with our all-in-one solution.
    </p>
  </div>

  <section bind:this={splideElement} class="splide mt-16 max-h-[450px]">
    <div class="splide__track">
      <ul class="splide__list">
        {#each features as feature}
          <li class="splide__slide">
            <div class="mx-auto flex-shrink-0 h-[450px] px-4">
              <FeatureCard {...feature} />
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </section>

  <div class="relative mt-12"></div>
</div>
