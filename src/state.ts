import { BufferInfo, ProgramInfo, FramebufferInfo } from "twgl.js";
import { Vec2 } from "./vec2";

export type Wall = {
  start: Vec2;
  end: Vec2;
};

export type State = {
  gl: WebGLRenderingContext;

  lightPosition: Vec2;

  drawingState:
    | {
        t: "not-drawing";
      }
    | {
        t: "drawing";
        start: Vec2;
        end: Vec2;
      };

  overlayContext: CanvasRenderingContext2D;

  walls: Wall[];

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

  // Simple quad that fills the screen
  quadBuffer: BufferInfo;

  // Framebuffer with texture to render the shadows into
  lightFramebuffer: FramebufferInfo;

  // Texture to store our scene background
  sceneTexture: WebGLTexture;

  // Program that combines the light and the scene
  sceneProgram: ProgramInfo;
};
