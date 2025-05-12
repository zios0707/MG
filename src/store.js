import {writable} from 'svelte/store'

export let midi = writable(false);
export let brush = writable(false);

export let isPlaying = writable(false);
export let bpm = writable(120);
export let tick = writable(0);
export let channel = writable({}); // @type Channel // 빈 객체의 경우 null 과 같이 취급! (trackId 가 존재 X)

export let isShiftOn = writable(false);
export let selectedNotes = writable([]); // @type Note[] //