<script lang="ts">
    import Header from './header/Header.svelte'
    import Workspace from './workspace/Workspace.svelte'
</script>

<main>
    <div id="container">
        <Header />
        <Workspace />
    </div>
</main>


<style>
    #container {
        height: 100vh;
        width: 100vw;

        background: #999999;
    }
</style>