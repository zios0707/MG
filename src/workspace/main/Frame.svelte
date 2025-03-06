<script>
    import { onMount } from 'svelte';
    import { isShiftOn } from '../../store.js';

    import Keyboard from './keyboard/Keyboard.svelte';
    import Navigation from './navigation/Navigation.svelte';
    import Properties from './properties/Properties.svelte';
    import Field from './field/Field.svelte';
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

<div id="Frame">
    <Navigation/>
    <Properties/>
    <Keyboard/>
    <Field/>
    <LoopStation/>
</div>

<style>
    #Frame {
        width: 1000vw;

        margin-left: 290px;

        position: absolute;

        background: #888888;
    }
</style>