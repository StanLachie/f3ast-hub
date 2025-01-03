<script lang="ts">
  export let title: string;
  export let description: string;
  export let imageSrc: string;
  export let imageAlt: string;
  export let bgColorClass: string = "bg-purple-500/10";
</script>

<div
  class="flex h-[450px] flex-col rounded-3xl p-8 {bgColorClass} snap-center group"
>
  <div class="flex flex-1 flex-col items-center justify-center">
    <img
      src={imageSrc}
      alt={imageAlt}
      class="mb-6 w-2/3 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>
  <h3 class="text-2xl font-bold text-white">{title}</h3>
  <p class="text-base mt-3 text-gray-300">{description}</p>
</div>
