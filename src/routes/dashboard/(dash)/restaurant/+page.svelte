<script lang="ts">
  import themes from "$lib/themes";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  import SettingAction from "$lib/components/dashboard/SettingAction.svelte";
  import SettingInput from "$lib/components/dashboard/SettingInput.svelte";
  import SettingSelect from "$lib/components/dashboard/SettingSelect.svelte";
  import SettingHead from "$lib/components/dashboard/SettingHead.svelte";
  import SettingImage from "$lib/components/dashboard/SettingImage.svelte";
  import Icon from "@iconify/svelte";
  import Modal from "$lib/components/Modal.svelte";
  import SettingSkeleton from "$lib/components/dashboard/SettingSkeleton.svelte";
  import SettingActions from "$lib/components/dashboard/SettingActions.svelte";

  interface RestaurantInfo {
    published: boolean;
    logo: string;
    banner: string;
    name: string;
    theme: string;
    address: string;
    facebook: string;
    instagram: string;
    twitter: string;
    tiktok: string;
    slug: string;
    phone: string;
    [key: string]: string | boolean | null;
  }

  export let data: PageData;
  const { layoutData } = data;

  let initialLoading = true;

  const socialRegex = {
    facebook: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9_]+\/?$/,
    instagram: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_]+\/?$/,
    twitter: /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/,
    tiktok: /^https?:\/\/(www\.)?tiktok\.com\/[a-zA-Z0-9_]+\/?$/,
    phone: /^[0-9]{10}$/,
  };

  let restaurantInfo: RestaurantInfo = {
    published: false,
    logo: "",
    banner: "",
    name: "",
    theme: "",
    address: "",
    facebook: "",
    instagram: "",
    twitter: "",
    tiktok: "",
    phone: "",
    slug: "",
  };

  let selectedPlatform: {
    platform: null | "facebook" | "instagram" | "twitter" | "tiktok" | "phone";
    url: string | null;
  } = {
    platform: null,
    url: null,
  };

  let isUpdatingSocial = false;
  let isClearingSocial = false;

  const handleUpdateSocial = async (event: Event) => {
    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);

    if (!formData.get("url")) return;

    if (
      selectedPlatform.platform &&
      selectedPlatform.url &&
      !socialRegex[selectedPlatform.platform].test(selectedPlatform.url)
    ) {
      if (selectedPlatform.platform === "phone") {
        alert(
          "Invalid phone number. Please make sure it is a valid phone number."
        );
      } else {
        alert(
          `Invalid URL. Please make sure it is a valid URL. (e.g. https://www.${selectedPlatform.platform}.com/username)`
        );
      }
      return;
    }

    isUpdatingSocial = true;

    const res = await fetch(`/api/restaurant/social`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: selectedPlatform.platform,
        url: selectedPlatform.url,
      }),
    });

    if (res.ok) {
      if (selectedPlatform.platform) {
        restaurantInfo[selectedPlatform.platform] = formData.get(
          "url"
        ) as string;
        selectedPlatform = {
          platform: null,
          url: null,
        };
      }
    } else {
      alert("Failed to update social media link. Please try again.");
    }

    isUpdatingSocial = false;
  };

  const handleClearSocial = async (platform: string) => {
    isClearingSocial = true;

    const res = await fetch(`/api/restaurant/social`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform: platform, url: null }),
    });

    if (res.ok) {
      restaurantInfo[platform] = null;
      selectedPlatform = {
        platform: null,
        url: null,
      };
    } else {
      alert("Failed to clear social media link. Please try again.");
    }

    isClearingSocial = false;
  };

  const closeModal = () => {
    selectedPlatform = {
      platform: null,
      url: null,
    };
  };

  onMount(async () => {
    restaurantInfo = {
      published: (await layoutData).restaurant?.published ?? false,
      logo: (await layoutData).restaurant?.logo ?? "",
      banner: (await layoutData).restaurant?.banner ?? "",
      name: (await layoutData).restaurant?.name ?? "",
      theme: (await layoutData).restaurant?.theme ?? "",
      address: (await layoutData).restaurant?.address ?? "",
      facebook: (await layoutData).restaurant?.facebook ?? "",
      instagram: (await layoutData).restaurant?.instagram ?? "",
      twitter: (await layoutData).restaurant?.twitter ?? "",
      tiktok: (await layoutData).restaurant?.tiktok ?? "",
      slug: (await layoutData).restaurant?.slug ?? "",
      phone: (await layoutData).restaurant?.phone ?? "",
    };

    initialLoading = false;
  });
</script>

<SettingHead
  title="Restaurant Info"
  description="Update your restaurant's details here."
/>

{#if restaurantInfo.published}
  <SettingActions
    title="Publish"
    description="Whether your restaurant is published or not."
    loading={initialLoading}
    actions={[
      {
        name: "Unpublish",
        type: "danger",
        func: async () => {
          if (!window) return;

          const confirm = window.confirm(
            "Are you sure you want to unpublish your restaurant?"
          );

          if (!confirm) return;

          const res = await fetch("/api/restaurant/published", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: false }),
          });

          if (!res.ok) {
            const data = await res.json();
            alert(data.error || "Failed to unpublish restaurant");
            return;
          }

          restaurantInfo.published = false;
        },
      },
      {
        name: "Visit Restaurant",
        type: "primary",
        func: async () => {
          window.open(`https://${restaurantInfo.slug}.f3ast.com`, "_blank");
        },
      },
    ]}
  />
{:else}
  <SettingAction
    title="Publish"
    description="Whether your restaurant is published or not."
    loading={initialLoading}
    action={{
      name: "Publish",
      type: "primary",
      func: async () => {
        if (!window) return;

        const confirm = window.confirm(
          "Are you sure you want to publish your restaurant?"
        );

        if (!confirm) return;

        const res = await fetch("/api/restaurant/published", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: true }),
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || "Failed to publish restaurant");
          return;
        }

        restaurantInfo.published = true;
      },
    }}
  />
{/if}

