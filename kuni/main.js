import * as PIXI from 'pixi.js';

window.PX = PIXI;

const view = document.getElementById('view');

const app = new PIXI.Application({
	width: 1200,
	height: 800,
});

view.appendChild(app.view);