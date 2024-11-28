<script>
    import { channel } from '../../../store.js'

    const pitch = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

    const ls = Array.from({ length:84 }).map((_, i) => numberToPitch(i))

    function numberToPitch(num) {
        num = 83 - num;
        return pitch[num % 12] + (Math.floor(num / 12) + 1)
    }
</script>

<div id="field">
    {#each ls as item}
        <div class="line"
             data-pitch={item}
        >
            {item}
        </div>
    {/each}
</div>

<style>
    #field {
        width: 100%;

        top: 35px;
        left: 165px;

        display: inline-block;
        position: absolute;

    }

    .line {
        height: 25px;
        width: 100%; /*임시*/

        border-top: #111111 1px solid;

        box-sizing: border-box;
    }
</style>