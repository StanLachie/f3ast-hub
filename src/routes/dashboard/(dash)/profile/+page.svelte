<script lang="ts">
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import Meta from "$lib/components/utils/Meta.svelte";
  import SettingHead from "$lib/components/dashboard/SettingHead.svelte";
  import SettingInput from "$lib/components/dashboard/SettingInput.svelte";

  export let data: PageData;
  const { layoutData } = data;

  let initialLoading = true;

  let personalInfo = {
    firstName: "",
    lastName: "",
  };
  let contactPreferences = {
    promotional_emails: false,
  };

  onMount(async () => {
    personalInfo = {
      firstName: (await layoutData).user?.firstName ?? "",
      lastName: (await layoutData).user?.lastName ?? "",
    };
    contactPreferences = {
      promotional_emails: (await layoutData).user?.promotional_emails ?? false,
    };

    initialLoading = false;
  });
</script>

<Meta title="Personal Info" description="Update your personal details here." />

<SettingHead
  title="Personal Info"
  description="Update your personal details here."
/>

<SettingInput
  title="First Name"
  description="Your legal first name."
  loading={initialLoading}
  initialValue={personalInfo.firstName}
  input={{
    name: "firstName",
    type: "text",
    value: personalInfo.firstName,
    placeholder: "John",
    submitUrl: "/api/profile/firstName",
  }}
/>

<SettingInput
  title="Last Name"
  description="Your legal last name."
  loading={initialLoading}
  initialValue={personalInfo.lastName}
  input={{
    name: "lastName",
    type: "text",
    value: personalInfo.lastName,
    placeholder: "Doe",
    submitUrl: "/api/profile/lastName",
  }}
/>
