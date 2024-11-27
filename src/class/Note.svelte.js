export default class Note { // tick 기준으로 함(어짜피 midi 출력은 하지 않을거임)
    time = $state(time); // 노트 배치 위치
    duration = $state(duration); // 지속시간
    midi = $state(midi); // 음 // 0 ~ 127
    velocity = $state(velocity); // 세기 // 0 ~ 127

    constructor(time, duration, midi, velocity) {
    }
}