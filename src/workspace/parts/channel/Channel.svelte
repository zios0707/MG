<script>
    export let channel, iter, selected;
    import { onMount, createEventDispatcher } from 'svelte';

    const dispatcher = createEventDispatcher();

    let mutemode = false
    let solomode = false

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
    </script>

<div
        class="channel"
        id={(selected) ? 'selected' : null}
        onclick={pickChannel}
        ondblclick={selectChannel}
>
    <div id="status"></div>

    {#if channel}
        <div id="text">{channel.name.replace('#', iter)} </div>
    {/if}

    <div id="buttons">
        <button
                id="mute"
                class:on={mutemode}
                onclick={() => mutemode = !mutemode}
        >
            {#if mutemode}
                <object type="image/svg+xml" data="/icons/mdi_alphabet-m-red.svg"></object>
            {:else}
                <object type="image/svg+xml" data="/icons/mdi_alphabet-m.svg"></object>
            {/if}
        </button>
        <button
                id="solo"
                class:on={solomode}
                onclick={() => solomode = !solomode}
        >

            {#if solomode}
                <object type="image/svg+xml" data="/icons/mdi_alphabet-s-blue.svg"></object>
            {:else}
                <object type="image/svg+xml" data="/icons/mdi_alphabet-S.svg"></object>
            {/if}
        </button>
    </div>
</div>

<style>
    .channel {
        width: 94px; /* 108 - 8 - 6 */
        height: 168px; /* 182 - 8 - 6 */

        margin-bottom: 10px;

        padding: 3px;

        display: inline-flex;
        flex-direction: column;
        gap: 3px;

        background: #444444;
        border: #000000cc solid 4px;
    }

    .channel#selected {
        border: #39b5cc solid 4px;
    }

    #text {
        height: 116px;
        width: 94px;

        font-size: 12px;
        font-weight: 900;
        color: white
    }

    #status {
        width: 94px;
        height: 6px;

        background: #00ff0033;

        box-shadow: inset 0 0 0 1px #00ff0082;
    }

    #buttons {
        height: auto;

        display: flex;

        justify-content: space-evenly;
        align-items: center;

        gap: 4px;
    }

    #buttons > button {
        width: 46px;
        height: 40px;

        display: inline-flex;
        align-items: center;
        justify-content: center;

        background: #d9d9d9;
    }

    #buttons > button.on {

        background: #aaaaaa;
    }

    button * {
        pointer-events: none;
    }

    .on svg {
        background: white;
        fill: #ff0000;
    }

    #solo.on svg {
        background: white;
        fill: #0000ff;
    }
</style>