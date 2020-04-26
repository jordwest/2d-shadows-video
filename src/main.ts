import { State } from "./state";
import * as twgl from "twgl.js";
import shadowVertSrc from "./shaders/shadow.vert";
import shadowFragSrc from "./shaders/shadow.frag";
import lightVertSrc from "./shaders/light.vert";
import lightFragSrc from "./shaders/light.frag";
import sceneVertSrc from "./shaders/scene.vert";
import sceneFragSrc from "./shaders/scene.frag";
import { calculateGeometry } from "./geometry";
import lightSourceImage from "./assets/lightsource-torch.png";
import sceneImage from "./assets/scene.jpg";
import { Vec2 } from "./vec2";

function setup(): State {
  const canvas = document.querySelector("canvas#canvas") as HTMLCanvasElement;
  const overlay = document.querySelector("canvas#overlay") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl");
  const overlayContext = overlay.getContext("2d");

  const shadowProgram = twgl.createProgramInfo(gl, [
    shadowVertSrc,
    shadowFragSrc,
  ]);

  const arrays = {
    vertex: {
      numComponents: 2,
      data: [],
    },
  };
  const shadowBuffer = twgl.createBufferInfoFromArrays(gl, arrays);
  const lightPosition = { x: 0, y: -1 };

  const quadArrays = {
    vertex: {
      numComponents: 2,
      data: new Float32Array([
        // Bottom left tri
        -1,
        -1,
        -1,
        1,
        1,
        -1,

        // Top right tri
        -1,
        1,
        1,
        -1,
        1,
        1,
      ]),
    },
  };

  const lightTexture = twgl.createTexture(gl, {
    src: lightSourceImage,
  });
  const sceneTexture = twgl.createTexture(gl, {
    src: sceneImage,
  });
  const lightProgram = twgl.createProgramInfo(gl, [lightVertSrc, lightFragSrc]);
  const sceneProgram = twgl.createProgramInfo(gl, [sceneVertSrc, sceneFragSrc]);
  const quadBuffer = twgl.createBufferInfoFromArrays(gl, quadArrays);
  const attachments = [
    {
      format: gl.RGBA,
      type: gl.UNSIGNED_BYTE,
      min: gl.LINEAR,
      wrap: gl.CLAMP_TO_EDGE,
    },
  ];
  const shadowFramebuffer = twgl.createFramebufferInfo(gl, attachments);
  const lightFramebuffer = twgl.createFramebufferInfo(gl, attachments);

  const state: State = {
    gl,
    drawingState: { t: "not-drawing" },
    walls: [],
    overlayContext,
    shadowFramebuffer,
    shadowProgram,
    shadowBuffer,
    lightTexture,
    lightProgram,
    lightPosition,
    quadBuffer,
    sceneTexture,
    sceneProgram,
    lightFramebuffer,
  };

  const canvasToGlCoords = (canvasCoord: Vec2): Vec2 => ({
    x: (canvasCoord.x / canvas.width) * 2 - 1,
    y: -((canvasCoord.y / canvas.width) * 2 - 1),
  });
  overlay.addEventListener("mousemove", (e) => {
    if (state.drawingState.t === "drawing") {
      state.drawingState.end = {
        x: e.offsetX,
        y: e.offsetY,
      };
      return;
    }

    // Convert canvas coordinates to [-1, 1] gl screen space coordinates
    state.lightPosition = canvasToGlCoords({ x: e.offsetX, y: e.offsetY });
  });

  overlay.addEventListener("mousedown", (e) => {
    state.drawingState = {
      t: "drawing",
      start: { x: e.offsetX, y: e.offsetY },
      end: { x: e.offsetX, y: e.offsetY },
    };
  });
  overlay.addEventListener("mouseup", () => {
    if (state.drawingState.t === "drawing") {
      state.walls.push({
        start: canvasToGlCoords(state.drawingState.start),
        end: canvasToGlCoords(state.drawingState.end),
      });
    }
    state.drawingState = { t: "not-drawing" };
  });

  return state;
}

function renderOverlay(state: State) {
  const { overlayContext: ctx } = state;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (state.drawingState.t === "drawing") {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(state.drawingState.start.x, state.drawingState.start.y);
    ctx.lineTo(state.drawingState.end.x, state.drawingState.end.y);
    ctx.stroke();
  }
}

function render(state: State) {
  const { gl } = state;

  twgl.bindFramebufferInfo(gl, state.shadowFramebuffer);

  // Clear the canvas to black
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw shadows
  const vertices = [];
  for (const wall of state.walls) {
    vertices.push(
      ...calculateGeometry({
        light: state.lightPosition,
        a: wall.start,
        b: wall.end,
        lightRadius: 3,
      })
    );
  }

  twgl.setAttribInfoBufferFromArray(
    gl,
    state.shadowBuffer.attribs.vertex,
    vertices
  );
  state.shadowBuffer.numElements = vertices.length / 2;

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.useProgram(state.shadowProgram.program);
  twgl.setBuffersAndAttributes(gl, state.shadowProgram, state.shadowBuffer);

  // Only add shadows when we're not drawing new walls
  if (state.drawingState.t === "not-drawing") {
    twgl.drawBufferInfo(gl, state.shadowBuffer);
  }

  // Draw lights
  twgl.bindFramebufferInfo(gl, state.lightFramebuffer);
  gl.clearColor(0.3, 0.3, 0.3, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);

  gl.useProgram(state.lightProgram.program);
  twgl.setBuffersAndAttributes(gl, state.lightProgram, state.quadBuffer);
  twgl.setUniforms(state.lightProgram, {
    lightPosition: [state.lightPosition.x, state.lightPosition.y],
    shadowTexture: state.shadowFramebuffer.attachments[0],
    lightTexture: state.lightTexture,
  });
  twgl.drawBufferInfo(gl, state.quadBuffer);

  // Draw scene
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.DST_ALPHA);

  gl.useProgram(state.sceneProgram.program);
  twgl.setBuffersAndAttributes(gl, state.sceneProgram, state.quadBuffer);
  twgl.setUniforms(state.sceneProgram, {
    lightTexture: state.lightFramebuffer.attachments[0],
    sceneTexture: state.sceneTexture,
  });
  twgl.drawBufferInfo(gl, state.quadBuffer);
}

function start() {
  const state = setup();

  const frame = () => {
    render(state);
    renderOverlay(state);
    requestAnimationFrame(frame);
  };
  frame();
}

start();
