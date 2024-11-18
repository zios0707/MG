<script>
    import { onMount } from 'svelte'

    function playSound(event) {

    }

    onMount(() => {
        const target = document.querySelector('#keyboard')

        function trackingY() {
            target.style.marginTop = `${-window.scrollY + 50}px`
        }

        window.addEventListener('scroll', trackingY)

        return () => {
            window.removeEventListener('scroll', trackingY)
        }
    })

</script>

<div id="keyboard">
    <div class="piano">
        <span id="rootTxt">C7</span>
        <div id="keyContainer">
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
        </div>
    </div>
    <div class="piano">
        <span id="rootTxt">C6</span>
        <div id="keyContainer">
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
        </div>
    </div>
    <div class="piano">
        <span id="rootTxt">C5</span>
        <div id="keyContainer">
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
        </div>
    </div>
    <div class="piano">
        <span id="rootTxt">C4</span>
        <div id="keyContainer">
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
        </div>
    </div>
    <div class="piano">
        <span id="rootTxt">C3</span>
        <div id="keyContainer">
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
            <div class="white"></div>
            <div class="black"></div>
            <div class="white"></div>
        </div>
    </div>
</div>

<style>
    #keyboard {
        width: 95px;
        z-index: 1;

        padding-left: 70px;

        margin-top: 50px;

        display: inline-flex;
        flex-direction: column;

        position: fixed;

        background: #aaaaaa;
    }

    .piano {
        width: 100%;

        display: inline-flex;
    }

    #rootTxt {
        top: 5px;
        left: 5px;
    }

    #keyContainer {
        width: 100%;

        display: inline-flex;
        justify-content: end;
        flex-direction: column;
    }

    #keyContainer > .white {
        height: 25px;
        width: inherit;

        background: #ddddddcc;
    }

    #keyContainer > .black{
        height: 25px;
        width: inherit;

        background: #222222cc;
    }
</style>