precision mediump float;

attribute vec2 vertex;

varying vec2 shadowTexCoord;
varying vec2 lightTexCoord;

uniform vec2 lightPosition;

void main() {
  lightTexCoord = (vertex + 1.0) / 2.0;
  
  vec2 quadPosition = vertex + (lightPosition);
  shadowTexCoord = lightTexCoord + (lightPosition / 2.0);

  gl_Position = vec4(quadPosition, 0.0, 1.0);
}
