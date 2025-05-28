<script lang="ts">
    import { onMount } from 'svelte';
    import { setPosition, beatsPerMeasure, ticksPerBeat, pause, isPlaying } from '../../../store.ts';
    export let canvasWidth;

    const cellWidth = 125;
    const barHeight = 30;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let mounted = false;
    let focus = false;

    let marginLeft = 165;

    // ESC 키 연속 입력 감지를 위한 변수
    let lastEscTime = 0;
    const doubleEscDelay = 500; // 연속 입력 간격(ms)

    // 캔버스가 변경될 때 필요한 로직은 onMount에서 처리합니다.

    // 다시 그리기가 필요한지 추적하는 플래그
    let needsRedraw = true;

    // canvasWidth 변경 감시
    $: {
        canvasWidth;
        if (mounted) requestRedraw();
    }

    // beatsPerMeasure와 ticksPerBeat 변경 감시
    $: {
        $beatsPerMeasure;
        $ticksPerBeat;
        if (mounted) requestRedraw();
    }

    function draw() {
        if(!ctx) return;
        if(!mounted) return;

        // 필요한 경우에만 다시 그리기
        if (needsRedraw) {
            ctx.clearRect(0,0,canvasWidth,35);

            ctx.save();
            ctx.fillStyle='#5A5A5A';
            ctx.fillRect(0,0,canvasWidth,35);
            ctx.restore();

            drawGrid();

            // 그리기 후 플래그 재설정
            needsRedraw = false;
        }

        requestAnimationFrame(draw);
    }

    // 다시 그리기를 요청하는 함수
    function requestRedraw() {
        needsRedraw = true;
    }

    function drawGrid() {
        // 그리드를 그릴 최대 인덱스 계산 (canvasWidth 픽셀을 cellWidth로 나눈 값)
        const maxGrids = Math.ceil(canvasWidth / cellWidth);

        for (let i = 0; i < maxGrids; i++) {
            // 그리드 위치 계산
            const x = i * cellWidth;

            if (i % 4 === 0) {
                drawBigGrid(i);

                // 텍스트 설정 및 그리기
                ctx.font = 'bold 16px "Pretendard", black';
                ctx.textAlign = 'center';       // left, right, center, start, end
                ctx.textBaseline = 'middle';    // top, hanging, middle, alphabetic, bottom 등
                ctx.fillStyle = 'white';

                // 마디.비트 형식으로 표시
                ctx.fillText(`${Math.floor(i / 4)}.${i % 4}`, x + 20, 10);
            } else {
                drawSmallGrid(i);
            }
        }
    }

    function drawBigGrid(idx: number) { // 큰 글씨로 1, 2, 3 이런거
        const x=idx*cellWidth;

        ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,20);
        ctx.strokeStyle = "#A9A9A9";
        ctx.stroke();

    }

    function drawSmallGrid(idx: number) { // 작은 포인트 표시
        const x=idx*cellWidth;

        ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,12);
        ctx.strokeStyle = "#A9A9A9";
        ctx.stroke();

    }

    // 타임라인 클릭 시 해당 위치로 이동
    function handleCanvasClick(e: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // 클릭한 위치를 tick으로 변환
        const ticksPerMeasure = $beatsPerMeasure * $ticksPerBeat;
        const clickedTick = (x / (cellWidth)) * (ticksPerMeasure / 16);

        // 위치 설정
        setPosition(clickedTick);
        requestRedraw();
    }

    // ESC 키를 한번 누르면 재생을 멈추고, 빠르게 두 번 누르면 시간이 처음으로 돌아가는 함수
    function handleKeyDown(e: KeyboardEvent) {
        if (focus && e.key === 'Escape') {
            const now = Date.now();

            if (now - lastEscTime < doubleEscDelay) {
                // ESC가 연속으로 두 번 눌렸을 때
                setPosition(0);
                requestRedraw();
            } else {
                // ESC가 한 번 눌렸을 때 재생 중이면 멈춤
                if ($isPlaying) {
                    pause();
                }
            }

            lastEscTime = now;
        }
    }

    onMount(() => {
        mounted = true;

        ctx=canvas.getContext('2d');
        requestRedraw();
        draw();

        function trackingX() {
            marginLeft = -window.scrollX + 165;
            requestRedraw();
        }

        window.addEventListener('scroll', trackingX);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            mounted = false;
            window.removeEventListener('scroll', trackingX);
            window.removeEventListener('keydown', handleKeyDown);
        }
    })
</script>

<div id="block"></div>

<div id="container">
    <canvas
            id="navigation"
            width={canvasWidth}
            height="30"
            style="width: {canvasWidth}px; margin-left: {marginLeft}px;"
            tabindex="0"
            bind:this={canvas}
            on:click={handleCanvasClick}
            on:focus={() => focus = true}
            on:blur={() => focus = false}
    />
</div>

<style>
    #container {
        height: 30px;
        z-index: 1;
        display: inline-block;
        position: fixed;
    }

    #navigation {
        height: 100%;
        margin-left: 165px;
        display: inline-block;
        cursor: pointer;
    }

    #block {
        width: 165px;
        height: 30px;
        z-index: 8;
        display: inline-block;
        position: fixed;
        background: #999999;
    }
</style>
