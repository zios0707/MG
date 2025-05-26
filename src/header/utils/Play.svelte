<script>
    import { isPlaying, channel, bpm, setPosition, tick, play as storePlay, pause as storePause, registerPauseCleanup } from '../../store.ts';
    import { onDestroy } from 'svelte';
    import * as Tone from 'tone';

    let synth;

    // BPM에 따른 시간 변환 유틸리티 함수
    function timeOnBpm(time) {
        return time * 60 / $bpm;
    }

    // 오디오 재생 함수
    export function play(startTime = $tick) {
        if (!$channel) return;

        // 기존 synth 정리 (이 함수는 직접 호출해야 함 - 재생 시작 전에 필요)
        cleanupSynth();

        // isPlaying은 이제 storePlay에 의해 설정됨
        const now = Tone.now();
        synth = new Tone.PolySynth().toDestination();

        // 현재 시간 이후의 노트만 재생
        $channel.notes
            .filter(note => note.time >= startTime)
            .forEach(note => {
                synth.triggerAttackRelease(
                    note.midi,
                    timeOnBpm(note.duration),
                    now + timeOnBpm(note.time - startTime),
                    note.velocity / 127
                );
            });
    }

    export function pause() {
        // 스토어의 pause 함수가 cleanupSynth를 호출하므로 여기서는 storePause만 호출
        storePause();
    }

    function cleanupSynth() {
        if (synth) {
            synth.dispose();
            synth = null;
        }
    }

    // UI 이벤트 핸들러
    function handlePlay() {
        if (!$channel) return;

        if (!$isPlaying) {
            storePlay($tick); // 틱을 업데이트하기 위해 스토어의 play 함수 호출
            play($tick);      // 오디오를 위한 로컬 play 함수 호출
        } else {
            pause();
        }
    }

    function handleStop() {
        storePause(); // 스토어의 pause 함수가 cleanupSynth를 호출
        setPosition(0); // 위치를 처음으로 재설정
    }

    // 키보드 단축키 설정
    function setupKeyboardShortcuts() {
        let lastEscTime = 0;

        const handleKeydown = (e) => {
            if (e.key === ' ') {
                e.preventDefault();
                handlePlay();
            } else if (e.key === 'Escape') {
                const currentTime = Date.now();
                if (currentTime - lastEscTime < 500) { // 0.5초 이내에 두 번째 ESC 키 감지
                    handleStop();
                }
                lastEscTime = currentTime;
            }
        };

        window.addEventListener('keydown', handleKeydown);

        // onDestroy를 위한 정리 함수 반환
        return () => window.removeEventListener('keydown', handleKeydown);
    }

    // cleanupSynth 함수를 스토어에 등록
    const unregisterCleanup = registerPauseCleanup(cleanupSynth);

    // 키보드 단축키 설정 및 컴포넌트 소멸 시 정리
    const keyboardCleanup = setupKeyboardShortcuts();

    // BPM 변경 감지를 위한 변수
    let previousBpm = $bpm;

    // 재생 중 BPM 변경시 (오직 BPM 변경에만 반응)
    $: if ($bpm !== previousBpm && $isPlaying) {
        storePause() // 포지션은 초기화되면 안됨

        // 다시 재생
        storePlay($tick);
        play($tick);

        // 현재 BPM 값 저장
        previousBpm = $bpm;
    }

    onDestroy(() => {
        keyboardCleanup();
        unregisterCleanup();
    });
</script>

<div id="play-container">
    <div id="component">
        <div class="control-btn" title="녹음">
            <object type="image/svg+xml" data="/icons/mdi_record.svg"></object>
        </div>

        <div class="control-btn" on:click={handlePlay} title={$isPlaying ? "일시정지" : "재생"}>
            <object 
                type="image/svg+xml" 
                data={$isPlaying 
                    ? "/icons/material-symbols_pause.svg" 
                    : "/icons/carbon_triangle-right-solid.svg"}
            ></object>
        </div>

        <div class="control-btn" on:click={handleStop} title="정지">
            <object type="image/svg+xml" data="/icons/material-symbols_stop.svg"></object>
        </div>
    </div>
</div>

<style>
    #play-container {
        width: 150px;
        height: 36px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background: #a9a9a9;
    }

    #component {
        height: 24px;
        display: flex;
        gap: 24px;
    }

    .control-btn {
        width: 24px;
        height: 24px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .control-btn:hover {
        opacity: 0.8;
    }
</style>
