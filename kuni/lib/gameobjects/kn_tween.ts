import {TimelineLite, TweenMax, Linear, Power2 } from 'gsap';

class knTweenLine extends TimelineLite {
    public linear: Function;
    public cubic: Function;
    constructor (vars) {
        super(vars);
        this.linear = Linear;
        this.cubic = Power2;
    }
}

class KnTween {
    public linear: Function;
    public cubic: Function;   
    public instance: TweenMax;
    constructor () {
        this.linear = Linear;
        this.cubic = Power2;
        this.instance = TweenMax;
    }
}

export {knTweenLine, KnTween};