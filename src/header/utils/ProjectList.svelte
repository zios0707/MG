<script>
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    let rotation = tweened(0, { duration: 130, easing: cubicOut });

    let isAuthed = true;
    let projectList = null;

    let openList = false;
    function toggleList() {
        if (openList) rotation.set(0)
        else rotation.set(180)

        openList = !openList;
    }

    let projectList1 = [
        {
            name: "untitled",
            id: "00000000-0000-0000-0000-000000000000"
        },
        {
            name: "projectasdas1",
            id: "00000000-0000-0000-0000-000000000000"
        },
        {
            name: "hello?",
            id: "00000000-0000-0000-0000-000000000000"
        },
        {
            name: "veryLOOOOOOONG",
            id: "00000000-0000-0000-0000-000000000000"
        }
    ];

</script>

<div id="projectList">
    {#if isAuthed}
        <div class="block"
             onclick={toggleList}

        >
            untitled
            <div id="drop">
                <object type="image/svg+xml" data="/icons/fe_drop-down.svg"
                     style="transform: rotate({$rotation}deg);"
               ></object>
            </div>
        </div>
        {#if openList}
            <div id="list">
                {#each projectList1 as project}
                    <div class="block" data-id={project.id}
                         on:click={toggleList}
                    >
                        {project.name}
                    </div>
                {/each}
            </div>
        {/if}
    {:else}
        <div class="block">
            untitled
        </div>
    {/if}
</div>

<style>
    #projectList {
        width: 150px;

        display: flex;


        flex-direction: column;

        background: #a9a9a9;
    }

    .block {
        height: 36px;
        padding: 6px 12px 0 12px;

        display: flex;
        justify-content: space-between;

        text-align: center;
        font-size: 20px;
        font-weight: 800;

        background: #a9a9a9;
    }

    #list > .block {
        width: fit-content;

    }

    .list {
        display: flex;
        flex-direction: column;
    }

    object {
        pointer-events: none;
    }

    #drop > img {
    }
</style>