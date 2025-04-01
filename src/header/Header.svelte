<script>
    import { onMount } from 'svelte';
    import Bpm from './utils/Bpm.svelte';
    import Brush from './utils/Brush.svelte';
    import LoopSelector from './utils/LoopSelector.svelte';
    import Midi from './utils/Midi.svelte';
    import Play from './utils/Play.svelte';
    import ProjectList from './utils/ProjectList.svelte';
    import TimeSignature from './utils/TimeSignature.svelte';

    let user = true;

    // 화면 변경 감지
    let width = 0;

    const updateWidth = () => {
        width = window.innerWidth;
        console.log(width)
    };

    onMount(() => {
        updateWidth();
        window.addEventListener("resize", updateWidth);

        return () => window.removeEventListener("resize", updateWidth);
    });
</script>

<div id="header">
    <div id="left">
        <Bpm />
        {#if width > 570} <TimeSignature /> {/if}
        {#if width > 730} <Play /> {/if}
        {#if width > 1315} <Brush /> {/if}
        {#if width > 1315} <Midi /> {/if}
    </div>

    {#if width > 380}
        {#if user}
            <div id="myPage">
                <div id="icon">
                    <object type="image/svg+xml" data="/icons/mdi_home.svg"/>
                </div>
            </div>
        {:else}
            <div id="login">
                로그인
            </div>
        {/if}
    {/if}

    <div id="right">
        <ProjectList />
        {#if width > 1170} <LoopSelector /> {/if}
    </div>
</div>


<style>
    #header {
        width: calc(100% - 50px); /* 패딩 값 빼야함 */
        height: 36px; /* 50 - 14 */
        z-index: 10;

        padding: 7px 25px 7px 25px;

        background: #333333;

        display: flex;
        justify-content: space-between;
        flex-direction: row;

        position: fixed;

        user-select: none;
    }

    #left, #right {
        display: inline-flex;
        justify-content: space-between;
        flex-direction: row;

        gap: 10px;
    }

    /* not global */

    #login {
        width: 86px;
        height: 36px;

        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;

        font-size: 20px;
        font-weight: 800;

        background: #d9d9d9;
    }

    #myPage {
        width: 86px;
        height: 36px;

        display: flex;
        justify-content: center;
        align-items: center;

        background: #d9d9d9;
    }

    #icon {
        width: 24px;
        height: 24px;
    }
</style>