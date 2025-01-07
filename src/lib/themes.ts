// Semantic color system
export type SemanticColors = {
  // Brand colors
  brand: {
    primary: string;
    secondary: string;
  };
  // Background colors
  bg: {
    default: string; // Main background
    subtle: string; // Subtle backgrounds, like cards
    muted: string; // Muted backgrounds
    emphasis: string; // Emphasized backgrounds
  };
  // Text colors
  text: {
    default: string; // Main text
    muted: string; // Secondary text
    subtle: string; // Subtle text
    inverse: string; // Text on dark backgrounds
  };
  // Border colors
  border: {
    default: string; // Default borders
    subtle: string; // Subtle borders
    emphasis: string; // Emphasized borders
  };
  // State colors
  state: {
    error: string;
    warning: string;
    success: string;
    info: string;
  };
};

export type Theme = {
  colors: SemanticColors;
};

// Base theme
const baseTheme: Theme = {
  colors: {
    brand: {
      primary: "#171717",
      secondary: "#404040",
    },
    bg: {
      default: "#FFFFFF",
      subtle: "#F5F5F5",
      muted: "#E5E5E5",
      emphasis: "#171717",
    },
    text: {
      default: "#171717",
      muted: "#737373",
      subtle: "#A3A3A3",
      inverse: "#FFFFFF",
    },
    border: {
      default: "#E5E5E5",
      subtle: "#F5F5F5",
      emphasis: "#171717",
    },
    state: {
      error: "#EF4444",
      warning: "#F59E0B",
      success: "#22C55E",
      info: "#3B82F6",
    },
  },
};

// Dark theme
const darkTheme: Theme = {
  colors: {
    brand: {
      primary: "#F5F5F5",
      secondary: "#A3A3A3",
    },
    bg: {
      default: "#171717",
      subtle: "#262626",
      muted: "#404040",
      emphasis: "#F5F5F5",
    },
    text: {
      default: "#F5F5F5",
      muted: "#A3A3A3",
      subtle: "#737373",
      inverse: "#171717",
    },
    border: {
      default: "#404040",
      subtle: "#262626",
      emphasis: "#F5F5F5",
    },
    state: {
      error: "#EF4444",
      warning: "#F59E0B",
      success: "#22C55E",
      info: "#3B82F6",
    },
  },
};

// Example of how components would use these colors:
/*
Button Primary:
  background: colors.brand.primary
  text: colors.text.inverse
  hover: colors.brand.secondary

Button Secondary:
  background: colors.bg.subtle
  text: colors.text.default
  hover: colors.bg.muted

Input:
  background: colors.bg.subtle
  border: colors.border.default
  text: colors.text.default
  focus-border: colors.brand.primary

Card:
  background: colors.bg.subtle
  border: colors.border.default
  text: colors.text.default
  text-secondary: colors.text.muted

Alert Error:
  background: colors.state.error + "10"
  border: colors.state.error
  text: colors.state.error
*/

const espressoTheme: Theme = {
  colors: {
    brand: {
      primary: "#3C2218", // Rich espresso brown
      secondary: "#967259", // Creamy coffee
    },
    bg: {
      default: "#FDF8F4", // Warm cream
      subtle: "#F5E6E0", // Light latte
      muted: "#E8D3C8", // Muted coffee
      emphasis: "#2C1810", // Dark roast
    },
    text: {
      default: "#2C1810", // Dark roast
      muted: "#967259", // Creamy coffee
      subtle: "#BE9B89", // Light coffee
      inverse: "#FDF8F4", // Warm cream
    },
    border: {
      default: "#E8D3C8", // Muted coffee
      subtle: "#F5E6E0", // Light latte
      emphasis: "#3C2218", // Rich espresso
    },
    state: {
      error: "#D64545", // Warm red
      warning: "#E6A35C", // Caramel
      success: "#4E8D7C", // Sage green
      info: "#7C90A0", // Cool grey
    },
  },
};

const matchaTheme: Theme = {
  colors: {
    brand: {
      primary: "#89A66B", // Matcha green
      secondary: "#B3C4A1", // Soft matcha
    },
    bg: {
      default: "#F8FAF6", // Rice paper white
      subtle: "#EFF3EA", // Bamboo light
      muted: "#E5EBD9", // Soft tea
      emphasis: "#3E4A33", // Dark bamboo
    },
    text: {
      default: "#2C3327", // Deep moss
      muted: "#687A54", // Forest green
      subtle: "#98A889", // Sage
      inverse: "#F8FAF6", // Rice paper white
    },
    border: {
      default: "#E5EBD9", // Soft tea
      subtle: "#EFF3EA", // Bamboo light
      emphasis: "#89A66B", // Matcha green
    },
    state: {
      error: "#D45D79", // Sakura red
      warning: "#E4B062", // Golden tea
      success: "#7AA07B", // Fresh bamboo
      info: "#8BA7BC", // Mountain mist
    },
  },
};

const themes: Record<string, Theme> = {
  default: baseTheme,
  dark: darkTheme,
  espresso: espressoTheme,
  matcha: matchaTheme,
};

export default themes;
