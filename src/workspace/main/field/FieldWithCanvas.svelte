<script lang="ts">
    import { onMount } from 'svelte';
    import {channel, selectedNotes, log, project} from '../../../store.ts';
    import Note from '../../../class/Note.svelte.js';
    export let canvasWidth

    // 그리드 셀 크기 설정
    const cellWidth = 125; // 비트당 픽셀
    const cellHeight = 25;
    const rows = 84;
    const totalHeight = cellHeight * rows;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let animationFrameId;

    const pitchNames = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

    function numberToPitch(idx: number): string {
        const semitone = 83 - idx;
        const name = pitchNames[semitone % 12];
        const octave = Math.floor(semitone/12)+1;
        return `${name}${octave}`;
    }

    function pitchToNumber(p: string): number {
        const name = p.slice(0,-1);
        const octave = parseInt(p.slice(-1));
        const semitone = (octave-1)*12 + pitchNames.indexOf(name);
        return 83 - semitone;
    }

    // 드래그 & 크기 조절 상태
    let dragType: 'move' | 'resize-left' | 'resize-right' | 'drag' | null = null;

    let anchorX = 0;
    let anchorY = 0;
    let originalTime = 0;
    let originalDuration = 0;
    let originalRow = 0;
    let originalRight = 0; // pixel X of note end

    let originalContexts = []

    let currentX = 0;
    let currentY = 0;

    let shift = false;
    let focus = false;
    let dragBox = false;
    let mounted = false;

    // 너비 일괄 증가
    let prevBeats = 0;
    $: {
        const notes = $channel.notes;
        const maxTime = notes.length ? Math.max(...notes.map(n=>n.time+n.duration)) : 0;
        const beats = Math.max(4, Math.ceil((maxTime+1)/4)*4);
        if (beats!==prevBeats) {
            prevBeats=beats;
            canvasWidth = beats*cellWidth;
            if(canvas) {
                canvas.width=canvasWidth;
                requestRedraw();
            }
        }
    }

    // 다시 그리기가 필요한지 추적하는 플래그
    let needsRedraw = true;

    // 채널 노트 또는 선택된 노트의 변경 감시
    $: {
        $channel;
        $selectedNotes;
        requestRedraw();
    }

    function draw(){
        if(!ctx) return;
        if(!mounted) return;

        // 필요한 경우에만 다시 그리기
        if (needsRedraw) {
            ctx.clearRect(0,0,canvasWidth,totalHeight);
            drawGrid();
            drawNotes();
            if (dragType == 'drag') drawDrag();

            // 그리기 후 플래그 재설정
            needsRedraw = false;
        }

        animationFrameId = requestAnimationFrame(draw);
    }

    // 다시 그리기를 요청하는 함수
    function requestRedraw() {
        needsRedraw = true;
    }

    function drawGrid(){
        ctx.save();
        ctx.strokeStyle='#ccc';
        ctx.lineWidth = 1;
        for(let r=0;r<=rows;r++){
            const y=r*cellHeight;
            ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvasWidth,y);ctx.stroke();
        }
        const cols=Math.ceil(canvasWidth/cellWidth);
        for(let c=0;c<=cols;c++){
            const x=c*cellWidth;
            ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,totalHeight);ctx.stroke();
        }
        ctx.restore();
    }

    function drawNotes(){
        $channel.notes.forEach(drawSingleNote);
    }

    function drawSingleNote(note: Note) {
        ctx.save();
        const x=note.time*cellWidth;
        const y=pitchToNumber(note.midi)*cellHeight;
        const w=note.duration*cellWidth;
        const h=cellHeight-2;

        if ($selectedNotes.includes(note)) {
            ctx.fillStyle = '#39c5bb';
        } else {
            // velocity를 16진수 알파값으로 변환 (0-127 -> 00-7F)
            const alphaHex = note.velocity.toString(16).padStart(2, '0');
            // 16진수 알파값을 rgba에서 사용할 수 있는 소수점 형태로 변환 (00-7F -> 0-1)
            const alpha = parseInt(alphaHex, 16) / 255;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }
        ctx.fillRect(x,y,w,h);
        ctx.strokeStyle=$selectedNotes.includes(note)?'#007bff':'rgba(51, 51, 51, 0.75)';
        ctx.lineWidth = 2; // 노트 윤곽선을 더 굵게 설정
        ctx.strokeRect(x,y,w,h);
        ctx.restore();
    }

    function drawDrag() {
        const x = Math.min(anchorX, currentX);
        const y = Math.min(anchorY, currentY);
        const w = Math.abs(currentX - anchorX);
        const h = Math.abs(currentY - anchorY);
        ctx.save();
        ctx.strokeStyle = '#0078d7';
        ctx.fillStyle   = 'rgba(0,120,215,0.2)';
        ctx.setLineDash([4,2]);
        ctx.strokeRect(x, y, w, h);
        ctx.fillRect(x, y, w, h);
        ctx.restore();
    }

    onMount(()=>{
        mounted = true;

        ctx=canvas.getContext('2d');
        if (!ctx) {
            console.error('캔버스 컨텍스트 로딩에 실패했습니다');
            return;
        }
        requestRedraw();
        draw();

        window.addEventListener('scroll', trackingScrollX)
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            mounted = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            window.removeEventListener('scroll', trackingScrollX);
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    });

    function getMousePos(e:MouseEvent){
        const rect=canvas.getBoundingClientRect();
        return {x:e.clientX-rect.left, y:e.clientY-rect.top};
    }

    function hitTest(x:number,y:number){
        return $channel.notes.findIndex(note=>{
            const nx=note.time*cellWidth;
            const ny=pitchToNumber(note.midi)*cellHeight;
            const nw=note.duration*cellWidth;
            const nh=cellHeight;
            return x>=nx && x<=nx+nw && y>=ny && y<=ny+nh;
        });
    }

    function handleMouseDown(e:MouseEvent){
        const {x,y}=getMousePos(e);
        const idx=hitTest(x,y);

        anchorX=x; anchorY=y;
        currentX=x; currentY=y;

        if(idx<0) {
            dragType = 'drag'
            return
        }
        const note=$channel.notes[idx];

        if(!$selectedNotes.includes(note)) {
            if (shift) {
                setSelectedNotes([...$selectedNotes, note]);
            }else {
                setSelectedNotes([note])
            }
        }

        const nx=note.time*cellWidth;
        const nw=note.duration*cellWidth;
        const edge=6; // px threshold
        originalTime=note.time;
        originalDuration=note.duration;
        originalRow=pitchToNumber(note.midi);
        originalRight = nx + nw;
        if(x<nx+edge) dragType='resize-left';
        else if(x>originalRight-edge) dragType='resize-right';
        else dragType='move';


        originalContexts = $selectedNotes.map(n => ({
            note: n,
            time: n.time,
            duration: n.duration,
            row: pitchToNumber(n.midi)
        }));
    }


    function handleMouseMove(e:MouseEvent){
        if(!dragType) return;
        const {x,y}=getMousePos(e);

        if (dragType === 'drag') {
            currentX = x; currentY = y;
            dragBox = true;
            requestRedraw();
            return;
        }

        channel.update(ch=>{

            for (const ctx of originalContexts){
                const {note, time, duration, row} = ctx;
                const dx=(x-anchorX) / cellWidth;
                const thisLog = {oper:"UPDATE", type:"NOTE", project:$project.id, track:$channel.id, note:note.id, payload:{}};
                
                if (dragType === 'move') {
                    const dy=(y-anchorY) / cellHeight;
                    note.time=Math.max(0,time+dx);
                    const newRow=Math.max(0,Math.min(rows,row+Math.round(dy)));
                    note.midi=numberToPitch(newRow);
                    thisLog.payload = {time:note.time, midi:note.midi};
                } else if(dragType === 'resize-right'){
                    note.duration = Math.max(0.1, dx + duration);
                    thisLog.payload = {duration:note.duration};
                } else if(dragType === 'resize-left'){
                    note.time=Math.max(0, Math.min(time+dx, time+duration - 0.1));
                    if (note.time !== 0) note.duration=Math.max(0.1,duration-dx);
                    thisLog.payload = {time:note.time, duration:note.duration};
                }

                log.update(ls=>ls.concat(thisLog));
            }
            requestRedraw();
            return ch;
        })
    }

    function handleMouseUp(){
        if(dragType) {

            if (dragType === 'drag') {
                const x1 = (Math.min(anchorX, currentX)/cellWidth);
                const y1 = (Math.min(anchorY, currentY)/cellHeight);
                const x2 = (Math.max(anchorX, currentX)/cellWidth);
                const y2 = (Math.max(anchorY, currentY)/cellHeight);

                if (!shift) setSelectedNotes([])
                const aggregated = new Set<Note>($selectedNotes);
                $channel.notes.forEach((it, i) => {
                    // x1 <= 노트의 시작 <= x2 ||  x1 <= 노트의 끝 <= x2
                    // 노트와 시작 < x1 && x2 < 노트의 끝
                    // x1 <= 노트의 끝 && 노트의 시작 <= x2
                    if ((x1 <= (it.time + it.duration) && it.time <= x2) &&
                        (y1 - 1 <= pitchToNumber(it.midi) && pitchToNumber(it.midi) <= y2)) {
                        aggregated.add(it);
                    }
                });
                setSelectedNotes(Array.from(aggregated));
            }

            currentX = 0; currentY = 0;

            dragType=null;
            requestRedraw();
        }
    }

    function handleDblclick(e:MouseEvent){
        const {x,y}=getMousePos(e);
        const idx=hitTest(x,y);

        console.log($project.id, $channel.id)
        const thisLog = {oper:"", type:"NOTE", project:$project.id, track:$channel.id, note:crypto.randomUUID(), payload:{}};


        // 만져지지 않았으니 새로 생성
        if (idx === -1) {
            thisLog.oper="CREATE";

            const dx=x/cellWidth;
            const dy=y/cellHeight;

            const newNote = new Note(Math.max(0,dx - 0.25), 0.5, numberToPitch(Math.max(0,Math.min(rows,Math.round(dy - 0.5)))))

            thisLog.note = newNote.id;
            thisLog.payload = {time:newNote.time, midi:newNote.midi, duration:newNote.duration, velocity:newNote.velocity};
            channel.update((ch) => {
                ch.notes.push(newNote);

                return ch;
            })

            requestRedraw();
            setSelectedNotes([newNote])
        }else {
            thisLog.oper="DELETE";
            thisLog.note = $channel.notes[idx].id;

            channel.update((ch) => {
                ch.notes.splice(idx, 1);

                return ch;
            })

            requestRedraw();
        }

        log.update(ls=>ls.concat(thisLog));
    }


    function handleClick(e:MouseEvent) {
        const {x, y} = getMousePos(e);
        const idx = hitTest(x, y);
        if (idx < 0) {
            if (dragBox) {dragBox = false; return}
            if (dragType) return
            setSelectedNotes([])
            requestRedraw();
            return
        }
    }

    function trackingScrollX() {
        canvas.style.marginLeft = `${-window.scrollX}px`
    }

    function handleKeyDown(e:KeyboardEvent) {
        if (focus) {
            if (e.key === 'Delete' || e.key === 'Backspace') {

                channel.update((ch) => {
                    $selectedNotes.forEach((note) => {
                        ch.notes.splice(ch.notes.indexOf(note), 1);

                        log.update(ls=>ls.concat({oper:"DELETE", type:"NOTE", project:$project.id, track:$channel.id, note:note.id, payload:{}}));
                    })

                    return ch
                });

                $selectedNotes = []
                requestRedraw();
            }
        }

        if (e.shiftKey) shift = e.shiftKey;
    }

    function handleKeyUp(e:KeyboardEvent) {

        if (!e.shiftKey) shift = e.shiftKey;
    }

    function setSelectedNotes(notes:Note[]) {
        selectedNotes.update((ls) => {
            ls = [...notes]
            return ls
        });
        requestRedraw();
    }

</script>

<canvas
        bind:this={canvas}
        width={canvasWidth}
        height={totalHeight}
        tabindex="0"

        on:dblclick={handleDblclick}
        on:click={handleClick}
        on:mousedown={handleMouseDown}
        on:mousemove={handleMouseMove}
        on:mouseup={handleMouseUp}
        on:mouseleave={handleMouseUp}

        on:focus={() => focus = true}
        on:blur={() => focus = false}
/>

<style>
    canvas{
        margin-top:30px;
        display:inline-block;
        position:absolute;

        background: #444444;
    }
</style>
