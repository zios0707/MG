import Note from './Note.svelte.js'

let ids = new Set();

export default class Channel {
    trackId = $state(this.getNextId());
    name = $state("# default track");

    /** @type Note[] */
    notes = $state([]);

    volume = $state(100);
    muted = $state(false);
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