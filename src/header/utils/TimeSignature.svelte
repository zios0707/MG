<script>
    import { timeSignature, beatsPerMeasure, ticksPerBeat } from '../../store.ts';

    // 메타데이터에서 최대값 가져오기 (예: 4/4박자는 비트 0-3, 16분음표 0-3)
    $: maxBeat = $beatsPerMeasure; // 한 마디의 박자 수
    $: maxSixteenth = $ticksPerBeat; // 한 박자의 16분음표 수
</script>

<div id="time">
    <div id="component" title="현재 시간 위치">
        <div id="high" class="number">{$timeSignature.bar}</div>
        <div class="dot">.</div>
        <div id="mid" class="number">{$timeSignature.beat}</div>
        <div class="dot">.</div>
        <div id="low" class="number">{$timeSignature.sixteenth}</div>
    </div>
</div>

<style>
    #time {
        width: 175px;
        height: 36px;

        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        font-size: 20px;
        font-weight: 800;
        text-align: center;

        background: #a9a9a9;
    }

    #component {
        width: 155px;
        height: 24px;

        display: inline-flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    .dot {
        width: 6px;
        display: flex;
        align-items: center;
    }

    .number {
        flex-grow: 1;
        min-width: 30px;
    }

</style>
