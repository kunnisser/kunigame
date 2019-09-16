import * as Timeline from 'gsap/TimelineMax';
class Tween {
    constructor() {
    }

    static addTimeline() {
        return new Timeline.TimelineMax();
    }
}

export default Tween;