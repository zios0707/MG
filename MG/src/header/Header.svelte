<script lang="ts">
    import StartAndStop from './utils/StartAndStop.svelte'
    import Bpm from './utils/Bpm.svelte'

</script>

<div id="header">
    <Bpm />
    <StartAndStop />
</div>


<style>
    #header {
        width: 100%;
        height: 58px;

        background: #666666;

        display: inline-flex;
        flex-direction: row;
        flex-wrap: wrap;

        position: fixed;

        user-select: none;
    }
</style>