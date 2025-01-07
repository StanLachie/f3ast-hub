<script lang="ts">
  import type { PageData } from "./$types";
  import themes, { type Theme, type SemanticColors } from "$lib/themes";
  import Icon from "@iconify/svelte";

  let { data }: { data: PageData } = $props();

  let isEditing = $state(false);
  let currentTheme = $state<Theme>(structuredClone(themes.default));
  let selectedTheme = $state<keyof typeof themes>("default");
  let themeName = $state<string>("new-theme");
  let selectedSection = $state<keyof SemanticColors>("brand");

  const sections: Array<{
    key: keyof SemanticColors;
    label: string;
    description: string;
  }> = [
    { key: "brand", label: "Brand", description: "Primary brand colors" },
    {
      key: "bg",
      label: "Background",
      description: "Background colors for different contexts",
    },
    {
      key: "text",
      label: "Typography",
      description: "Text colors for various purposes",
    },
    {
      key: "border",
      label: "Borders",
      description: "Border colors for different states",
    },
    {
      key: "state",
      label: "States",
      description: "Colors for different states like error, success",
    },
  ];

  function copyThemeToClipboard() {
    const themeObject = {
      [themeName]: currentTheme,
    };
    const themeString = `const newTheme = ${JSON.stringify(themeObject, null, 2)};`;
    navigator.clipboard.writeText(themeString);
  }

  function updateColor(
    section: keyof SemanticColors,
    key: string,
    value: string
  ) {
    const sectionColors = currentTheme.colors[section] as Record<
      string,
      string
    >;
    sectionColors[key] = value.toUpperCase();
    currentTheme = currentTheme;
  }

  function selectTheme(theme: keyof typeof themes) {
    selectedTheme = theme;
    currentTheme = structuredClone(themes[theme]);
  }

  function startEditing() {
    isEditing = true;
    themeName = `${selectedTheme}-custom`;
  }
</script>

<div
  class="min-h-screen p-4"
  style="background-color: {currentTheme.colors.bg.default};"
