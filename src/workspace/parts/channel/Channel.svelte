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
        width: 80%; /* 80% + 6px */
        height: 155px;

        margin-top: 6px;
        margin-left: calc(10% - 3px);

        display: inline-flex;
        flex-direction: column;

        border: #000000cc solid 3px;
    }

    .channel#selected {
        border: #00ffffcc solid 3px;
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