<script>
    import { onMount } from 'svelte'

    function playSound(event) {

    }

    onMount(() => {
        // keyboard tracking set
        const target = document.querySelector('#keyboard')

        function trackingX() {
            target.style.marginLeft = `${window.scrollX}px`
        }

        window.addEventListener('scroll', trackingX)

        // show keyboard hint
        const txtList = document.querySelectorAll('div > .txt')

        function setReverse(event) {
            const bg = getComputedStyle(event.target).backgroundColor
            const hexBg = (event.target.parentNode.classList.contains('black')) ?
                 '#222222' : '#dddddd'

            event.target.style.color = hexBg
        }

        function revertReverse(event) {
            event.target.style.color = 'transparent'
        }

        txtList.forEach(txt => {
            txt.addEventListener('mouseover', setReverse)
            txt.addEventListener('mouseout', revertReverse)
        })

        return () => {
            window.removeEventListener('scroll', trackingX)
            txtList.forEach(txt => {
                txt.removeEventListener('mouseover', setReverse)
                txt.removeEventListener('mouseout', revertReverse)
            })
        }
    })

</script>

<div id="keyboard">
    <div class="piano">
        <span id="rootTxt">7</span>
        <div id="keyContainer">
            <div class="white"><p class="txt">B</p></div>
            <div class="black"><p class="txt">A#</p></div>
            <div class="white"><p class="txt">A</p></div>
            <div class="black"><p class="txt">G#</p></div>
            <div class="white"><p class="txt">G</p></div>
            <div class="white"><p class="txt">E</p></div>
            <div class="black"><p class="txt">D#</p></div>
            <div class="white"><p class="txt">D</p></div>
            <div class="black"><p class="txt">C#</p></div>
            <div class="white"><p class="txt">C</p></div>
        </div>
    </div>
    <div class="piano">
        <span id="rootTxt">6</span>
        <div id="keyContainer">
            <div class="white"><p class="txt">B</p></div>
            <div class="black"><p class="txt">A#</p></div>
            <div class="white"><p class="txt">A</p></div>
            <div class="black"><p class="txt">G#</p></div>
            <div class="white"><p class="txt">G</p></div>
            <div class="white"><p class="txt">E</p></div>
            <div class="black"><p class="txt">D#</p></div>
            <div class="white"><p class="txt">D</p></div>
            <div class="black"><p class="txt">C#</p></div>
            <div class="white"><p class="txt">C</p></div>
        </div>
    </div>
    <div class="piano">
        <span id="rootTxt">5</span>
        <div id="keyContainer">
            <div class="white"><p class="txt">B</p></div>
            <div class="black"><p class="txt">A#</p></div>
            <div class="white"><p class="txt">A</p></div>
            <div class="black"><p class="txt">G#</p></div>
            <div class="white"><p class="txt">G</p></div>
            <div class="white"><p class="txt">E</p></div>
            <div class="black"><p class="txt">D#</p></div>
            <div class="white"><p class="txt">D</p></div>
            <div class="black"><p class="txt">C#</p></div>
            <div class="white"><p class="txt">C</p></div>
        </div>
    </div>
    <div class="piano">
        <span id="rootTxt">4</span>
        <div id="keyContainer">
            <div class="white"><p class="txt">B</p></div>
            <div class="black"><p class="txt">A#</p></div>
            <div class="white"><p class="txt">A</p></div>
            <div class="black"><p class="txt">G#</p></div>
            <div class="white"><p class="txt">G</p></div>
            <div class="white"><p class="txt">E</p></div>
            <div class="black"><p class="txt">D#</p></div>
            <div class="white"><p class="txt">D</p></div>
            <div class="black"><p class="txt">C#</p></div>
            <div class="white"><p class="txt">C</p></div>
        </div>
    </div>
    <div class="piano">
        <span id="rootTxt">3</span>
        <div id="keyContainer">
            <div class="white"><p class="txt">B</p></div>
            <div class="black"><p class="txt">A#</p></div>
            <div class="white"><p class="txt">A</p></div>
            <div class="black"><p class="txt">G#</p></div>
            <div class="white"><p class="txt">G</p></div>
            <div class="white"><p class="txt">E</p></div>
            <div class="black"><p class="txt">D#</p></div>
            <div class="white"><p class="txt">D</p></div>
            <div class="black"><p class="txt">C#</p></div>
            <div class="white"><p class="txt">C</p></div>
        </div>
    </div>
    <div class="piano">
        <span id="rootTxt">2</span>
        <div id="keyContainer">
            <div class="white"><p class="txt">B</p></div>
            <div class="black"><p class="txt">A#</p></div>
            <div class="white"><p class="txt">A</p></div>
            <div class="black"><p class="txt">G#</p></div>
            <div class="white"><p class="txt">G</p></div>
            <div class="white"><p class="txt">E</p></div>
            <div class="black"><p class="txt">D#</p></div>
            <div class="white"><p class="txt">D</p></div>
            <div class="black"><p class="txt">C#</p></div>
            <div class="white"><p class="txt">C</p></div>
        </div>
    </div>
    <div class="piano">
        <span id="rootTxt">1</span>
        <div id="keyContainer">
            <div class="white"><p class="txt">B</p></div>
            <div class="black"><p class="txt">A#</p></div>
            <div class="white"><p class="txt">A</p></div>
            <div class="black"><p class="txt">G#</p></div>
            <div class="white"><p class="txt">G</p></div>
            <div class="white"><p class="txt">E</p></div>
            <div class="black"><p class="txt">D#</p></div>
            <div class="white"><p class="txt">D</p></div>
            <div class="black"><p class="txt">C#</p></div>
            <div class="white"><p class="txt">C</p></div>
        </div>
    </div>
</div>

<style>
    #keyboard {
        width: 95px;
        z-index: 1;

        padding-left: 70px;

        margin-top: 35px;

        display: inline-flex;
        flex-direction: column;

        position: sticky;

        user-select: none;

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

    #keyContainer > div > .txt {
        margin: 0;

        color: transparent;

        filter: invert(1);

        position: relative;
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