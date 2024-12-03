<script>
    import { channel } from '../../../store.js'

    const pitch = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

    const ls = Array.from({ length:84 }).map((_, i) => numberToPitch(i))

    function numberToPitch(num) {
        num = 83 - num;
        return pitch[num % 12] + (Math.floor(num / 12) + 1)
    }

    function pitchToNumber(midi) {
        return 83 - ((midi.substring(midi.length - 1) - 1) * 12 + pitch.indexOf(midi.substring(0, midi.length - 1)))
    }
</script>

<div id="field">
    <div id="lineContainer">
            {#each ls as item}
            <div class="line"
                 data-pitch={item}
            >
                {item}
            </div>
        {/each}
    </div>
    <div id="blocks">
        {#each $channel.notes as note}
            <div
                    style={`
                    width: ${125 * note.duration}px;
                    margin-top: ${25 * pitchToNumber(note.midi)}px;
                    margin-left: ${125 * note.time}px;
                    `}
            ></div>
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