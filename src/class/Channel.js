import Note from './Note'

let ids = new Set();

export default class Channel {
    constructor() {
        this.trackId = this.getNextId()
        this.name = "# default track" // 이름
        this.notes = [] // 유사 midi 파일
        this.volume = 100 // 음량 // 0 ~ 127
        this.muted = false // 뮤트 모드
        this.solo = false // 솔로 모드
    }

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