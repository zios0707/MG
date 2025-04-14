<script>
    import { channel } from '../../../store.js';
    import Note from '../../../class/Note.svelte.js'
    export let pitch;

    import { onMount } from 'svelte'
    const DEFAULT_DIVISION = 125 / 4;

    let marks, elements;

    function addNote(e) {
        $channel.notes.push(
            new Note(
                e.target.dataset.idx / 4,
                1 / 4,
                pitch,
                100
            )
        )
    }

    onMount(() => {
        const childCount = Math.floor(marks.offsetWidth / DEFAULT_DIVISION);
        elements = Array.from({ length: childCount }, () => ({}));
    })
</script>

<div
        bind:this={marks}
        id="marks"
>
    {#each elements as _, i}
        <div
                data-idx={i}

                class="mark"

                on:dblclick={addNote}
        >
        </div>
    {/each}
</div>

<style>
    #marks {
        height: 100%;
        width: 100%;
    }

    .mark {
        height: 100%;
        width: 31.25px; /* 125 / 4 = 31.25 */

        display: inline-block;

        position: relative;

        border-left: #40404010 2px dashed;

        box-sizing: border-box;
    }
</style>