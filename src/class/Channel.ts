import Note from './Note'

export default interface Channel {
    trackId: number
    name: string // 이름
    notes: Note[] // 유사 midi 파일
    volume: number // 음량 // 0 ~ 127
    muted: boolean // 뮤트 모드
    solo: boolean // 솔로 모드
}