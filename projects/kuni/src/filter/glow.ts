import { Filter } from 'pixi.js';
import { utils } from 'pixi.js';

class GlowFilter extends Filter {
    public delta: number;
    public direct: number;
    constructor(loader, color = 0xd10311, outerStrength = 4, innerStrength = 0, quality = 1.6, distance = 10) {
        super(loader.resources.vertex.data, loader.resources.glow.data
            .replace(/%QUALITY_DIST%/gi, '' + (1 / quality / distance).toFixed(7))
            .replace(/%DIST%/gi, '' + distance.toFixed(7)));

        this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]);
        this.distance = distance;
        this.color = color;
        this.outerStrength = outerStrength;
        this.innerStrength = innerStrength;
        this.delta = 0;
        this.direct = 1;
    }

    apply(filterManager, input, output, clear) {
        this.delta >= 4 && (this.direct = -1);
        this.delta <= 1 && (this.direct = 1);
        this.delta += 0.04 * this.direct;
        this.outerStrength = this.delta;
        // draw the filter...
        filterManager.applyFilter(this, input, output, clear);
    }

    get color() {
        return utils.rgb2hex(this.uniforms.glowColor);
    }

    set color(value) {
        utils.hex2rgb(value, this.uniforms.glowColor);
    }

    get distance() {
        return this.uniforms.distance;
    }

    set distance(value) {
        this.uniforms.distance = value;
    }

    get outerStrength() {
        return this.uniforms.outerStrength;
    }

    set outerStrength(value) {
        this.uniforms.outerStrength = value;
    }

    get innerStrength() {
        return this.uniforms.innerStrength;
    }
    set innerStrength(value) {
        this.uniforms.innerStrength = value;
    }
}

export { GlowFilter };