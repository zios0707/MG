<script>

    let brushMode = false
</script>

<div id="brush"
     onclick={() => brushMode = !brushMode}
>
    <div id="icon"
         class:on={brushMode}
    >
        <object type="image/svg+xml" data="/icons/ic_sharp-brush.svg"></object>
    </div>
</div>

<style>
    #brush {
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