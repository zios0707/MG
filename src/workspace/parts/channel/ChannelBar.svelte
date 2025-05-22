<script>
    import { channel } from '../../../store.ts';
    import Channel from '../../../class/Channel.svelte.js';
    import ChannelComp from './Channel.svelte';

    let channels = $state([new Channel()]); // @type { Channel[] }
    let pickedList = $state([]);

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
            pickedList = [event.detail.value.iter];
        }
    }

    function addDragging(comp) {
        console.log('drag start')
        comp.classList.add('dragging');
    }

    function removeDragging(comp) {
        console.log('drag end')
        comp.classList.remove('dragging');
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

<div id="channels" on:dragover={(e) => {
    e.preventDefault()

    const afterElement = getDragAfterElement(e.target, e.clientY);
    const draggable = document.querySelector('.dragging')
}}>
    {#each channels as value, i}
        <div
                class="draggable"
                class:pick={pickedList[0] === i || pickedList[0] <= i && i <= pickedList[1]}
                draggable={pickedList[0] === i || pickedList[0] <= i && i <= pickedList[1]}
                on:dragstart={(e) => addDragging(e.target)}
                on:dragend={(e) => removeDragging(e.target)}
        >
            <ChannelComp
                    on:dragover={e => {
                        e.stopPropagation()
                        // e.currentTarget.parentElement.dispatchEvent(new DragEvent('dragover', event))
                    }}
                    channel={value} iter={i} selected={$channel?.trackId === value.trackId}
                    on:delete={deleteChannel} on:select={selectChannel} on:pick={pickChannel}
            ></ChannelComp>
        </div>
    {/each}

    <button
            id="create"
            on:click={() => channels = [...channels, new Channel()]}
    >
        <img src="/icons/mdi_plus-outline.svg" alt="plus icon" />
    </button>
</div>

<style>
    #channels {
        width: 104px; /* 120px - 16px */
        height: 100vh;

        padding: 12px 8px 12px 8px;

        z-index: 9;
        overflow: scroll;

        position: fixed;

        background: #4f4f4f;
    }

    #channels > .pick {
        background: #39b5cc;
    }

    #channels::-webkit-scrollbar {
        display: none;
    }

    #create {
        width: 108px;
        height: 36px;

        margin-bottom: 82px;
        border: 4px solid #000000;

        display: inline-flex;
        align-items: center;
        justify-content: center;

        background: #444444;
    }
</style>