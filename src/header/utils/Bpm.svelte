<script lang="ts">
    import { bpm } from '../../store.js';
    import * as Tone from 'tone'
    let preValue;

    $effect(() => {
        Tone.Transport.bpm.value = $bpm
    })

    function inputEvent(e) {
        e.target.value = e.target.value.trim();

        if(preValue === undefined) preValue = e.target.value;

        if (!/^\d*$/.test(e.target.value) || e.target.value >= 1000 || e.target.value <= 0) {
            e.target.value = preValue;
        }else {
            preValue = parseFloat(e.target.value);
        }

        e.target.readOnly = true;
        $bpm = preValue;
    }

    const upBpm = () => {if ($bpm < 999) $bpm++};
    const downBpm = () => {if (1 < $bpm) $bpm--};

    // TODO: BPM 클릭하고 마우스 휠로 조지면 바뀌도록 (마우스를 움직여서 구현하게 할려 했는데 아마도 안됨)
</script>

<div id="bpm">
    <button id="minus" on:click={downBpm} aria-label="Decrease BPM"></button>
    <input id="bpmValue" readonly bind:value="{$bpm}" autocomplete="off"
    on:click={(e) => {e.target.blur()}}
    on:dblclick={(e) => {e.target.focus(); e.target.readOnly = false }}
    on:blur={(e) => {inputEvent(e)}}/>
    <button id="plus" on:click={upBpm} aria-label="Increase BPM"></button>
</div>

<style>
    #minus, #plus {
        width: 13px;
        height: 34px;

        background: #4f4f4f;
    }

    #bpmValue {
        width: 50%;
        height: 100%;

        border: transparent;
        background: transparent;

        font-size: 20px;
        font-weight: 800;

        text-align: center;
    }

    #bpm {
        width: 80px;
        height: 36px;
        display: inline-flex;

        justify-content: space-between;
        align-items: center;

        background: #a9a9a9;
    }

    button {
        border: none;
        margin: 1px;
    }

</style>