<script>
    export let channel, iter, selected;
    import { onMount, createEventDispatcher } from 'svelte';

    const dispatcher = createEventDispatcher();

    // functions

    function deleteChannel(e) {
        e.stopPropagation();
        dispatcher('delete', { value: channel.trackId});
    }

    function selectChannel() {
        dispatcher('select', { value: channel});
    }

    function pickChannel(e) {
        dispatcher('pick',
            { value:
                {
                    iter: iter,
                    shifted: e.shiftKey
                }
            }
        );
    }

    function clicked(e) {
        e.stopPropagation();
        console.log("CLICK")
    }
</script>

<div class="channel" id={(selected) ? 'selected' : null} onclick={pickChannel} ondblclick={selectChannel}>
    <button onclick={deleteChannel}>X</button>
    {#if channel}
        <div>{channel.name.replace('#', iter)} </div>
    {/if}

    <div id="buttons">
        <button id="mute" onclick={clicked}>M</button>
        <button id="solo" onclick={clicked}>S</button>
    </div>
</div>

<style>
    .channel {
        width: 100px; /* 108 - 8 */
        height: 174px; /* 182 - 8 */

        display: inline-flex;
        flex-direction: column;

        background: #444444;
        border: #000000cc solid 4px;
    }

    .channel#selected {
        border: #39b5cc solid 4px;
    }

    #buttons {
        height: auto;

        display: flex;

        justify-content: space-evenly;
        align-items: center;

        flex-grow: 1;
    }

    #buttons > button {
        width: 40px;
        height: 30px;

        border: 2px solid black;

        background: #cccccc;
    }
</style>