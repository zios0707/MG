<script>
    import Channel from '../../../class/Channel'
    import { channels } from '../../../store.js'
    import ChannelComp from './Channel.svelte'

    setInterval(() => {
    }, 600)

    let iter = 0;
</script>

<div id="channels">
    <button onclick={() => {channels.update(list => [...list, new Channel()])}}>add</button>
    {#each $channels as channel, i}
        <ChannelComp {channel} iter={i} ></ChannelComp>
    {/each}
</div>

<style>
    #channels {
        width: 120px; /* 122 */
        height: 100%;

        border-right: black solid 2px;

        overflow: scroll;

        background: #999999;
    }

    #channels::-webkit-scrollbar {
        display: none;
    }
</style>