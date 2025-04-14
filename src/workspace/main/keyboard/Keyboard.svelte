<script>
    import { onMount } from 'svelte';

    const piano = Array.from({length: 7});
    const pitch = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    let keyboard;

    function isBlackNote(pitch) {
        return pitch.length === 2;
    }

    function playSound(event) {
        const target = event.target;

        if (target.classList.contains('txt')) {
            // 뭐고 이거
            const pitch = target.textContent + target.parentNode.parentNode.parentNode.firstChild.textContent;

            console.log(pitch)
        }
    }

    function setReverse(event) {
        const hexBg = (event.target.parentNode.classList.contains('black')) ?
            '#222222' : '#dddddd';

        event.target.style.color = hexBg;
    }

    function revertReverse(event) {
        event.target.style.color = 'transparent';
    }

    onMount(() => {
        // keyboard tracking set
        function trackingX() {
            keyboard.style.marginLeft = `${window.scrollX}px`;
        }

        window.addEventListener('scroll', trackingX);

        return () => {
            window.removeEventListener('scroll', trackingX);
        }
    })

</script>

<div id="keyboard" bind:this={keyboard} on:click={playSound}>
    {#each piano as _, i}
        <div class="piano">
            <span id="rootTxt">
                {7 - i}
            </span>
            <div id="keyContainer">
                {#each pitch.reverse() as item}
                    <div class:white={!isBlackNote(item)}
                        class:black={isBlackNote(item)}
                    >
                        <p class="txt"
                        on:mouseover={setReverse}
                        on:mouseout={revertReverse}>{item}</p>
                    </div>
                {/each}
            </div>
        </div>
    {/each}
</div>

<style>
    #keyboard {
        width: 95px;
        z-index: 1;

        padding-left: 70px;

        margin-top: 35px;
        margin-bottom: 50px;

        display: inline-flex;
        flex-direction: column;

        position: sticky;

        user-select: none;

        background: #aaaaaa;
    }

    .piano {
        width: 100%;

        display: inline-flex;
    }

    #rootTxt {
        top: 5px;
        left: 5px;
    }

    #keyContainer {
        width: 100%;

        display: inline-flex;
        justify-content: end;
        flex-direction: column;
    }

    #keyContainer > div {
        height: 25px;
        width: inherit;

        border-top: #111111 1px solid;

        box-sizing: border-box;
    }

    #keyContainer > div > .txt {
        height: 100%;

        margin: 0;

        color: transparent;

        filter: invert(1);

        position: relative;
    }

    #keyContainer > .white {
        background: #ddddddcc;
    }

    #keyContainer > .black{
        background: #222222cc;
    }
</style>