import { State } from "./state";
import * as twgl from "twgl.js";
import shadowVertSrc from "./shaders/shadow.vert";
import shadowFragSrc from "./shaders/shadow.frag";
import { calculateGeometry } from "./geometry";

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

  canvas.addEventListener("mousemove", (e) => {
    // Convert canvas coordinates to [-1, 1] gl screen space coordinates
    lightPosition.x = (e.offsetX / canvas.width) * 2 - 1;
    lightPosition.y = -((e.offsetY / canvas.height) * 2 - 1);
  });

  return { gl, lightPosition, shadowProgram, shadowBuffer };
}

function render(state: State) {
  const { gl } = state;

  // Clear the canvas to black
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

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

  gl.useProgram(state.shadowProgram.program);
  twgl.setBuffersAndAttributes(gl, state.shadowProgram, state.shadowBuffer);
  twgl.drawBufferInfo(gl, state.shadowBuffer);
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
