<script>
    let midiMode = false
</script>

<div id="midi">
    <div id="icon"
         class:on={midiMode}
         onclick={() => midiMode = !midiMode}
    >
        <object type="image/svg+xml" data="/icons/material-symbols_piano-sharp.svg"></object>
    </div>
</div>

<style>
    #midi {
        width: 64px;
        height: 36px;

        background: #a9a9a9;
    }

    #icon {
        width: 64px;
        height: 36px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    #icon.on {
        background: #eeee33;
    }

    object {
        pointer-events: none;
    }
</style>