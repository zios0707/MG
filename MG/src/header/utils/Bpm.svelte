<script lang="ts">
    import { BPM } from '../../store.js'

    const upBpm = () => {
        $BPM++
    }
    const downBpm = () => {
        $BPM--
    }
</script>

<div id="Bpm">
    <button id="minus" on:click={downBpm}></button>
    <div id="BpmValue">{$BPM}</div>
    <button id="plus" on:click={upBpm}></button>
</div>

<style>
    #minus, #plus {
        width: 30px;
        height: 100%;

        background: #cccccc;
    }

    #BpmValue {
        width: 30px;
        height: 20px;

        text-align: center;
    }

    #Bpm {
        width: 125px;
        height: 85%;

        display: inline-flex;
        justify-content: space-between;
        align-items: center;
    }

    #Bpm > div {
        display: inline-block;
    }

</style>