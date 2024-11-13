<script lang="ts">
    import { onMount } from 'svelte'
    import { BPM } from '../../store.js'

    onMount(() => {
        const value = document.querySelector('#BpmValue') as HTMLInputElement
        let preValue = value.value

        const inputOnlyNumber = (e) => {
            e.target.readOnly = true

            if (!/^\d*$/.test(value.value) || value.value >= 1000 || value.value <= 0) {
                value.value = preValue
            }else {
                preValue = parseFloat(value.value)
            }
            $BPM = preValue
        }

        value?.addEventListener('blur', inputOnlyNumber)

        return () => {
            value?.removeEventListener('blur', inputOnlyNumber)
        }
    })

    const upBpm = () => {$BPM++}
    const downBpm = () => {$BPM--}

    // TODO: BPM 클릭하고 마우스 휠로 조지면 바뀌도록 (마우스를 움직여서 구현하게 할려 했는데 아마도 안됨)
</script>

<div id="Bpm">
    <button id="minus" onclick={downBpm} aria-label="Decrease BPM"></button>
    <input id="BpmValue" readonly bind:value="{$BPM}"
    onclick={(e) => {e.target.blur()}}
    ondblclick={(e) => {e.target.focus(); e.target.readOnly = false }} />
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