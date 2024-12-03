<script>
    import Keyboard from './keyboard/Keyboard.svelte';
    import Navigation from './navigation/Navigation.svelte';
    import Properties from './properties/Properties.svelte';
    import Field from './field/Field.svelte';
</script>

<div id="Frame">
    <Navigation/>
    <Properties/>
    <Keyboard/>
    <Field/>
</div>

<style>
    #Frame {
        width: 1000vw;

        margin-left: 290px;

        position: absolute;

        background: #888888;
    }
</style>