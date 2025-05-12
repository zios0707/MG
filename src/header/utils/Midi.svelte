<script>
    import { onMount } from 'svelte';
    import { midi } from '../../store.js';


    function reverseMidi() {
        $midi = !$midi
    }

    onMount(() => {
        const fun = (e) => {
            if (e.key === 'm' || e.key === 'M') reverseMidi()
        }

        window.addEventListener('keydown', fun)

        return () => {
            window.removeEventListener('keydown', fun)
        }
    })
</script>

<div id="midi">
    <div id="icon"
         class:on={$midi}
         on:click={reverseMidi}
    >
        <object type="image/svg+xml" data="/icons/material-symbols_piano-sharp.svg"></object>
    </div>
</div>

<style>
    #midi {
        width: 64px;
        height: 36px;

        background: #a9a9a9;
    }

    #icon {
        width: 64px;
        height: 36px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    #icon.on {
        background: #eeee33;
    }

    object {
        pointer-events: none;
    }
</style>