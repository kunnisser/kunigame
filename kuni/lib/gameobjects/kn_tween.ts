import {TimelineLite, Linear} from 'gsap';

class Tween {
    static addTimeline(vars: object) {
        const timeline = new TimelineLite(vars);
        timeline.linear = Linear;
        return timeline;
    }
}

export default Tween;