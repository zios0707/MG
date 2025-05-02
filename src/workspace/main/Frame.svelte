<script>
    import { onMount } from 'svelte';
    import { isShiftOn, channel } from '../../store.js';

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
    <Navigation/>
    <Properties/>
    <Keyboard/>
    {#if $channel.trackId !== undefined} <FieldWithCanvas/> {/if}
    <LoopStation/>
</div>

<style>
    #frame {
        width: 100%;

        margin-left: 290px;

        position: absolute;

        background: #444444;
    }
</style>
