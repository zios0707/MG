<script>

    let brushMode = false
</script>

<div id="Brush">
    <div id="icon"
         class:on={brushMode}
    >
        <object type="image/svg+xml" data="/icons/ic_sharp-brush.svg" />
    </div>
</div>

<style>
    #Brush {
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