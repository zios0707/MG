import {writable} from 'svelte/store'
    
export let isPlaying = writable(false);
export let bpm = writable(120);
export let tick = writable(0);
export let channels = writable([]); // Channel[]