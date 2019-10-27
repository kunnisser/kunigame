import {Filter} from 'pixi.js';
import {utils} from 'pixi.js';

class LightmapFilter extends Filter {
    public _color: number;
    public dontFit: boolean;
    constructor(loader, color = 0xbb5206, alpha = 0.4) {
        super(loader.resources.vertex.data, loader.resources.lightmap_frag.data);
        this.uniforms.dimensions = new Float32Array(2);
        this.uniforms.ambientColor = new Float32Array([0.0, 0.0, 0.0, alpha]);
        this.texture = loader.resources.lightmap.texture;
        this.color = color;
    }

    apply(filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = ~~(input.filterFrame.height * 0.5);
        this.uniforms.dimensions[1] = ~~(input.filterFrame.height * 0.4);
        // draw the filter...
        filterManager.applyFilter(this, input, output, clear);
    }

    get texture() {
        return this.uniforms.uLightmap;
    }
    set texture(value) {
        this.uniforms.uLightmap = value;
    }

    set color(value) {
        const arr = this.uniforms.ambientColor;
        if (typeof value === 'number') {
          utils.hex2rgb(value, arr);
            this._color = value;
        }
        else {
            arr[0] = value[0];
            arr[1] = value[1];
            arr[2] = value[2];
            arr[3] = value[3];
            this._color = utils.rgb2hex(arr);
        }
    }
    get color() {
        return this._color;
    }

    get alpha() {
        return this.uniforms.ambientColor[3];
    }
    set alpha(value) {
        this.uniforms.ambientColor[3] = value;
    }
}

export { LightmapFilter };