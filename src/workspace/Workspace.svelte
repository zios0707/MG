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
        height: calc(100% - 58px);

        padding-top: 58px;

        background: #888888;
    }

    #wall1 {
        width: 5px;
        height: 100%;
        z-index: 10;

        left: 120px;

        display: inline-block;

        position: fixed;

        background: #888888;
    }

    #wall2 {
        width: 5px;
        height: 100%;
        z-index: 10;

        left: 285px;

        display: inline-block;

        position: fixed;
        background: #888888;
    }
</style>