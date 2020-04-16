import { BufferInfo, ProgramInfo } from "twgl.js";

export type State = {
  gl: WebGLRenderingContext;

  // The shader program for drawing the shadow mask
  shadowProgram: ProgramInfo;

  // Buffer to store the vertices of the shadow triangles
  shadowBuffer: BufferInfo;
};
