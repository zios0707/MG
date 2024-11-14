<script>
    import ChannelBar from './parts/channel/ChannelBar.svelte'
    import Info from './parts/info/Info.svelte'
</script>

<div id="workspace">
    <ChannelBar/>
    <Info/>
</div>


<style>
    #workspace {
        width: 100%;
        height: calc(100% - 58px);

        display: flex;
        flex-direction: row;
        padding-top: 58px;

        background: #888888;
    }
</style>