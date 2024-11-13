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

<div id="channels">
</div>

<style>
    #channels {
        position: ;
    }
</style>