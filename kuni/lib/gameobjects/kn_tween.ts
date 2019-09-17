import {TimelineMax} from 'gsap';
class Tween {
    constructor() {
    }

    static addTimeline(vars: object) {
        return new TimelineMax(vars);
    }

    static fibonacci(n, cur = 0, sum = 1) {
        if (n === 1) {
            return sum;
        }
        if (n === 0) {
            return 0;
        }
        return Tween.fibonacci(n - 1, sum, cur + sum);
    }
}

export default Tween;