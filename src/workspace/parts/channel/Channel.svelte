<script>
    export let channel, iter, selected;
    import { onMount, createEventDispatcher } from 'svelte';
    import { log, project } from '../../../store.ts';

    const dispatcher = createEventDispatcher();

    // functions

    function deleteChannel(e) {
        e.stopPropagation();
        if (channel) {
            dispatcher('delete', { value: channel.trackId});
        }
    }

    function selectChannel() {
        if (channel) {
            dispatcher('select', { value: channel});
        }
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
        id={(selected && channel) ? 'selected' : null}
        on:click={pickChannel}
        on:dblclick={selectChannel}
>
    <div id="status"></div>

    {#if channel}
        <div id="text">{channel.name.replace('#', iter)} </div>
    {/if}

    <div id="buttons">
        <button
                id="mute"
                class:on={channel?.mute}
                on:click={() => {
                    if (channel) {
                        const newMuteValue = !channel.mute;
                        channel.mute = newMuteValue;

                        // Log the update
                        const thisLog = {
                            oper: "UPDATE", 
                            type: "TRACK",
                            project: $project?.id, 
                            track: channel.trackId, 
                            note: null, 
                            payload: { mute: newMuteValue }
                        };
                        log.update(ls => ls.concat(thisLog));
                    }
                }}
        >
            {#if channel?.mute}
                <object type="image/svg+xml" data="/icons/mdi_alphabet-m-red.svg"></object>
            {:else}
                <object type="image/svg+xml" data="/icons/mdi_alphabet-m.svg"></object>
            {/if}
        </button>
        <button
                id="solo"
                class:on={channel?.solo}
                on:click={() => {
                    if (channel) {
                        const newSoloValue = !channel.solo;
                        channel.solo = newSoloValue;

                        // Log the update
                        const thisLog = {
                            oper: "UPDATE", 
                            type: "TRACK",
                            project: $project?.id, 
                            track: channel.id,
                            note: null, 
                            payload: { solo: newSoloValue }
                        };
                        log.update(ls => ls.concat(thisLog));
                    }
                }}
        >

            {#if channel?.solo}
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

        background: #00ff0031;

        box-shadow: inset 0 0 0 1px #00ff0080;
    }

    /* BUTTON */

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
</style>
