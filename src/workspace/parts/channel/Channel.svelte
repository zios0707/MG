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

    onMount(() => {
        if (selected) {
            dispatcher
        }
    })

</script>

<div class="channel" onclick={selectChannel}>
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
</style>