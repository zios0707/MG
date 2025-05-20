<script>
    import { onMount } from 'svelte';
    import { isShiftOn, channel } from '../../store.js';

    let canvasWidth = 0;

    import Keyboard from './keyboard/Keyboard.svelte';
    import Navigation from './navigation/Navigation.svelte';
    import Properties from './properties/Properties.svelte';
    import Field from './field/Field.svelte';
    import FieldWithCanvas from './field/FieldWithCanvas.svelte';
    import LoopStation from './loopStation/LoopStation.svelte';

    onMount(() => {
        function flipShift(e) {
            if (e.key === 'Shift') $isShiftOn = e.shiftKey;
        }

        document.addEventListener('keydown', flipShift);
        document.addEventListener('keyup', flipShift);

        return () => {
            document.removeEventListener('keydown', flipShift);
            document.removeEventListener('keyup', flipShift);
        }
    });
</script>

<div id="frame">
    {#if $channel.trackId !== undefined}
        <Navigation/>
        <Properties bind:canvasWidth={canvasWidth} />
        <Keyboard/>
        <FieldWithCanvas bind:canvasWidth={canvasWidth}/>
        <LoopStation/>
    {/if}
</div>

<style>
    #frame {
        width: 100%;
        margin-left: 290px;

        position: absolute;
        display: inline-block;
        background: #444444;
    }
</style>
