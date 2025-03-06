<script>
    import { onMount } from 'svelte';

    let properties;

    onMount(() => {
        function trackingX() {
            properties.style.marginLeft = `${-window.scrollX + 165}px`;
        }

        window.addEventListener('scroll', trackingX);

        return () => {
            window.removeEventListener('scroll', trackingX);
        }
    });

    // TODO channel 불러올 시 velocity import, 그리고 반응성 추가
</script>

<div id="container">
    <div id="block"></div>
    <div id="properties" bind:this={properties}> <!-- velocity -->
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci alias amet doloremque eveniet ex facere id non numquam, quis ratione saepe, tenetur ullam vero, voluptate voluptates. Eos laudantium rem vitae.
    </div>
</div>

<style>
    #container {
        height: 50px;
        width: inherit;
        z-index: 8;

        padding-left: 290px;

        display: flex;
        position: fixed;

        left: 0;
        bottom: 0;
    }

    #block {
        width: 165px;
        height: 100%;

        display: inline-block;
        position: fixed;

        flex-shrink: 0;

        background: #999999;
    }

    #properties {
        height: 100%;
        width: 100%;
        z-index: -1;

        margin-left: 165px;

        display: flex;

        background: #cccccc;
    }
</style>