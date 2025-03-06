<script>
    import StartAndStop from './utils/Play.svelte';
    import Bpm from './utils/Bpm.svelte';
    import TimeSignature from './utils/TimeSignature.svelte';

    // TODO 루프 스테이션
</script>

<div id="header">
    <Bpm />
    <StartAndStop />
    <TimeSignature />
</div>


<style>
    #header {
        width: 100%;
        height: 58px;
        z-index: 10;

        background: #666666;

        display: inline-flex;
        flex-direction: row;

        position: fixed;

        user-select: none;
    }
</style>