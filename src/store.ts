import { writable, derived, get } from 'svelte/store';
import Channel from './class/Channel.svelte.js';
import Note from './class/Note.svelte.js';
import Project from './class/Project.svelte.js';

// 기본 상태 저장소
export const midi = writable(false);
export const brush = writable(false);
export const loop = writable(false);
export const loopStart = writable(0); // Loop start time in ticks (0.0.0)
export const loopEnd = writable(4); // Loop end time in ticks (0.1.0)
export const isShiftOn = writable(false);
export const selectedNotes = writable(/** @type {import('./class/Note.svelte.js').default[]} */ ([]));
export const channel = writable(/** @type {Channel|null} */ (null)); // 채널 ID 저장소
export const AuthStatus = {
  NONE : 0,
  SIGNUP : 1,
  MY_PAGE : 2,
  LOGIN : 3
}
export const authStatus = writable(AuthStatus.NONE);
export const user = writable(/** @type {{accountId:string}|null} */ (null));
export const isLoading = writable(false); // Loading state for API requests
export const log = writable(/** @type {{oper:string,type:string,project:string,track:string,note:number,payload:{}}.default[]} */ ([]));
export const project = writable(/** @type {Project|null} */ (null))
export const projectList = writable(/** @type {Project[]} */ ([]));

// 재생 관련 저장소
export const isPlaying = writable(false);
export const bpm = writable(120);
export const tick = writable(0);
export const elapsedSeconds = writable(0);

// 박자표 관련 저장소 (기본값 4/4 박자)
export const beatsPerMeasure = writable(4);  // 한 마디당 박자 수 (기본값 4)
export const ticksPerBeat = writable(4);     // 한 박자당 틱 수 (기본값 4)

// 한 마디당 틱 수를 계산하는 파생 저장소
export const ticksPerMeasure = derived(
  [beatsPerMeasure, ticksPerBeat],
  ([$beatsPerMeasure, $ticksPerBeat]) => $beatsPerMeasure * $ticksPerBeat
);

// 박자표 표시를 위한 파생 저장소
export const timeSignature = derived(
  [tick, ticksPerMeasure, ticksPerBeat],
  ([$tick, $ticksPerMeasure, $ticksPerBeat]) => {
    const totalTicks = Math.floor($tick);

    // 틱을 마디, 박자, 하위 틱으로 변환
    const measure = Math.floor(totalTicks / $ticksPerMeasure);
    const remainingTicks = totalTicks % $ticksPerMeasure;
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
let playbackStartedInLoop = false;

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

  // 시작 틱이 루프 영역 내에 있는지 확인
  const loopStartTick = get(loopStart);
  const loopEndTick = get(loopEnd);
  playbackStartedInLoop = get(loop) && startTick >= loopStartTick && startTick < loopEndTick;

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

  // 시작 틱이 루프 영역 내에 있는지 확인
  const loopStartTick = get(loopStart);
  const loopEndTick = get(loopEnd);
  playbackStartedInLoop = get(loop) && newTick >= loopStartTick && newTick < loopEndTick;

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
    let currentTick = elapsed / (60000 / currentBpm);

    // 루프 기능이 활성화되어 있고, 재생이 루프 영역 내에서 시작되었으며, 현재 틱이 루프 종료 지점을 넘었는지 확인
    if (get(loop) && get(isPlaying) && playbackStartedInLoop && currentTick >= get(loopEnd)) {
      // 루프 시작 지점으로 돌아가기
      const loopStartTick = get(loopStart);

      // 재생을 중지하고 모든 정리 함수 호출
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

      play(loopStartTick);
      return; // play 함수가 새로운 updateTick 호출을 시작하므로 여기서 종료
    }

    tick.set(currentTick);
    elapsedSeconds.set(elapsed / 1000);

    if (get(isPlaying)) {
      updateTick();
    }
  });
}

// 비반응형 컨텍스트에서 ticksPerMeasure 값을 가져오는 함수
export function getTicksPerMeasure() {
  return get(beatsPerMeasure) * get(ticksPerBeat);
}

// 픽셀 위치를 틱으로 변환하는 함수
export function pixelToTick(pixelX, cellWidth) {
  const tpm = get(ticksPerMeasure);
  return (pixelX / cellWidth) * (tpm / 16);
}

// 틱을 픽셀 위치로 변환하는 함수
export function tickToPixel(tickValue, cellWidth) {
  const tpm = get(ticksPerMeasure);
  return tickValue * (cellWidth / (tpm / 16));
}
