<script lang="ts">
  import type { PageData } from "./$types";
  import { onMount } from "svelte";
  import Meta from "$lib/components/utils/Meta.svelte";
  import SettingHead from "$lib/components/dashboard/SettingHead.svelte";
  import SettingInput from "$lib/components/dashboard/SettingInput.svelte";
  import SettingAction from "$lib/components/dashboard/SettingAction.svelte";

  export let data: PageData;
  const { layoutData } = data;

  let initialLoading = true;

  let personalInfo = {
    name: "",
    firstName: "",
    lastName: "",
    inquiry_emails: true,
  };
  let contactPreferences = {
    promotional_emails: false,
  };

  onMount(async () => {
    personalInfo = {
      name: (await layoutData).user?.name ?? "",
      firstName: (await layoutData).user?.firstName ?? "",
      lastName: (await layoutData).user?.lastName ?? "",
      inquiry_emails: (await layoutData).user?.inquiry_emails ?? true,
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
  title="Username"
  description="Your username."
  loading={initialLoading}
  initialValue={personalInfo.name}
  input={{
    name: "username",
    type: "text",
    value: personalInfo.name,
    placeholder: "john_doe",
    submitUrl: "/api/profile/username",
  }}
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

{#if personalInfo.inquiry_emails}
  <SettingAction
    title="Inquiry Emails"
    description="Receive customer inquiry emails via this accounts email."
    loading={initialLoading}
    action={{
      name: "Disable",
      type: "danger",
      func: async () => {
        if (!window) return;

        const confirm = window.confirm(
          "Are you sure you want to disable inquiry emails to this account?"
        );

        if (!confirm) return;

        const res = await fetch("/api/profile/inquiryEmails", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: false }),
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || "Failed to disable inquiry emails");
          return;
        }

        personalInfo.inquiry_emails = false;
      },
    }}
  />
{:else}
  <SettingAction
    title="Inquiry Emails"
    description="Receive customer inquiry emails via this accounts email."
    loading={initialLoading}
    action={{
      name: "Enable",
      type: "primary",
      func: async () => {
        if (!window) return;

        const confirm = window.confirm(
          "Are you sure you want to enable inquiry emails to this account?"
        );

        if (!confirm) return;

        const res = await fetch("/api/profile/inquiryEmails", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: true }),
        });

        if (!res.ok) {
          const data = await res.json();
          alert(data.error || "Failed to enable inquiry emails");
          return;
        }

        personalInfo.inquiry_emails = true;
      },
    }}
  />
{/if}
