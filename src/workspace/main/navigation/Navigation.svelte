<script>
    import { onMount } from 'svelte';

    let navigation;

    onMount(() => {
        function trackingX() {
            navigation.style.marginLeft = `${-window.scrollX}px`;
        }

        window.addEventListener('scroll', trackingX);

        return () => {
            window.removeEventListener('scroll', trackingX);
        }
    })
</script>

<div id="block"></div>

<div id="navigation" bind:this={navigation}>
    <div id="container">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque dolor dolores enim eos error, eum expedita in ipsa libero molestias odio quaerat quasi repellat repellendus saepe sunt veritatis. Expedita, mollitia!
    </div>
</div>

<style>
    #navigation {
        height: 35px;
        width: inherit;

        z-index: 1;

        position: fixed;

        background: #cccccc;
    }

    #navigation > #container {
        height: 100%;

        margin-left: 165px;

        display: inline-block;
    }

    #block {
        width: 165px;
        height: 35px;

        z-index: 8;

        display: inline-block;

        position: fixed;

        background: #999999;
    }
</style>