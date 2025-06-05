<script>
    import { tick, loop, loopStart, loopEnd, setPosition, timeSignature, ticksPerMeasure, ticksPerBeat  } from '../../store.ts';

    // Derived values for displaying time in bar.beat.sixteenth format
    $: startTimeSignature = calculateTimeSignature($loopStart);
    $: endTimeSignature = calculateTimeSignature($loopEnd);

    // Function to calculate bar.beat.sixteenth from tick value
    function calculateTimeSignature(tickValue) {
        const totalTicks = Math.floor(tickValue);
        const measure = Math.floor(totalTicks / $ticksPerMeasure);
        const remainingTicks = totalTicks % $ticksPerMeasure;
        const beat = Math.floor(remainingTicks / $ticksPerBeat);
        const remainingSubTicks = remainingTicks % $ticksPerBeat;

        return {
            bar: measure,
            beat: beat,
            sixteenth: remainingSubTicks
        };
    }

    // Toggle loop mode
    function toggleLoop() {
        loop.set(!$loop);
        setPosition($tick);
    }
</script>

<div id="loopSelectorTime">
    <div id="start" class="time">
        <div id="component">
            <div id="high" class="number">{startTimeSignature.bar}</div>
            <div class="dot">.</div>
            <div id="mid" class="number">{startTimeSignature.beat}</div>
            <div class="dot">.</div>
            <div id="low" class="number">{startTimeSignature.sixteenth}</div>
        </div>
    </div>
    <div id="icon"
         class:on={$loop}
         on:click={toggleLoop}
    >
        <object type="image/svg+xml" data="/icons/qlementine-icons_loop-16.svg"></object>
    </div>
    <div id="end" class="time">
        <div id="component">
            <div id="high" class="number">{endTimeSignature.bar}</div>
            <div class="dot">.</div>
            <div id="mid" class="number">{endTimeSignature.beat}</div>
            <div class="dot">.</div>
            <div id="low" class="number">{endTimeSignature.sixteenth}</div>
        </div>
    </div>
</div>

<style>
    #loopSelectorTime {
        height: 36px;

        display: flex;

        flex-direction: row;

        gap: 12px;
    }

    .time {
        width: 175px;
        height: 36px;

        display: flex;
        align-items: center;
        justify-content: center;

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
    }

    .dot {
        width: 6px;
    }

    .number {
        flex-grow: 1;
    }

    #icon {
        width: 56px;

        display: flex;
        justify-content: center;
        align-items: center;

        background: #a9a9a9;
    }

    #icon.on {
        background: #eeee33;
    }

    object {
        pointer-events: none;
    }
</style>