>
  <div class="mx-auto max-w-6xl space-y-6">
    <div class="flex items-center justify-between">
      <h1
        class="text-2xl font-bold"
        style="color: {currentTheme.colors.text.default};"
      >
        Theme {isEditing ? "Editor" : "Viewer"}
      </h1>
      <div class="flex gap-2">
        {#if isEditing}
          <input
            type="text"
            bind:value={themeName}
            style="
              background-color: {currentTheme.colors.bg.subtle};
              color: {currentTheme.colors.text.default};
              border: 1px solid {currentTheme.colors.border.default};
              padding: 0.75rem;
              border-radius: 0.5rem;
            "
            placeholder="Theme name"
          />
          <button
            onclick={copyThemeToClipboard}
            style="
              background-color: {currentTheme.colors.brand.primary};
              color: {currentTheme.colors.text.inverse};
              padding: 0.75rem 1rem;
              border-radius: 0.5rem;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            "
          >
            <Icon icon="material-symbols:content-copy" />
            Copy Theme
          </button>
        {:else}
          <div class="flex gap-2">
            <select
              bind:value={selectedTheme}
              onchange={() => selectTheme(selectedTheme)}
              style="
                background-color: {currentTheme.colors.bg.subtle};
                color: {currentTheme.colors.text.default};
                border: 1px solid {currentTheme.colors.border.default};
                padding: 0.75rem;
                border-radius: 0.5rem;
              "
            >
              {#each Object.keys(themes) as theme}
                <option value={theme}>{theme}</option>
              {/each}
            </select>
            <button
              onclick={startEditing}
              style="
                background-color: {currentTheme.colors.brand.primary};
                color: {currentTheme.colors.text.inverse};
                padding: 0.75rem 1rem;
                border-radius: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
              "
            >
              <Icon icon="material-symbols:edit" />
              Customize Theme
            </button>
          </div>
        {/if}
      </div>
    </div>

    <div class="grid grid-cols-12 gap-6">
      <!-- Theme Editor -->
      <div class="col-span-8 space-y-4">
        <div class="flex flex-wrap gap-2">
          {#each sections as section}
            <button
              onclick={() => (selectedSection = section.key)}
              style="
                background-color: {selectedSection === section.key
                ? currentTheme.colors.brand.primary
                : currentTheme.colors.bg.subtle};
                color: {selectedSection === section.key
                ? currentTheme.colors.text.inverse
                : currentTheme.colors.text.default};
                padding: 0.5rem 1rem;
                border-radius: 0.5rem;
              "
            >
              {section.label}
            </button>
          {/each}
        </div>

        <div
          class="rounded-lg p-6 shadow-sm"
          style="
            background-color: {currentTheme.colors.bg.subtle};
            border: 1px solid {currentTheme.colors.border.default};
          "
        >
          <div class="mb-4">
            <h3
              class="text-lg font-semibold"
              style="color: {currentTheme.colors.text.default};"
            >
              {sections.find((s) => s.key === selectedSection)?.label}
            </h3>
            <p style="color: {currentTheme.colors.text.muted};">
              {sections.find((s) => s.key === selectedSection)?.description}
            </p>
          </div>

          <div class="grid gap-6">
            {#each Object.entries(currentTheme.colors[selectedSection]) as [key, value]}
              <div class="flex items-center gap-4">
                <div class="flex-1">
                  <label
                    for="color-{key}"
                    class="mb-1 block text-sm font-medium capitalize"
                    style="color: {currentTheme.colors.text.default};"
                    >{key}</label
                  >
                  <div class="flex gap-2">
                    <input
                      id="color-{key}"
                      type="color"
                      {value}
                      disabled={!isEditing}
                      oninput={(e) =>
                        updateColor(
                          selectedSection,
                          key,
                          e.currentTarget.value
                        )}
                      class="h-10 w-full cursor-pointer rounded"
                      style="border: 1px solid {currentTheme.colors.border
                        .default};"
                    />
                  </div>
                </div>
                <div class="w-32">
                  <div
                    class="h-10 rounded"
                    style="
                      background-color: {value};
                      border: 1px solid {currentTheme.colors.border.default};
                    "
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="col-span-4 space-y-4">
        <div
          class="rounded-lg p-6 shadow-sm"
          style="
            background-color: {currentTheme.colors.bg.subtle};
            border: 1px solid {currentTheme.colors.border.default};
          "
        >
          <h3
            class="mb-4 text-lg font-semibold"
            style="color: {currentTheme.colors.text.default};"
          >
            Preview
          </h3>

          <div class="space-y-6">
            <!-- Brand Colors -->
            <div>
              <h4
                class="mb-2 text-sm font-medium"
                style="color: {currentTheme.colors.text.default};"
              >
                Brand Colors
              </h4>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <div
                    class="mb-1 h-12 rounded"
                    style="background-color: {currentTheme.colors.brand
                      .primary};"
                  ></div>
                  <span
                    class="text-xs"
                    style="color: {currentTheme.colors.text.muted};"
                    >Primary</span
                  >
                </div>
                <div>
                  <div
                    class="mb-1 h-12 rounded"
                    style="background-color: {currentTheme.colors.brand
                      .secondary};"
                  ></div>
                  <span
                    class="text-xs"
                    style="color: {currentTheme.colors.text.muted};"
                    >Secondary</span
                  >
                </div>
              </div>
            </div>

            <!-- Background Colors -->
            <div>
              <h4
                class="mb-2 text-sm font-medium"
                style="color: {currentTheme.colors.text.default};"
              >
                Background Colors
              </h4>
              <div class="grid grid-cols-2 gap-2">
                {#each Object.entries(currentTheme.colors.bg) as [key, value]}
                  <div>
                    <div
                      class="mb-1 h-12 rounded"
                      style="background-color: {value};"
                    ></div>
                    <span
                      class="text-xs"
                      style="color: {currentTheme.colors.text.muted};"
                    >
                      {key}
                    </span>
                  </div>
                {/each}
              </div>
            </div>

            <!-- Component Examples -->
            <div>
              <h4
                class="mb-2 text-sm font-medium"
                style="color: {currentTheme.colors.text.default};"
              >
                Component Examples
              </h4>
              <div class="space-y-4">
                <!-- Button Examples -->
                <div class="space-y-2">
                  <button
                    style="
                      background-color: {currentTheme.colors.brand.primary};
                      color: {currentTheme.colors.text.inverse};
                      padding: 0.5rem 1rem;
                      border-radius: 0.5rem;
                      width: 100%;
                    "
                  >
                    Primary Button
                  </button>
                  <button
                    style="
                      background-color: {currentTheme.colors.brand.secondary};
                      color: {currentTheme.colors.text.inverse};
                      padding: 0.5rem 1rem;
                      border-radius: 0.5rem;
                      width: 100%;
                    "
                  >
                    Secondary Button
                  </button>
                  <button
                    style="
                      background-color: transparent;
                      color: {currentTheme.colors.brand.primary};
                      border: 1px solid {currentTheme.colors.brand.primary};
                      padding: 0.5rem 1rem;
                      border-radius: 0.5rem;
                      width: 100%;
                    "
                  >
                    Outline Button
                  </button>
                </div>

                <!-- Input Examples -->
                <div class="space-y-2">
                  <input
                    type="text"
                    placeholder="Default Input"
                    style="
                      background-color: {currentTheme.colors.bg.subtle};
                      color: {currentTheme.colors.text.default};
                      border: 1px solid {currentTheme.colors.border.default};
                      padding: 0.5rem 1rem;
                      border-radius: 0.5rem;
                      width: 100%;
                    "
                  />
                  <input
                    type="text"
                    placeholder="Error Input"
                    style="
                      background-color: {currentTheme.colors.bg.subtle};
                      color: {currentTheme.colors.text.default};
                      border: 1px solid {currentTheme.colors.state.error};
                      padding: 0.5rem 1rem;
                      border-radius: 0.5rem;
                      width: 100%;
                    "
                  />
                </div>

                <!-- Card Examples -->
                <div class="space-y-2">
                  <div
                    style="
                      background-color: {currentTheme.colors.bg.subtle};
                      border: 1px solid {currentTheme.colors.border.default};
                      padding: 1rem;
                      border-radius: 0.5rem;
                    "
                  >
                    <h5 style="color: {currentTheme.colors.text.default};">
                      Card Title
                    </h5>
                    <p style="color: {currentTheme.colors.text.muted};">
                      This is a sample card with some content.
                    </p>
                  </div>
                  <div
                    style="
                      background-color: {currentTheme.colors.brand.primary};
                      padding: 1rem;
                      border-radius: 0.5rem;
                    "
                  >
                    <h5 style="color: {currentTheme.colors.text.inverse};">
                      Accent Card
                    </h5>
                    <p
                      style="color: {currentTheme.colors.text
                        .inverse}; opacity: 0.8"
                    >
                      Card with brand background.
                    </p>
                  </div>
                </div>

                <!-- Alert Examples -->
                <div class="space-y-2">
                  <div
                    style="
                      background-color: {currentTheme.colors.state.error}20;
                      border: 1px solid {currentTheme.colors.state.error};
                      color: {currentTheme.colors.state.error};
                      padding: 0.75rem;
                      border-radius: 0.5rem;
                    "
                  >
                    Error Alert Example
                  </div>
                  <div
                    style="
                      background-color: {currentTheme.colors.state.success}20;
                      border: 1px solid {currentTheme.colors.state.success};
                      color: {currentTheme.colors.state.success};
                      padding: 0.75rem;
                      border-radius: 0.5rem;
                    "
                  >
                    Success Alert Example
                  </div>
                  <div
                    style="
                      background-color: {currentTheme.colors.state.warning}20;
                      border: 1px solid {currentTheme.colors.state.warning};
                      color: {currentTheme.colors.state.warning};
                      padding: 0.75rem;
                      border-radius: 0.5rem;
                    "
                  >
                    Warning Alert Example
                  </div>
                  <div
                    style="
                      background-color: {currentTheme.colors.state.info}20;
                      border: 1px solid {currentTheme.colors.state.info};
                      color: {currentTheme.colors.state.info};
                      padding: 0.75rem;
                      border-radius: 0.5rem;
                    "
                  >
                    Info Alert Example
                  </div>
                </div>

                <!-- Badge Examples -->
                <div class="flex gap-2">
                  <span
                    style="
                      background-color: {currentTheme.colors.brand.primary};
                      color: {currentTheme.colors.text.inverse};
                      padding: 0.25rem 0.75rem;
                      border-radius: 9999px;
                      font-size: 0.875rem;
                    "
                  >
                    Primary Badge
                  </span>
                  <span
                    style="
                      background-color: {currentTheme.colors.bg.emphasis};
                      color: {currentTheme.colors.text.inverse};
                      padding: 0.25rem 0.75rem;
                      border-radius: 9999px;
                      font-size: 0.875rem;
                    "
                  >
                    Secondary Badge
                  </span>
                  <span
                    style="
                      border: 1px solid {currentTheme.colors.border.emphasis};
                      color: {currentTheme.colors.text.default};
                      padding: 0.25rem 0.75rem;
                      border-radius: 9999px;
                      font-size: 0.875rem;
                    "
                  >
                    Outline Badge
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
