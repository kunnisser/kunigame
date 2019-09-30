import {TimelineLite, Linear, Power2 } from 'gsap';

class knTweenLine extends TimelineLite {
    public linear: Function;
    public cubic: Function;
    constructor (vars) {
        super(vars);
        this.linear = Linear;
        this.cubic = Power2;
    }

}

export {knTweenLine};