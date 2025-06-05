<script lang="ts">
    import { onMount } from 'svelte';
    import { channel, selectedNotes } from '../../../store.ts';
    import Note from '../../../class/Note.svelte.js';
    export let canvasWidth;

    const cellWidth = 125;
    const cellHeight = 25;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;

    let dragType: 'move' | 'drag' | null = null;
    let anchorY = 0;
    let originalContexts = [];

    let mounted = false;
    let shift = false;
    let focus = false;

    let marginLeft = 165;

    $: {
        if(canvas) {
        }
    }

    // 다시 그리기가 필요한지 추적하는 플래그
    let needsRedraw = true;

    // 채널 노트 또는 선택된 노트의 변경 감시
    $: {
        $channel;
        $selectedNotes;
        if (mounted) requestRedraw();
    }

    // canvasWidth 변경 감시
    $: {
        canvasWidth;
        if (mounted) requestRedraw();
    }

    function draw(){
        if(!ctx) return;
        if(!mounted) return;

        // 필요한 경우에만 다시 그리기
        if (needsRedraw) {
            ctx.clearRect(0,0,canvasWidth,50);

            ctx.save();
            ctx.fillStyle='#cccccc';
            ctx.fillRect(0,0,canvasWidth,50);
            ctx.restore();

            drawNotes();

            // 그리기 후 플래그 재설정
            needsRedraw = false;
        }

        requestAnimationFrame(draw);
    }

    // 다시 그리기를 요청하는 함수
    function requestRedraw() {
        needsRedraw = true;
    }

    onMount(() => {
        mounted = true;

        ctx=canvas.getContext('2d');
        requestRedraw();
        draw();

        function trackingX() {
            marginLeft = window.scrollX;
            requestRedraw();
        }

        function handleKeyDown(e:KeyboardEvent) {
            if (focus) {
                if (!Number.isNaN(Number(e.key))) {
                    // TODO : 숫자 입력
                }
            }

            if (e.shiftKey) shift = e.shiftKey;
        }

        function handleKeyUp(e:KeyboardEvent) {
            if (!e.shiftKey) shift = e.shiftKey;
        }

        window.addEventListener('scroll', trackingX);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            mounted = false;
            window.removeEventListener('scroll', trackingX);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    });

    function drawNotes() {
        $channel.notes.forEach(drawSingleNote);
    }

    function drawSingleNote(note: Note) {
        const x=note.time*cellWidth;
        const y=(127-note.velocity)/127*50;

        // 노트 위치 원
        ctx.beginPath();
        ctx.arc(x,y,4,0,2*Math.PI);
        ctx.lineWidth = 2;
        ctx.fillStyle=$selectedNotes.includes(note)?'#39c5bb':'#cccccc';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle=$selectedNotes.includes(note)?'#39c5bb':'black';
        ctx.stroke();
        ctx.closePath();

        // 노트 길이 선
        ctx.beginPath();
        ctx.moveTo(x + 4, y);
        ctx.lineTo(x + note.duration * cellWidth, y);
        ctx.lineWidth = 2; // 노트 길이 선을 더 굵게 설정
        ctx.stroke();

        ctx.lineWidth = 1;
    }

    function getMousePos(e:MouseEvent) {
        const rect=canvas.getBoundingClientRect();
        return {x:e.clientX-rect.left, y:e.clientY-rect.top};
    }

    function hitTest(x:number,y:number) {
        return $channel.notes.findIndex(note=>{
            const nx=note.time*cellWidth;
            const ny=(127-note.velocity)/127*50;
            const diff=6;
            return x>=nx-diff && x<=nx+diff && y>=ny-diff && y<=ny+diff;
        });
    }

    function handleClick(e:MouseEvent) {
        //TODO : 구현 예정
        requestRedraw();
    }

    function handleMouseDown(e:MouseEvent) {
        const {x, y} = getMousePos(e);
        const idx = hitTest(x, y);
        anchorY = y;

        if (idx >= 0) {
            const note=$channel.notes[idx];

            dragType = 'move'

            if(!$selectedNotes.includes(note)) {
                if (shift) {
                    setSelectedNotes([...$selectedNotes, note]);
                }else {
                    setSelectedNotes([note])
                }
            }

            originalContexts = $selectedNotes.map(n => ({
                note: n,
                velocity: n.velocity
            }))

            requestRedraw();
        }
    }

    function handleMouseMove(e:MouseEvent) {
        const {x, y} = getMousePos(e);

        if (dragType === 'move') {

            channel.update(ch => {
                for (const context of originalContexts) {
                    const {note, velocity} = context;
                    const diff = (anchorY - y) / 50 * 127


                    note.velocity = Math.min(127, Math.max(0, velocity + diff));
                }

                requestRedraw();
                return ch
            })
        }
    }

    function handleMouseUp(e:MouseEvent) {
        if (dragType) {
            dragType = null;
            requestRedraw();
        }
    }

    function setSelectedNotes(notes:Note[]) {
        selectedNotes.update((ls) => {
            ls = [...notes]
            return ls
        });
        requestRedraw();
    }
</script>

<div id="container">
    <div id="block"></div>
    <canvas
            id="properties"
            width={canvasWidth}
            height="50"
            style="width: {canvasWidth}px; margin-left: {-marginLeft + 165}px; height: 50px"
            tabindex="0"
            bind:this={canvas}
            on:click={handleClick}
            on:mousedown={handleMouseDown}
            on:mousemove={handleMouseMove}
            on:mouseup={handleMouseUp}
            on:mouseleave={handleMouseUp}
            on:focus={() => focus = true}
            on:blur={() => focus = false}
    /> <!-- velocity -->
</div>

<style>
    #container {
        height: 50px;
        z-index: 8;
        padding-left: 290px;
        display: inline-flex;
        justify-content: space-between;
        position: fixed;
        left: 0;
        bottom: 0;
    }

    #block {
        width: 165px;
        height: 100%;
        display: inline-block;
        position: fixed;
        flex-shrink: 0;
        background: #999999;
    }

    #properties {
        height: 100%;
        margin-left: 165px;
        display: inline-block;
    }
</style>
