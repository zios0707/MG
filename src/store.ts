import { writable, derived, get } from 'svelte/store';
import Channel from './class/Channel.svelte.js';
import Note from './class/Note.svelte.js';

// 기본 상태 저장소
export const midi = writable(false);
export const brush = writable(false);
export const isShiftOn = writable(false);
export const selectedNotes = writable(/** @type {import('./class/Note.svelte.js').default[]} */ ([]));
export const channel = writable(/** @type {Channel|null} */ (null)); // 채널 ID 저장소

// 재생 관련 저장소
export const isPlaying = writable(false);
export const bpm = writable(120);
export const tick = writable(0);
export const elapsedSeconds = writable(0);

// 박자표 관련 저장소 (기본값 4/4 박자)
export const beatsPerMeasure = writable(4);  // 한 마디당 박자 수 (기본값 4)
export const ticksPerBeat = writable(4);     // 한 박자당 틱 수 (기본값 4)

// 박자표 표시를 위한 파생 저장소
export const timeSignature = derived(
  [tick, beatsPerMeasure, ticksPerBeat],
  ([$tick, $beatsPerMeasure, $ticksPerBeat]) => {
    const totalTicks = Math.floor($tick);

    // 틱을 마디, 박자, 하위 틱으로 변환
    const ticksPerMeasure = $beatsPerMeasure * $ticksPerBeat;

    const measure = Math.floor(totalTicks / ticksPerMeasure);
    const remainingTicks = totalTicks % ticksPerMeasure;
    const beat = Math.floor(remainingTicks / $ticksPerBeat);
    const remainingSubTicks = remainingTicks % $ticksPerBeat;

    return {
      bar: measure,
      beat,
      sixteenth: remainingSubTicks
    };
  }
);

// 재생 제어 변수
let startTimestamp = 0;
let rafId;

// pause가 호출될 때 실행될 정리 함수들을 저장하는 배열
const pauseCleanupFunctions = [];

// pause가 호출될 때 실행될 정리 함수를 등록하는 함수
export function registerPauseCleanup(cleanupFn) {
  pauseCleanupFunctions.push(cleanupFn);
  // 정리 함수 등록 해제를 위한 함수 반환
  return () => {
    const index = pauseCleanupFunctions.indexOf(cleanupFn);
    if (index !== -1) {
      pauseCleanupFunctions.splice(index, 1);
    }
  };
}

// 재생 시작 함수
export function play(startTick = get(tick)) {
  // 특정 지점부터 재생할 수 있도록 시작 시간 조정
  startTimestamp = performance.now() - (startTick * (60000 / get(bpm)));
  tick.set(startTick); // 시작 틱 설정
  isPlaying.set(true);
  updateTick();
}

// 재생 중지 함수
export function pause() {
  isPlaying.set(false);
  if (rafId) cancelAnimationFrame(rafId);

  // 등록된 모든 정리 함수 호출
  pauseCleanupFunctions.forEach(cleanupFn => {
    try {
      cleanupFn();
    } catch (error) {
      console.error('정리 함수 실행 중 오류:', error);
    }
  });
}

// 위치 설정 함수
export function setPosition(newTick) {
  tick.set(newTick);
  if (get(isPlaying)) {
    // 재생 중인 경우, 새 위치에서 다시 시작
    startTimestamp = performance.now() - (newTick * (60000 / get(bpm)));
  }
}

// 틱 업데이트 함수 (requestAnimationFrame 사용)
function updateTick() {
  rafId = requestAnimationFrame(() => {
    const now = performance.now();
    const currentBpm = get(bpm);

    // 경과 시간(ms)을 틱으로 변환
    // 틱 = 경과 시간(ms) / (60000ms / BPM)
    const elapsed = now - startTimestamp;
    const currentTick = elapsed / (60000 / currentBpm);

    tick.set(currentTick);
    elapsedSeconds.set(elapsed / 1000);

    if (get(isPlaying)) {
      updateTick();
    }
  });
}
