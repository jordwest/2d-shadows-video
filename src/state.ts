import { BufferInfo, ProgramInfo } from "twgl.js";
import { Vec2 } from "./vec2";

export type State = {
  gl: WebGLRenderingContext;

  lightPosition: Vec2;

  // The shader program for drawing the shadow mask
  shadowProgram: ProgramInfo;

  // Buffer to store the vertices of the shadow triangles
  shadowBuffer: BufferInfo;
};
