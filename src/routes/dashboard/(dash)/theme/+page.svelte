<script lang="ts">
  import SettingColor from "$lib/components/dashboard/SettingColor.svelte";
  import SettingSelect from "$lib/components/dashboard/SettingSelect.svelte";
  import themes from "$lib/themes";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
</script>

<SettingColor
  title="Primary Color"
  description="The primary color of your brand"
  loading={false}
  initialValue={data.layoutData.restaurant.primaryColor}
  input={{
    name: "primary-color",
    type: "color",
    value: data.layoutData.restaurant.primaryColor,
    placeholder: data.layoutData.restaurant.primaryColor,
    submitUrl: "/api/restaurant/theme/primary",
  }}
/>

<SettingColor
  title="Secondary Color"
  description="The secondary color of your brand"
  loading={false}
  initialValue={data.layoutData.restaurant.secondaryColor}
  input={{
    name: "secondary-color",
    type: "color",
    value: data.layoutData.restaurant.secondaryColor,
    placeholder: data.layoutData.restaurant.secondaryColor,
    submitUrl: "/api/restaurant/theme/secondary",
  }}
/>

<SettingSelect
  title="General Theme"
  description="The way the restaurant looks and feels."
  loading={false}
  initialValue={data.layoutData.restaurant.theme}
  select={{
    name: "theme",
    type: "text",
    value: data.layoutData.restaurant.theme,
    placeholder: "Default",
    options: Object.keys(themes),
    submitUrl: "/api/restaurant/theme",
  }}
/>
