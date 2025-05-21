<script lang="ts">
    import { onMount } from 'svelte';
    export let canvasWidth;

    const cellWidth = 125;
    const barHeight = 30;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let mounted = false;
    let focus = false;

    $: {
        if(canvas) canvas.width = canvasWidth;
    }

    function draw() {
        if(!ctx) return;
        if(!mounted) return;
        ctx.clearRect(0,0,canvasWidth,35);

        ctx.save();
        ctx.fillStyle='#5A5A5A';
        ctx.fillRect(0,0,canvasWidth,35);
        ctx.restore();

        drawGrid()

        requestAnimationFrame(draw);
    }

    function drawGrid() {
        for (let i = 0; i < canvasWidth / cellWidth * 4; i++) {
            if (i % 4 === 0) {
                drawBigGrid(i)
            }else {
                drawSmallGrid(i)
            }
        }
    }

    function drawBigGrid(idx: number) { // 큰 글씨로 1, 2, 3 이런거
        const x=idx*cellWidth/4;

        ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,20);
        ctx.strokeStyle = "#A9A9A9";
        ctx.stroke();

        ctx.font      = 'bold 16px "Pretendard", black';
        ctx.textAlign = 'center';       // left, right, center, start, end
        ctx.textBaseline = 'middle';    // top, hanging, middle, alphabetic, bottom 등
        ctx.fillStyle = 'white';
        ctx.fillText((idx / 4) + 1, x + 10, 10)
    }

    function drawSmallGrid(idx: number) { // 작은 포인트 표시
        const x=idx*cellWidth/4;

        ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,12);
        ctx.strokeStyle = "#A9A9A9";
        ctx.stroke();

    }

    onMount(() => {
        mounted = true;

        ctx=canvas.getContext('2d');
        draw()

        function trackingX() {
            canvas.style.marginLeft = `${-window.scrollX + 165}px`;
        }

        window.addEventListener('scroll', trackingX);

        return () => {
            mounted = false;
            window.removeEventListener('scroll', trackingX);
        }
    })
</script>

<div id="block"></div>

<div id="container">
    <canvas
            id="navigation"

            width={canvasWidth}
            height="30"

            style="width: {canvasWidth}px; height: 30px"
            tabindex="0"

            bind:this={canvas}

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