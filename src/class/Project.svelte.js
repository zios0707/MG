export default class Project {
    id;
    bpm = $state(0); // 노트 배치 위치
    name = $state(""); // 지속시간

    constructor() {
        this.id = crypto.randomUUID();
        this.bpm = 120;
        this.name = "untitled";
    }

    static fromJson(obj) {
        return new Project({
            id:   obj.id,
            bpm:  obj.bpm,
            name: obj.name,
        });
    }
}