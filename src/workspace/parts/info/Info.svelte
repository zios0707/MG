<script>
    import { channel } from '../../../store.js'

    // TODO mute나 solo 버튼 및 여러 구성요소 구현
</script>

<div id="info">
    {#if $channel.trackId !== undefined}
        <div>{$channel.name}</div>
        <div>{$channel.volume}</div>
    {:else}
        <div>please select channel!</div>
    {/if}
</div>

<style>
    #info {
        width: 160px; /* 165px */

        border-top: #00000099 solid 5px;
        border-right: #00000099 solid 5px;
        border-bottom: #00000099 solid 5px;

        background: #999999;
    }
</style>