<SettingImage
  title="Logo"
  description="Upload a logo for your restaurant."
  shape="circle"
  loading={initialLoading}
  currentImage={data.logo || null}
  uploadUrl="/api/restaurant/logo"
/>

<SettingImage
  title="Banner"
  description="Upload a banner for your restaurant."
  shape="square"
  loading={initialLoading}
  currentImage={data.banner || null}
  uploadUrl="/api/restaurant/banner"
/>

<SettingInput
  title="Name"
  description="Your restaurant's name."
  loading={initialLoading}
  initialValue={restaurantInfo.name}
  input={{
    name: "name",
    type: "text",
    value: restaurantInfo.name,
    placeholder: "John's Diner",
    submitUrl: "/api/restaurant/name",
  }}
/>

<!-- <SettingSelect
  title="Theme"
  description="Your restaurant's theme."
  loading={initialLoading}
  initialValue={restaurantInfo.theme}
  select={{
    name: "theme",
    type: "text",
    value: restaurantInfo.theme,
    placeholder: "Default",
    options: Object.keys(themes),
    submitUrl: "/api/restaurant/theme",
  }}
/> -->
<SettingInput
  title="Address"
  description="Your restaurant's address."
  loading={initialLoading}
  initialValue={restaurantInfo.address}
  input={{
    name: "address",
    type: "text",
    value: restaurantInfo.address,
    placeholder: "123 Main St.",
    submitUrl: "/api/restaurant/address",
  }}
/>

{#if !initialLoading}
  <div
    class="flex w-full flex-col gap-2 rounded-lg border border-neutral-400 bg-white p-4 shadow-sm md:flex-row md:items-center"
  >
    <div class="flex-1">
      <h2 class="text-lg font-semibold">Social Media</h2>
      <p class="text-neutral-600">Add your social media links here.</p>
    </div>
    <button
      class={`${restaurantInfo.phone ? "btn-primary" : "btn-outline"} !p-2`}
      on:click={() => {
        selectedPlatform = {
          platform: "phone",
          url: restaurantInfo.phone,
        };
      }}
    >
      <Icon icon="mingcute:phone-line" class="h-5 w-5" />
    </button>
    <button
      class={`${restaurantInfo.facebook ? "btn-primary" : "btn-outline"} !p-2`}
      on:click={() => {
        selectedPlatform = {
          platform: "facebook",
          url: restaurantInfo.facebook,
        };
      }}
    >
      <Icon icon="mingcute:facebook-line" class="h-5 w-5" />
    </button>
    <button
      class={`${restaurantInfo.tiktok ? "btn-primary" : "btn-outline"} !p-2`}
      on:click={() => {
        selectedPlatform = {
          platform: "tiktok",
          url: restaurantInfo.tiktok,
        };
      }}
    >
      <Icon icon="ic:baseline-tiktok" class="h-5 w-5" />
    </button>

    <button
      class={`${restaurantInfo.instagram ? "btn-primary" : "btn-outline"} !p-2`}
      on:click={() => {
        selectedPlatform = {
          platform: "instagram",
          url: restaurantInfo.instagram,
        };
      }}
    >
      <Icon icon="mingcute:ins-line" class="h-5 w-5" />
    </button>
    <button
      class={`${restaurantInfo.twitter ? "btn-primary" : "btn-outline"} !p-2`}
      on:click={() => {
        selectedPlatform = {
          platform: "twitter",
          url: restaurantInfo.twitter,
        };
      }}
    >
      <Icon icon="mingcute:twitter-line" class="h-5 w-5" />
    </button>
  </div>
{:else}
  <SettingSkeleton />
{/if}

<Modal
  showModal={selectedPlatform.platform !== null}
  onClose={closeModal}
  title={selectedPlatform.platform
    ? `Update ${selectedPlatform.platform} URL`
    : ""}
>
  {#if selectedPlatform.platform}<form
      class="flex flex-col gap-3"
      on:submit={(e) => {
        e.preventDefault();
        handleUpdateSocial(e);
      }}
    >
      <label for="social-url" class="text-sm font-medium text-neutral-700">
        {selectedPlatform.platform === "phone"
          ? "Public Phone Number"
          : `${selectedPlatform.platform.charAt(0)?.toUpperCase() + selectedPlatform.platform.slice(1)} Profile URL`}
      </label>
      <input
        id="social-url"
        name="url"
        type="text"
        class="input"
        bind:value={selectedPlatform.url}
        placeholder={selectedPlatform.platform === "phone"
          ? "1234567890"
          : `https://www.${selectedPlatform.platform}.com/${restaurantInfo.slug}`}
      />

      <div class="flex items-center gap-3">
        <button
          type="button"
          on:click={() => {
            const confirm = window.confirm(
              "Are you sure you want to clear this social media link?"
            );
            if (!confirm) return;
            handleClearSocial(String(selectedPlatform.platform));
          }}
          disabled={selectedPlatform.url === null}
          class="btn-danger w-full"
        >
          {isClearingSocial ? "Clearing..." : "Clear"}
        </button>
        <button
          type="submit"
          disabled={isUpdatingSocial}
          class="btn-primary w-full"
        >
          {isUpdatingSocial ? "Updating..." : "Update"}
        </button>
      </div>
    </form>{/if}
</Modal>
