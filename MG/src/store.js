import {writable} from 'svelte/store'

export let isPlaying = writable(false);
export let BPM = writable(120);
export let Tick = writable(0);