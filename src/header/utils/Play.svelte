<script>
    import { isPlaying, channel, bpm } from '../../store.ts';
    import * as Tone from 'tone';

    const play = document.querySelector('#play');
    const stop = document.querySelector('#stop');
    const record = document.querySelector('#record'); // TODO : MIDI 호환

    const controller = document.querySelector('#container');

    function timeOnBpm(time) {
        return time * 60 / $bpm;
    }

    let synth;
    window.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            e.preventDefault()

            if (!$isPlaying) {
                const now = Tone.now();
                synth = new Tone.PolySynth().toDestination();

                $channel.notes.forEach((note, i) => {
                    synth.triggerAttackRelease(
                        note.midi,
                        timeOnBpm(note.duration),
                        now + timeOnBpm(note.time),
                        note.velocity / 127
                    )
                 });
            }else {
                synth.dispose()
            }

            $isPlaying = !$isPlaying;
        }
    })
</script>

<div id="play">
    <div id="component">
        <div id="record">
            <object type="image/svg+xml" data="/icons/mdi_record.svg"></object>
        </div>

        <div id="play">
            <object type="image/svg+xml" data="/icons/carbon_triangle-right-solid.svg"></object>
        </div>

        <div id="stop">
            <object type="image/svg+xml" data="/icons/material-symbols_stop.svg"></object>
        </div>
    </div>
</div>


<style>
    #play {
        width: 150px;
        height: 36px;

        display: inline-flex;

        justify-content: center;
        align-items: center;

        background: #a9a9a9;
    }

    #component {
        height: 24px;
        display: flex;

        gap: 24px;
    }

    #component > div {
        width: 24px;
        height: 24px;
        display: inline-block;
    }
</style>