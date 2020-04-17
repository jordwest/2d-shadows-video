import { BufferInfo, ProgramInfo, FramebufferInfo } from "twgl.js";
import { Vec2 } from "./vec2";

export type State = {
  gl: WebGLRenderingContext;

  lightPosition: Vec2;

  // The shader program for drawing the shadow mask
  shadowProgram: ProgramInfo;

  // Buffer to store the vertices of the shadow triangles
  shadowBuffer: BufferInfo;

  // Framebuffer with texture to render the shadows into
  shadowFramebuffer: FramebufferInfo;

  // Texture to store our light image
  lightTexture: WebGLTexture;

  // Program that combines the light and the shadows
  lightProgram: ProgramInfo;

  // Simple quad that fills the screen to render the light
  lightBuffer: BufferInfo;
};
