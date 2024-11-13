export default interface Note { // tick 기준으로 함(어짜피 midi 출력은 하지 않을거임)
    time: number // 노트 배치 위치
    duration: number // 지속시간
    midi: number // 0 ~ 127
    velocity: number // 0 ~ 127
}