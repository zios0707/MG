import { writable, derived, get } from 'svelte/store';
import { Writable } from 'svelte/store';
import Channel from './class/Channel.svelte.js';
import Note from './class/Note.svelte.js';

export const midi = writable(false);
export const brush = writable(false);

export const isPlaying = writable(false);
export const bpm = writable(120);
export const tick = writable(0);
export const channel = writable(/** @type {Channel|null} */ (null)); // null인 경우 trackId가 존재하지 않음

export const isShiftOn = writable(false);
export const selectedNotes = writable(/** @type {import('./class/Note.svelte.js').default[]} */ ([]));

export const elapsedSeconds = writable(0);

// 박자 관련 설정 (4/4박자 기본값)
export const beatsPerMeasure = writable(4);  // 한 마디당 박자 수 (기본 4)
export const ticksPerBeat = writable(4);     // 한 박자당 틱 수 (기본 4)

export const timeSignature = derived(
  [tick, beatsPerMeasure, ticksPerBeat],
  ([$tick, $beatsPerMeasure, $ticksPerBeat]) => {
    const totalTicks = Math.floor($tick);

    // 틱에서 마디, 박자, 틱으로 변환
    const ticksPerMeasure = $beatsPerMeasure * $ticksPerBeat;

    const measure = Math.floor(totalTicks / ticksPerMeasure);
    const remainingTicks = totalTicks % ticksPerMeasure;

    const beat = Math.floor(remainingTicks / $ticksPerBeat);
    const remainingSubTicks = remainingTicks % $ticksPerBeat;

    return {
      measure,
      beat,
      subTick: remainingSubTicks
    };
  }
);

let startTimestamp = 0;
let rafId;

// 재생 시작 함수
export function play() {
  // 기존 tick 값에서 시작하도록 시작 시간 조정
  startTimestamp = performance.now() - (get(tick) * (60000 / get(bpm)));
  isPlaying.set(true);
  updateTick();
}

// 재생 정지 함수
export function pause() {
  isPlaying.set(false);
  if (rafId) cancelAnimationFrame(rafId);
}

// 위치 재설정 함수
export function setPosition(newTick) {
  tick.set(newTick);
  if (get(isPlaying)) {
    startTimestamp = performance.now() - (newTick * (60000 / get(bpm)));
  }
}

// 현재 틱 업데이트 함수 (requestAnimationFrame 사용)
function updateTick() {
  rafId = requestAnimationFrame(() => {
    const now = performance.now();
    const currentBpm = get(bpm);

    // 경과 시간(ms)을 틱으로 변환
    // 틱 = 경과시간(ms) / (60000ms / BPM)
    const elapsed = now - startTimestamp;
    const currentTick = elapsed / (60000 / currentBpm);

    tick.set(currentTick);
    elapsedSeconds.set(elapsed / 1000);

    if (get(isPlaying)) {
      updateTick();
    }
  });
}
