export default class Note { // tick 기준으로 함(어짜피 midi 출력은 하지 않을거임)
    constructor(time, duration, midi, velocity) {
        this.time = time // 노트 배치 위치
        this.duration = duration // 지속시간
        this.midi = midi // 음 // 0 ~ 127
        this.velocity = velocity // 세기 // 0 ~ 127
    }
}