import {Writable, writable} from 'svelte/store';
import Channel from './class/Channel.svelte.js';
import Note from './class/Note.svelte.js';

export let midi:Writable<boolean> = writable(false);
export let brush:Writable<boolean> = writable(false);

export let isPlaying:Writable<boolean> = writable(false);
export let bpm:Writable<number> = writable(120);
export let tick:Writable<number> = writable(0);
export let channel:Writable<Channel> = writable(); // 빈 객체의 경우 null 과 같이 취급! (trackId 가 존재 X)

export let isShiftOn:Writable<boolean> = writable(false);
export let selectedNotes:Writable<Note[]> = writable([]);