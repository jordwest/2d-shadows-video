import { State } from "./state";
import * as twgl from "twgl.js";
import shadowVertSrc from "./shaders/shadow.vert";
import shadowFragSrc from "./shaders/shadow.frag";

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
      data: new Float32Array([
        // Vertex 1
        0,
        1,
        // Vertex 2
        -1,
        -1,
        // Vertex 3
        1,
        -1,
      ]),
    },
  };
  const shadowBuffer = twgl.createBufferInfoFromArrays(gl, arrays);

  return { gl, shadowProgram, shadowBuffer };
}

function render(state: State) {
  const { gl } = state;

  // Clear the canvas to black
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(state.shadowProgram.program);
  twgl.setBuffersAndAttributes(gl, state.shadowProgram, state.shadowBuffer);
  twgl.drawBufferInfo(gl, state.shadowBuffer);
}

function start() {
  const state = setup();
  render(state);
}

start();
