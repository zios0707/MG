<script lang="ts">
    import { onMount } from 'svelte';
    import { channel, selectedNotes } from '../../../store.js';
    import Note from '../../../class/Note.svelte.js';

    // Grid cell sizing
    const cellWidth = 125; // px per beat
    const cellHeight = 25;
    const rows = 84;
    const totalHeight = cellHeight * rows;

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let canvasWidth = 0;

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

    // Drag & resize state
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

    // Bulk width increments
    let prevBeats = 0;
    $: {
        const notes = $channel.notes;
        const maxTime = notes.length ? Math.max(...notes.map(n=>n.time+n.duration)) : 0;
        const beats = Math.max(4, Math.ceil((maxTime+1)/4)*4);
        if (beats!==prevBeats) {
            prevBeats=beats;
            canvasWidth = beats*cellWidth;
            if(canvas) canvas.width=canvasWidth;
        }
    }

    function draw(){
        if(!ctx) return;
        ctx.clearRect(0,0,canvasWidth,totalHeight);
        drawGrid();
        drawNotes();
        if (dragType == 'drag') drawDrag()

        requestAnimationFrame(draw);
    }

    function drawGrid(){
        ctx.strokeStyle='#ccc';
        for(let r=0;r<=rows;r++){
            const y=r*cellHeight;
            ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvasWidth,y);ctx.stroke();
        }
        const cols=Math.ceil(canvasWidth/cellWidth);
        for(let c=0;c<=cols;c++){
            const x=c*cellWidth;
            ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,totalHeight);ctx.stroke();
        }
    }

    function drawNotes(){
        $channel.notes.forEach(drawSingleNote);
    }

    function drawSingleNote(note: Note) {
        const x=note.time*cellWidth;
        const y=pitchToNumber(note.midi)*cellHeight;
        const w=note.duration*cellWidth;
        const h=cellHeight-2;
        ctx.fillStyle=$selectedNotes.includes(note)?'rgba(0,123,255,0.5)':'rgba(255,255,255,0.5)';
        ctx.fillRect(x,y,w,h);
        ctx.strokeStyle=$selectedNotes.includes(note)?'#007bff':'#333';
        ctx.strokeRect(x,y,w,h);
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
        ctx=canvas.getContext('2d');
        draw();

        window.addEventListener('scroll', trackingScrollX)
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
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
            draw();
            return;
        }

        channel.update(ch=>{

            for (const ctx of originalContexts){
                const {note, time, duration, row} = ctx;
                const dx=(x-anchorX) / cellWidth;

                if (dragType === 'move') {
                    const dy=(y-anchorY) / cellHeight;
                    note.time=Math.max(0,time+dx);
                    const newRow=Math.max(0,Math.min(rows,row+Math.round(dy)));
                    note.midi=numberToPitch(newRow);
                } else if(dragType === 'resize-right'){
                    note.duration = Math.max(0.1, dx + duration);
                } else if(dragType === 'resize-left'){
                    note.time=Math.max(0, Math.min(time+dx, time+duration - 0.1));
                    if (note.time !== 0) note.duration=Math.max(0.1,duration-dx);
                }

                drawSingleNote(note)
            }
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
                        aggregated.push(it);
                    }
                });
                setSelectedNotes(Array.from(aggregated));
            }

            currentX = 0; currentY = 0;

            dragType=null;
            draw()
        }
    }

    function handleDblclick(e:MouseEvent){
        const {x,y}=getMousePos(e);
        const idx=hitTest(x,y);


        // 만져지지 않았으니 새로 생성
        if (idx === -1) {

            const dx=x/cellWidth;
            const dy=y/cellHeight;

            const newNote = new Note(Math.max(0,dx - 0.25), 0.5, numberToPitch(Math.max(0,Math.min(rows,Math.round(dy - 0.5)))))

            channel.update((ch) => {
                ch.notes.push(newNote);

                return ch;
            })

            drawSingleNote(newNote)
            setSelectedNotes([newNote])
        }else {
            channel.update((ch) => {
                ch.notes.splice(idx, 1);

                return ch;
            })

            draw()
        }
    }


    function handleClick(e:MouseEvent) {
        const {x, y} = getMousePos(e);
        const idx = hitTest(x, y);
        if (idx < 0) {
            if (dragBox) {dragBox = false; return}
            if (dragType) return
            setSelectedNotes([])
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
                    })

                    return ch
                });

                $selectedNotes = []
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
    canvas{margin-top:35px;display:inline-block;position:absolute;}
</style>
