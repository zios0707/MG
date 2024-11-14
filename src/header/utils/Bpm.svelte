<script lang="ts">
    import { bpm } from '../../store.js'
    let preValue

    function inputEvent(e) {
        if(preValue === undefined) preValue = e.target.value


        if (!/^\d*$/.test(e.target.value) || e.target.value >= 1000 || e.target.value <= 0) {
            e.target.value = preValue
        }else {
            preValue = parseFloat(e.target.value)
        }

        e.target.readOnly = true
        $bpm = preValue
    }

    const upBpm = () => {if ($bpm < 999) $bpm++}
    const downBpm = () => {if (1 < $bpm) $bpm--}

    // TODO: BPM 클릭하고 마우스 휠로 조지면 바뀌도록 (마우스를 움직여서 구현하게 할려 했는데 아마도 안됨)
</script>

<div id="Bpm">
    <button id="minus" onclick={downBpm} aria-label="Decrease BPM"></button>
    <input id="BpmValue" readonly bind:value="{$bpm}"
    onclick={(e) => {e.target.blur()}}
    ondblclick={(e) => {e.target.focus(); e.target.readOnly = false }}
    onblur={(e) => {inputEvent(e)}}/>
    <button id="plus" onclick={upBpm} aria-label="Increase BPM"></button>
</div>

<style>
    #minus, #plus {
        width: 30px;
        height: 100%;

        background: #cccccc;
    }

    #BpmValue {
        width: 50%;
        height: 100%;

        border: transparent;
        background: transparent;

        text-align: center;
    }

    #Bpm {
        width: 125px;
        height: 85%;
        display: inline-flex;

        justify-content: space-between;
        align-items: center;
    }

    input:focus {
        outline: none;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* 예시: 파란색 그림자 */
    }

</style>