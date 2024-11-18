<script>
    import Keyboard from './keyboard/Keyboard.svelte'
    import Navigation from './navigation/Navigation.svelte'
    import Properties from './properties/Properties.svelte'
    import Field from './field/Field.svelte'
</script>

<div id="Frame">
    <Navigation/>
    <Keyboard/>
    <Field/>
    <Properties/>
</div>

<style>
    #Frame {
        width: 100%;

        margin-left: 285px;

        position: absolute;
    }
</style>