import Note from './Note.svelte.js'

// 전역 ID 집합 - 채널 ID 충돌 방지용
const channelIds = new Set();

/**
 * 오디오 채널을 나타내는 클래스
 */
export default class Channel {
    id = crypto.randomUUID();
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
}