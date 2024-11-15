<script>
    export let channel, iter, selected;
    import { onMount, createEventDispatcher } from 'svelte';

    const dispatcher = createEventDispatcher();

    function deleteChannel() {
        dispatcher('delete', { value: channel.trackId})
    }

    function selectChannel() {
        dispatcher('select', { value: channel})
    }

    function pickChannel(e) {
        dispatcher('pick',
            { value: {
                iter: iter,
                shifted: e.shiftKey
            }}
        )
    }
</script>

<div class="channel" id={(selected) ? 'selected' : null} onclick={pickChannel} ondblclick={selectChannel}>
    <button onclick={deleteChannel}>X</button>
    {#if channel}
        <div> {channel.trackId} </div>
        <div> {channel.name.replace('#', iter)} </div>
    {/if}
</div>

<style>
    .channel {
        width: 80%; /* 80% + 3px */
        height: 155px;

        margin-top: 6px;
        margin-left: calc(10% - 3px);

        border: #000000cc solid 3px;
    }

    .channel#selected {

        border: #00ffffcc solid 3px;
    }
</style>