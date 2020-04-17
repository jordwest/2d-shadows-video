precision mediump float;

varying vec2 shadowTexCoord;
varying vec2 lightTexCoord;

uniform sampler2D shadowTexture;
uniform sampler2D lightTexture;

void main() {
  vec4 lightColor = texture2D(lightTexture, lightTexCoord);
  vec4 shadowColor = texture2D(shadowTexture, shadowTexCoord);
  
  float lightIntensity = 1.0 - shadowColor.r;
  gl_FragColor = vec4(lightColor.rgb, lightIntensity);
}
