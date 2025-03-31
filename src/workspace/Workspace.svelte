<script>
    import ChannelBar from './parts/channel/ChannelBar.svelte'
    import Info from './parts/info/Info.svelte'
    import Frame from '../workspace/main/Frame.svelte'
</script>

<div id="workspace">
    <ChannelBar/>
    <div id="wall1"></div>
    <Info/>
    <div id="wall2"></div>
    <Frame/>
</div>


<style>
    #workspace {
        width: 100%;
        height: calc(100% - 50px);

        padding-top: 50px;

        background: #444444;
    }

    #wall1 {
        width: 5px;
        height: 100%;
        z-index: 10;

        left: 120px;

        display: inline-block;

        position: fixed;

        background: #444444;
    }

    #wall2 {
        width: 5px;
        height: 100%;
        z-index: 10;

        left: 295px;

        display: inline-block;

        position: fixed;
        background: #444444;
    }
</style>