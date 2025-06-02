<script lang="ts">
    import { onMount } from 'svelte';
    import { tick, setPosition, isPlaying, timeSignature, beatsPerMeasure, ticksPerBeat, pause, tickToPixel, pixelToTick } from '../../../store.ts';
    import { CELL_WIDTH, BAR_HEIGHT, BASE_MARGIN_LEFT } from './constants.js';
    export let canvasWidth;

    // 플레이바 크기 및 위치 상수 (imported from constants.js)
    const cellWidth = CELL_WIDTH;
    const barHeight = BAR_HEIGHT;
    const baseMarginLeft = BASE_MARGIN_LEFT;

    // 캔버스 및 렌더링 변수
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let marginLeft = baseMarginLeft;
    let mounted = false;
    let animationFrameId;

    // 다시 그리기가 필요한지 추적하는 플래그
    let needsRedraw = true;

    // 현재 위치로 플레이바 렌더링
    function drawPlayBar() {
        if (!ctx) return;
        if (!mounted) return;

        // 필요한 경우에만 다시 그리기
        if (needsRedraw) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 틱 값을 기반으로 위치 계산 (중앙화된 함수 사용)
            const currentPosition = tickToPixel($tick, cellWidth);

            // 재생 위치 라인 그리기
            ctx.beginPath();
            ctx.moveTo(currentPosition, 0);
            ctx.lineTo(currentPosition, barHeight);
            ctx.strokeStyle = '#33ccff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 현재 시간 표시
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';
            ctx.fillText(
                `${$timeSignature.bar}.${$timeSignature.beat}.${$timeSignature.sixteenth}`, 
                currentPosition + 5, 
                30
            );

            // 그리기 후 플래그 재설정
            needsRedraw = false;
        }

        animationFrameId = requestAnimationFrame(drawPlayBar);
    }

    // 다시 그리기를 요청하는 함수
    function requestRedraw() {
        needsRedraw = true;
    }

    // 스크롤 위치가 변경될 때 플레이바 위치 업데이트
    function updateMarginOnScroll() {
        marginLeft = -window.scrollX + baseMarginLeft;
        requestRedraw();
    }

    // 드래그 상태 변수
    let isDragging = false;

    // 재생 위치를 변경하기 위한 캔버스 클릭 처리
    function handleCanvasClick(e: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // 클릭 위치를 틱으로 변환 (중앙화된 함수 사용)
        const newTick = pixelToTick(x, cellWidth);

        // 이미 틱 값 설정을 처리하는 setPosition 사용
        setPosition(newTick);

        // 재생 중이면 재생 중지
        if ($isPlaying) {
            pause();
        }

        requestRedraw();
    }

    // 드래그 시작 처리
    function handleMouseDown(e: MouseEvent) {
        isDragging = true;
        // 초기 클릭 위치 설정 (드래그 시작)
        handleCanvasClick(e);

        // 드래그 중 이벤트 캡처를 위해 document에 이벤트 리스너 추가
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    // 드래그 중 처리
    function handleMouseMove(e: MouseEvent) {
        if (!isDragging) return;

        // 마우스 위치에 따라 플레이바 위치 업데이트
        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, canvas.width));

        const newTick = pixelToTick(x, cellWidth);

        // 재생 중이면 재생 중지 (드래그 시작 시 항상 재생 중지)
        if ($isPlaying) {
            pause();
        }

        // 위치 업데이트
        setPosition(newTick);
        requestRedraw();
    }

    // 드래그 종료 처리
    function handleMouseUp() {
        isDragging = false;

        // 이벤트 리스너 제거
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);

        requestRedraw();
    }

    // 틱 값이 변경될 때 플레이바 다시 그리기
    $: {
        $tick;
        $timeSignature;
        if (mounted) requestRedraw();
    }

    // canvasWidth prop이 변경될 때 캔버스 너비 업데이트
    $: {
        canvasWidth;
        if (mounted && canvas) {
            canvas.width = canvasWidth;
            requestRedraw();
        }
    }

    // beatsPerMeasure와 ticksPerBeat 변경 감시
    $: {
        $beatsPerMeasure;
        $ticksPerBeat;
        if (mounted) requestRedraw();
    }

    onMount(() => {
        mounted = true;

        // 캔버스 초기화
        ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('캔버스 컨텍스트 로딩에 실패했습니다');
            return;
        }
        canvas.width = canvasWidth;
        canvas.height = barHeight;
        requestRedraw();
        drawPlayBar();

        // 이벤트 리스너 추가
        window.addEventListener('scroll', updateMarginOnScroll);
        canvas.addEventListener('mousedown', handleMouseDown);

        // 컴포넌트 언마운트 시 정리
        return () => {
            mounted = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            window.removeEventListener('scroll', updateMarginOnScroll);
            canvas.removeEventListener('mousedown', handleMouseDown);
            // 드래그 중 언마운트 시 document 이벤트 리스너도 제거
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
    });
</script>

<div id="play-bar-container">
    <canvas 
        id="play-bar"
        bind:this={canvas} 
        width={canvasWidth}
        height={barHeight}
        style="width: {canvasWidth}px; margin-left: {marginLeft}px;"
    ></canvas>
</div>

<style>
    #play-bar-container {
        height: 30px;
        z-index: 2;
        display: inline-block;
        position: fixed;
        top: 50px;
    }

    #play-bar {
        height: 100%;
        display: inline-block;
        cursor: pointer;
    }
</style>
