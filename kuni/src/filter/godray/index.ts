/*
 * @Author: kunnisser 
 * @Date: 2019-08-31 15:01:05 
 * @Last Modified by: kunnisser
 * @Last Modified time: 2019-10-27 20:46:53
 */

/*
*  -- 定义阳光着色器Filter --
*  @animate: time
*/

import { Filter, Loader } from 'pixi.js';
import { Point, DEG_TO_RAD } from 'pixi.js';

class GodrayFilter extends Filter {
    public _angleLight: Point;
    public parallel: Boolean;
    public center: Array<number>;
    public _angle: number;
    constructor(loader: Loader) {
        super(loader.resources.vertex.data,
            loader.resources.godray.data.replace('${perlin}',
                loader.resources.perlin.data),
            {
                time: 0.0
            });

        this.uniforms.dimensions = new Float32Array(2);

        const options = {
            angle: 30,
            gain: 0.5,
            lacunarity: 2.5,
            time: 0.1,
            parallel: true,
            center: [0, 0],
        };

        this._angleLight = new Point();
        this.angle = options.angle;
        this.gain = options.gain;
        this.lacunarity = options.lacunarity;
        this.parallel = options.parallel;
        this.center = options.center;
        this.time = options.time;
    }

    apply(filterManager, input, output, clear) {
        const { width, height } = input.filterFrame;

        this.uniforms.light = this.parallel ? this._angleLight : this.center;

        this.uniforms.parallel = this.parallel;
        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;
        this.uniforms.aspect = height / width;
        this.time += 0.01;
        this.uniforms.time = this.time;

        filterManager.applyFilter(this, input, output, clear);
    }

    get angle() {
        return this._angle;
    }

    set angle(value) {
        this._angle = value;

        const radians = value * DEG_TO_RAD;

        this._angleLight.x = Math.cos(radians);
        this._angleLight.y = Math.sin(radians);
    }

    get gain() {
        return this.uniforms.gain;
    }

    set gain(value) {
        this.uniforms.gain = value;
    }

    get time() {
        return this.uniforms.time;
    }

    set time(value) {
        this.uniforms.time = value;
    }

    get lacunarity() {
        return this.uniforms.lacunarity;
    }

    set lacunarity(value) {
        this.uniforms.lacunarity = value;
    }
}

export { GodrayFilter };