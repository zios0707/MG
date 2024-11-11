<script lang="ts">
    import { BPM } from '../../store.js'

    const upBpm = () => {
        $BPM++
    }
    const downBpm = () => {
        $BPM--
    }

    // TODO: BPM 클릭하고 마우스 휠로 조지면 바뀌도록 (마우스를 움직여서 구현하게 할려 했는데 아마도 안됨)
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