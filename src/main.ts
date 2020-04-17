import { State } from "./state";
import * as twgl from "twgl.js";
import shadowVertSrc from "./shaders/shadow.vert";
import shadowFragSrc from "./shaders/shadow.frag";
import lightVertSrc from "./shaders/light.vert";
import lightFragSrc from "./shaders/light.frag";
import { calculateGeometry } from "./geometry";
import lightSourceImage from "./assets/lightsource.png";

function setup(): State {
  const canvas = document.querySelector("canvas#canvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl");

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

  const lightArrays = {
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
  const lightProgram = twgl.createProgramInfo(gl, [lightVertSrc, lightFragSrc]);
  const lightBuffer = twgl.createBufferInfoFromArrays(gl, lightArrays);
  const shadowFramebuffer = twgl.createFramebufferInfo(gl, [
    {
      format: gl.RGBA,
      type: gl.UNSIGNED_BYTE,
      min: gl.LINEAR,
      wrap: gl.CLAMP_TO_EDGE,
    },
  ]);

  canvas.addEventListener("mousemove", (e) => {
    // Convert canvas coordinates to [-1, 1] gl screen space coordinates
    lightPosition.x = (e.offsetX / canvas.width) * 2 - 1;
    lightPosition.y = -((e.offsetY / canvas.height) * 2 - 1);
  });

  return {
    gl,
    shadowFramebuffer,
    shadowProgram,
    shadowBuffer,
    lightTexture,
    lightProgram,
    lightPosition,
    lightBuffer,
  };
}

function render(state: State) {
  const { gl } = state;

  twgl.bindFramebufferInfo(gl, state.shadowFramebuffer);

  // Clear the canvas to black
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw shadows
  const vertices = calculateGeometry({
    light: state.lightPosition,
    a: { x: -0.5, y: 0 },
    b: { x: 0.5, y: 0 },
    lightRadius: 3,
  });

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
  twgl.drawBufferInfo(gl, state.shadowBuffer);

  // Draw lights
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.useProgram(state.lightProgram.program);
  twgl.setBuffersAndAttributes(gl, state.lightProgram, state.lightBuffer);
  twgl.setUniforms(state.lightProgram, {
    lightPosition: [state.lightPosition.x, state.lightPosition.y],
    shadowTexture: state.shadowFramebuffer.attachments[0],
    lightTexture: state.lightTexture,
  });
  twgl.drawBufferInfo(gl, state.lightBuffer);
}

function start() {
  const state = setup();

  const frame = () => {
    render(state);
    requestAnimationFrame(frame);
  };
  frame();
}

start();
