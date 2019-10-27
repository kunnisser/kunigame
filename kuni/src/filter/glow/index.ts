import {Filter} from 'pixi.js';
import {utils} from 'pixi.js';

class GlowFilter extends Filter {

    constructor(loader, distance = 20, outerStrength = 2, innerStrength = 0, color = 0xd10311, quality = 0.1) {
        super(loader.resources.vertex.data, loader.resources.glow.data
            .replace(/%QUALITY_DIST%/gi, '' + (1 / quality / distance).toFixed(7))
            .replace(/%DIST%/gi, '' + distance.toFixed(7)));

        this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]);
        this.distance = distance;
        this.color = color;
        this.outerStrength = outerStrength;
        this.innerStrength = innerStrength;
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