import {TimelineMax} from 'gsap';
class Tween {
    constructor() {
    }

    static addTimeline() {
        return new TimelineMax();
    }
}

export default Tween;