<script>
    import { channel } from '../../../store.js'

    // TODO mute나 solo 버튼 및 여러 구성요소 구현
</script>

<div id="info">
    {#if $channel.trackId !== undefined}
        <input type="text" id="name" autocomplete="off"
               onclick={(e) => e.stopPropagation()}
               onblur={(e) => channel.update(chan => {
                   chan.name = e.target.value
                   return chan;
               })}
               value={$channel.name}
        >
        <div>{$channel.volume}</div>
    {:else}
        <div>please select channel!</div>
    {/if}
</div>

<style>
    #info {
        width: 160px;
        height: 100%;
        z-index: 9;

        margin-left: 125px;

        position: fixed;

        background: #999999;
    }

    #info > input {
        width: 90%;
        background: transparent;
    }
</style>