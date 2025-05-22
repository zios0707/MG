<script>
    import { tick } from '../../store.ts';
</script>

<div id="time">
    <div id="component">
        <div id="high" class="number">0</div>
        <div class="dot">.</div>
        <div id="mid" class="number">0</div>
        <div class="dot">.</div>
        <div id="low" class="number">0</div>
    </div>
</div>

<style>
    #time {
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
</style>