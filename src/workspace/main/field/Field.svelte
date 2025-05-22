<script>
    import { channel, isShiftOn, selectedNotes } from '../../../store.ts';
    import Marks from './Marks.svelte'

    const pitch = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const height = 25, width = 125, quarter = width / 4, defaultLeft = 455, autoOffset = 3.5;

    const ls = Array.from({ length:84 }).map((_, i) => numberToPitch(i));

    function numberToPitch(num) {
        num = 83 - num;
        return pitch[num % 12] + (Math.floor(num / 12) + 1);
    }

    function pitchToNumber(midi) {
        return 83 - ((midi.substring(midi.length - 1) - 1) * 12 + pitch.indexOf(midi.substring(0, midi.length - 1)));
    }

    function extractNumber(px) {
        return Number(px.substring(0, px.length - 2));
    }

    function getPositionByGrid(pageX, offset, min) {
        const eLeft = pageX - offset;
        const floor = Math.floor(eLeft / quarter)

        const val = (eLeft - quarter * floor);
        return (val > quarter - autoOffset) ? Math.max(min, (floor + 1) * quarter) :
            (autoOffset > val) ? Math.max(min, (floor) * quarter) : Math.max(min, pageX - offset)
    }

    let dragging, dragTarget, currentTarget;
    let lastPitch, mainPosition, thisWidth, thisLeft;
    function dragStart(e) {
        dragTarget = e.target;
        currentTarget = e.currentTarget;
        mainPosition = e.pageX;
        thisWidth = extractNumber(e.currentTarget.style.width);
        thisLeft = extractNumber(e.currentTarget.style.left);

        dragging = true;

        lastPitch = e.currentTarget.dataset.pitch;
    }

    function dragTrackingX(e) {
        if (dragTarget.id === "") {
            currentTarget.style.left = `${getPositionByGrid(e.pageX, mainPosition - thisLeft, 0)}px`;
        }else if (dragTarget.id === "right") {
            // width 조절
            currentTarget.style.width = `${getPositionByGrid(e.pageX, thisLeft + defaultLeft, 1)}px`
        }else {
            // left 조절
            currentTarget.style.left = `${Math.min(getPositionByGrid(e.pageX, mainPosition - thisLeft, 0), thisLeft + thisWidth - 1)}px`;
            currentTarget.style.width = `${Math.min(getPositionByGrid(thisWidth - (e.pageX - mainPosition), 0, 1), thisLeft + thisWidth)}px`;
        }
    }

    function dragTrackingY(e) {
        if (dragTarget.id === "") {
            currentTarget.style.top = `${pitchToNumber(e.currentTarget.dataset.pitch) * height}px`;
            lastPitch = e.currentTarget.dataset.pitch;
        }

    }

    function confirmDrag(e) {
        dragging = false;
        const note = $channel.notes[currentTarget.dataset.idx];

        if (dragTarget.id === "") {
            const position = getPositionByGrid(e.pageX, mainPosition - thisLeft, 0)

            currentTarget.style.left = `${position}px`;

            note.time = position / width;
            note.midi = lastPitch;
        }else if (dragTarget.id === "right") {
            const position = getPositionByGrid(e.pageX, thisLeft + defaultLeft, 1);

            currentTarget.style.width = `${position}px`

            note.duration = position / width;
        }else {
            const leftPosition = Math.min(getPositionByGrid(e.pageX, mainPosition - thisLeft, 0), thisLeft + thisWidth - 1);
            const widthPosition = Math.min(getPositionByGrid(thisWidth - (e.pageX - mainPosition), 0, 1), thisLeft + thisWidth);

            currentTarget.style.left = `${leftPosition}px`;
            currentTarget.style.width = `${widthPosition}px`;

            note.time = leftPosition / width;
            note.duration = widthPosition / width;
        }
    }

    function selectBlock(e) {
        const note = $channel.notes[e.currentTarget.dataset.idx];

        // 중복 선택
        if ($selectedNotes.includes(note)) selectedNotes.update(ls => { ls.splice(ls.indexOf(note), 1); return ls; });
        // 쉬프트 | 다중 선택
        else if ($isShiftOn) selectedNotes.update(ls => [...ls, note])
        // 단일 선택
        else $selectedNotes = [note]
    }

    // TODO: dragBox (선택만 만들고 추후 기능이 만들어지면 그때그때 연계되도록 하면될듯)
</script>

<div id="field">
    {#if $channel.trackId !== undefined}
        <div id="lineContainer">
            {#each ls as item}
                <div class="line"
                     data-pitch={item}

                     on:click={() => $selectedNotes = []}
                     on:dragenter={dragTrackingY}
                >
                    <Marks pitch={item}/>
                </div>
            {/each}
        </div>
    {/if}
    <div id="dragBox"></div>
    <div id="blocks">
        {#each $channel.notes as note, i}
            <div
                    draggable="true"

                    data-idx={i}
                    data-pitch={note.midi}

                    style={`width: ${width * note.duration}px; top: ${height * pitchToNumber(note.midi)}px; left: ${width * note.time}px;`}

                    class:selected={$selectedNotes.includes(note)}

                    on:click={selectBlock}
                    on:dblclick={()=>$channel.notes.splice(i,1)}
                    on:dragstart={dragStart}
                    on:drag={dragTrackingX}
                    on:dragend={confirmDrag}
            >
                <!-- 크기 조절 반응을 위해 하위 요소 존재 -->
                <!-- ondragstart={dragStart} 기본 위치 세팅 -->
                <!-- ondrag={dragTrackingX} 계속 트래킹 -->
                <!-- line 에 ondragenter 를 넣어서 top 자동 조정 되도록 -->
                <!-- ondragend={confirmDrag} 확정 -->
                <div
                        id="left"
                        draggable="true"
                >
                </div>
                <div
                        id="right"
                        draggable="true"
                >
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    #dragBox {
        background-color: #2222ff44;
        border: 1px #1111cccc;

        display: none; /* -> inline-block */
    }

    #field {
        width: 100%;

        top: 35px;
        left: 165px;

        display: inline-block;
        position: absolute;

    }

    #lineContainer {
        width: 100%;

        position: absolute;
    }

    .line {
        height: 25px;
        width: 100%; /*임시*/

        border-top: #111111 1px solid;

        box-sizing: border-box;
    }

    #blocks {
        position: relative;
    }

    #blocks > div {
        height: 25px;

        display: inline-flex;
        justify-content: space-between;

        position: absolute;

        border: #111111 2px solid;

        box-sizing: border-box;

        background: #EEEEEE44;
    }

    #blocks > div > div {
        height: 100%;
        width: 4px;
    }
    #blocks > div > div:hover {
        cursor: e-resize;
    }

    #blocks > .selected {
        background: #AAAACC;
    }
</style>