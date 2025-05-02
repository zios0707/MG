import Note from './Note.svelte.js'

let ids = new Set();

export default class Channel {
    trackId = $state(this.getNextId());
    name = $state("# default track");

    /** @type Note[] */
    notes = $state([
        new Note(0, 0.5, 'G#4', 100),
        new Note(0.5, 0.25, 'G#4', 100),
        new Note(0.75, 0.25, 'A#4', 100),
        new Note(1, 0.25, 'G#4', 100),

        new Note(1.5, 0.25, 'G#4', 100),
        new Note(1.75, 0.25, 'A#4', 100),
        new Note(2, 0.5, 'G#4', 100),
        new Note(2.5, 0.5, 'F#4', 100),
        new Note(3, 0.5, 'F4', 100),

        new Note(3.5, 0.25, 'D#4', 100),
        new Note(3.75, 0.25, 'C#4', 100),
        new Note(4, 0.25, 'D#4', 100),
        new Note(4.25, 0.25, 'C#4', 100),
        new Note(4.5, 0.25, 'D#4', 100),
        new Note(4.75, 0.25, 'C#4', 100),
        new Note(5, 0.25, 'D#4', 100),

        new Note(5.25, 0.25, 'F4', 100),
        new Note(5.75, 0.5, 'F4', 100),
        new Note(6.25, 0.25, 'F#4', 100),
        new Note(6.5, 0.25, 'F4', 100),
        new Note(6.75, 0.25, 'F#4', 100),
        new Note(7, 0.25, 'F4', 100),

        new Note(7.5, 0.25, 'D#4', 100),
        new Note(7.75, 0.25, 'C#4', 100)
    ]);

    volume = $state(0);
    mute = $state(false);
    solo = $state(false);

    getNextId() {
        let id = 0;
        while (ids.has(id)) id++;
        ids.add(id)
        return id;
    }

    deleteId() {
        ids.delete(this.trackId)
    }
}