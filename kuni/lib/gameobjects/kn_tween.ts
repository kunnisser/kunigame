import {TimelineLite, TweenMax, Linear, Power2, Bounce, Back, Sine } from 'gsap';

class knTweenLine extends TimelineLite {
    public linear: Function;
    public cubic: Function;
    constructor (vars) {
        super(vars);
        this.linear = Linear;
        this.cubic = Power2;
    }
}

class KnTween{
    public linear: Function;
    public cubic: Function;   
    public bounce: Function;
    public back: Function;
    public sine: Function;
    public instance: any;
    constructor () {
        this.linear = Linear;
        this.cubic = Power2;
        this.bounce = Bounce;
        this.back = Back;
        this.sine = Sine;
        this.instance = TweenMax;
    }
}

export {knTweenLine, KnTween};