import Note from './Note.svelte.js'

// 전역 ID 집합 - 채널 ID 충돌 방지용
const channelIds = new Set();

/**
 * 오디오 채널을 나타내는 클래스
 */
export default class Channel {
    trackId = $state(this.getNextId());
    name = $state("# default track");

    /** @type {Note[]} */
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

    // 채널 오디오 속성
    volume = $state(0);
    mute = $state(false);
    solo = $state(false);

    /**
     * 사용 가능한 다음 채널 ID를 가져옵니다
     * @returns {number} 새로운 고유 채널 ID
     */
    getNextId() {
        let id = 0;
        while (channelIds.has(id)) id++;
        channelIds.add(id);
        return id;
    }

    /**
     * 채널이 삭제될 때 ID를 재사용 가능하도록 해제합니다
     */
    deleteId() {
        channelIds.delete(this.trackId);
    }

    /**
     * 새 노트를 채널에 추가합니다
     * @param {number} position - 노트 시작 위치
     * @param {number} duration - 노트 지속 시간
     * @param {string} pitch - 노트 음높이
     * @param {number} velocity - 노트 세기 (0-127)
     */
    addNote(position, duration, pitch, velocity = 100) {
        this.notes = [...this.notes, new Note(position, duration, pitch, velocity)];
    }

    /**
     * ID로 노트를 찾아 제거합니다
     * @param {string} noteId - 제거할 노트의 ID
     * @returns {boolean} 노트 제거 성공 여부
     */
    removeNote(noteId) {
        const initialLength = this.notes.length;
        this.notes = this.notes.filter(note => note.id !== noteId);
        return this.notes.length < initialLength;
    }
}