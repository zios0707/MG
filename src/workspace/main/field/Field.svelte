<script>
    import { channel } from '../../../store.js';

    const pitch = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const height = 25, width = 125, defaultLeft = 455;

    const ls = Array.from({ length:84 }).map((_, i) => numberToPitch(i));

    function numberToPitch(num) {
        num = 83 - num;
        return pitch[num % 12] + (Math.floor(num / 12) + 1);
    }

    function pitchToNumber(midi) {
        return 83 - ((midi.substring(midi.length - 1) - 1) * 12 + pitch.indexOf(midi.substring(0, midi.length - 1)));
    }

    let mainPosition, dragging, dragTarget;
    let lastPitch;
    function dragStart(e) {
        dragTarget = e.target
        mainPosition = e.offsetX;
        dragging = true;

        lastPitch = e.target.dataset.pitch;
    }

    function dragTrackingX(e) {
        e.target.style.left = `${Math.max(0, e.pageX - defaultLeft - mainPosition)}px`;
    }

    function dragTrackingY(e) {
        dragTarget.style.top = `${pitchToNumber(e.target.dataset.pitch) * height}px`;
        lastPitch = e.target.dataset.pitch;
    }

    function confirmDrag(e) {
        dragging = false;
        e.target.style.left = `${Math.max(0, e.pageX - defaultLeft - mainPosition)}px`;

        const note = $channel.notes[e.target.dataset.idx];

        note.time = Math.max(0, e.pageX - defaultLeft - mainPosition) / width;
        note.midi = lastPitch;
    }
</script>

<div id="field">
    {#if $channel.trackId !== undefined}
        <div id="lineContainer">
            {#each ls as item}
                <div class="line"
                     data-pitch={item}
                     ondragenter={dragTrackingY}
                >
                </div>
            {/each}
        </div>
    {/if}
    <div id="blocks">
        {#each $channel.notes as note, i}
            <div
                    draggable="true"

                    data-idx={i}
                    data-pitch={note.midi}
                    data-time={note.time}

                    style={`
                    width: ${width * note.duration}px;
                    top: ${height * pitchToNumber(note.midi)}px;
                    left: ${width * note.time}px;
                    `}
                    ondragstart={dragStart}
                    ondrag={dragTrackingX}
                    ondragend={confirmDrag}
            >
                <!-- ondragstart={dragStart} 기본 위치 세팅 -->
                <!-- ondrag={dragTrackingX} 계속 트래킹 -->
                <!-- line 에 ondragenter 를 넣어서 top 자동 조정 되도록 -->
                <!-- ondragend={confirmDrag} 확정 -->
            </div>
        {/each}
    </div>
</div>

<style>
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

        display: inline-block;

        position: absolute;

        background: #00000044;
    }
</style>