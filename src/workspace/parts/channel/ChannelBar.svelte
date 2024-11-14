<script>
    import { channel } from '../../../store.js'
    import Channel from '../../../class/Channel'
    import ChannelComp from './Channel.svelte'

    let channels = $state([new Channel()]) // @type { Channel[] }

    function deleteChannel(event) {
        channels.find(i => i.trackId === event.detail.value).deleteId()
        if ($channel.trackId === event.detail.value) {
            $channel = {};
        }
        channels = channels.filter((val) => val.trackId !== event.detail.value);
    }

    function selectChannel(event) {
        if(channels.find(val => val.trackId === event.detail.value.trackId)) { // 이벤트 버블링 해결 못함. 그래서 확인하고 데이터 삽입
            $channel = event.detail.value;
        }
    }
</script>

<div id="channels">
    <button onclick={() => channels = [...channels, new Channel()]}>+</button>
    {#each channels as value, i}
        <div
                id={($channel.trackId === value.trackId) ? 'selected' : null}
        >
            <ChannelComp
                    channel={value} iter={i} selected={$channel.trackId === value.trackId}
                    on:delete={deleteChannel} on:select={selectChannel}
            ></ChannelComp>
        </div>
    {/each}

</div>

<style>
    #channels {
        width: 120px; /* 125 */

        border-top: #00000099 solid 5px;
        border-right: #00000099 solid 5px;
        border-bottom: #00000099 solid 5px;

        overflow: scroll;

        background: #999999;
    }

    #channels > #selected {
        background: aqua;
    }

    #channels::-webkit-scrollbar {
        display: none;
    }
</style>