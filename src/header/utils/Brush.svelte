<script>
    import { onMount } from 'svelte';
    import { brush } from '../../store.js';


    function reverseBrush() {
        $brush = !$brush
    }

    onMount(() => {
        const fun = (e) => {
            if (e.key === 'b' || e.key === 'B') reverseBrush()
        }

        window.addEventListener('keydown', fun)

        return () => {
            window.removeEventListener('keydown', fun)
        }
    })
</script>

<div id="brush"
     on:click={reverseBrush}
>
    <div id="icon"
         class:on={$brush}
    >
        <object type="image/svg+xml" data="/icons/ic_sharp-brush.svg"></object>
    </div>
</div>

<style>
    #brush {
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