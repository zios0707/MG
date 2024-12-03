<script>
    import { isPlaying } from '../../store.js'

    const play = document.querySelector('#play');
    const stop = document.querySelector('#stop');
    const record = document.querySelector('#record'); // TODO : MIDI 호환

    const controller = document.querySelector('#container');

    // controller.addEventListener('keydown', (e: Event) => {
    //
    // })

</script>

<div id="Play">
    <div id="record">
        <div id="circle"></div>
    </div>

    <div id="play">
        <div class="bar"></div>
        <div class="bar"></div>
    </div>

    <div id="stop">
        <div id="triangle"></div>
    </div>
</div>


<style>
    #Play {
        width: 125px;
        height: 85%;

        display: inline-flex;
        justify-content: space-evenly;
        align-content: center;
    }

    #Play > div {
        display: inline-block;
        justify-content: space-evenly;
        align-content: center;
    }

    #play {
        margin-top: 5px;

        display: inline-flex;
    }

    .bar {
        width: 10px;
        height: 30px;

        background: #cccccc;

        display: inline-block;
    }

    #stop {
        margin-top: 5px;
        margin-bottom: 5px;
    }

    #triangle {
        width: 0;
        height: 0;

        border-bottom: 15px solid transparent;
        border-top: 15px solid transparent;
        border-left: 25px solid #cccccc;
    }

    #circle {
        width: 25px;
        height: 25px;

        background: #cccccc;

        border-radius: 50%;
    }
</style>