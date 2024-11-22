<script>
    import { onMount } from 'svelte'
    import { channel } from '../../../store.js'
    import Channel from '../../../class/Channel'
    import ChannelComp from './Channel.svelte'

    let channels = $state([new Channel()]) // @type { Channel[] }
    let pickedList = $state([])

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

    function pickChannel(event) {
        if (event.detail.value.shifted) {
            if (pickedList[0] > event.detail.value.iter) pickedList = [event.detail.value.iter, pickedList[0]];
            else pickedList = [pickedList[0], event.detail.value.iter];

            console.log(pickedList)
        }else {
            pickedList = [event.detail.value.iter]
        }
    }

    function addDragging(comp) {
        console.log('drag start')
        comp.classList.add('dragging')
    }

    function removeDragging(comp) {
        console.log('drag end')
        comp.classList.remove('dragging')
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            console.log(offset)
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child }
            } else {
                return closest
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element
    }

</script>

<div id="channels" ondragover={(e) => {
    e.preventDefault()

    const afterElement = getDragAfterElement(e.target, e.clientY);
    const draggable = document.querySelector('.dragging')
}}>
    <button onclick={() => channels = [...channels, new Channel()]}>+</button>
    {#each channels as value, i}
        <div
                class="draggable"
                class:pick={pickedList[0] === i || pickedList[0] <= i && i <= pickedList[1]}
                draggable={pickedList[0] === i || pickedList[0] <= i && i <= pickedList[1]}
                ondragstart={(e) => addDragging(e.target)}
                ondragend={(e) => removeDragging(e.target)}
        >
            <ChannelComp
                    ondragover={e => {
                        e.stopPropagation()
                        // e.currentTarget.parentElement.dispatchEvent(new DragEvent('dragover', event))
                    }}
                    channel={value} iter={i} selected={$channel.trackId === value.trackId}
                    on:delete={deleteChannel} on:select={selectChannel} on:pick={pickChannel}
            ></ChannelComp>
        </div>
    {/each}

</div>

<style>
    #channels {
        width: 120px;
        height: 100%;
        z-index: 9;
        overflow: scroll;

        position: fixed;

        background: #999999;
        user-select: none;
    }

    #channels > .pick {
        background: #00ffff55;
    }

    #channels::-webkit-scrollbar {
        display: none;
    }
</style>