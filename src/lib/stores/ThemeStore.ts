import themes from '$lib/themes';
import { writable } from 'svelte/store';

const ThemeStore = writable(themes.default);

export default ThemeStore;
