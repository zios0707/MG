<script>
    let midiMode = false
</script>

<div id="Midi">
    <div id="icon"
         class:on={midiMode}
    >
        <object type="image/svg+xml" data="/icons/material-symbols_piano-sharp.svg" />
    </div>
</div>

<style>
    #Midi {
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
</style>