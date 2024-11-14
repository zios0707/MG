<script>
    import { channels } from '../../../store.js'

    export let channel, iter;
</script>

<div class="channel">
    <button onclick={() => channels.update(list => {
        list.find(i => i.trackId === channel.trackId).deleteId()
        return list.filter((val) => val.trackId !== channel.trackId);
    })}>X</button>
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