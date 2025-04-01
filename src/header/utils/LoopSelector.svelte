<script>

    let loopMode = false;
</script>

<div id="LoopSelector">
    <div id="start" class="time">
        <div id="component">
            <div id="high" class="number">0</div>
            <div class="dot">.</div>
            <div id="mid" class="number">0</div>
            <div class="dot">.</div>
            <div id="low" class="number">0</div>
        </div>
    </div>
    <div id="icon"
         class:on={loopMode}
    >
        <object type="image/svg+xml" data="/icons/qlementine-icons_loop-16.svg" />
    </div>
    <div id="end" class="time">
        <div id="component">
            <div id="high" class="number">0</div>
            <div class="dot">.</div>
            <div id="mid" class="number">0</div>
            <div class="dot">.</div>
            <div id="low" class="number">0</div>
        </div>
    </div>
</div>

<style>
    #LoopSelector {
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
</style>