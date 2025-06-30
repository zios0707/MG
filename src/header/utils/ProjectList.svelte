<script lang="ts">
    import { onMount } from 'svelte';
    import { project, projectList, user, log } from "../../store.ts";
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import Project from "../../class/Project.svelte";

    $: if ($user) {
        fetch('http://localhost:8081/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                accountId: $user.accountId,
                password:  $user.password
            })
        })
            .then(async res => {
                if (!res.ok) throw new Error(await res.text());
                return res.json();
            })
            .then(data => {
                // projects 필드 안에 배열이 들어있으므로
                const rawList = Array.isArray(data.projects) ? data.projects : [];
                projectList.set(rawList.map(Project.fromJson));
            })
            .catch(err => {
                console.error('fetch error', err);
            });
    }else {
        $project = new Project();
        log.update(ls => ls.concat(
            {oper:"CREATE", type:"PROJECT", project:$project.id}
        ))
    }

    let rotation = tweened(0, { duration: 130, easing: cubicOut });

    let isAuthed = true;

    let openList = false;
    function toggleList() {
        if (openList) rotation.set(0)
        else rotation.set(180)

        openList = !openList;
    }

    onMount(() => {

    })

</script>

<div id="projectList">
    {#if isAuthed}
        <div class="block"
             on:click={toggleList}

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
                {#each projectList as thisProject}
                    <div class="block" data-id={thisProject.id}
                         on:click={toggleList}
                    >
                        {thisProject.name}
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
