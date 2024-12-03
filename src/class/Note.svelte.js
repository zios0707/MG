export default class Note { // tick 기준으로 함(어짜피 midi 출력은 하지 않을거임)
    time = $state(0); // 노트 배치 위치
    duration = $state(0); // 지속시간
    midi = $state(''); // 음 // string / 'C D E F...' + '1 2 3 4...'
    velocity = $state(0); // 세기 // 0 ~ 127

    constructor(time, duration, midi, velocity) {
        this.time = time;
        this.duration = duration;
        this.midi = midi;
        this.velocity = velocity;
    }
}