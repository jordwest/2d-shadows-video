precision mediump float;

varying vec2 texCoord;

uniform sampler2D lightTexture;
uniform sampler2D sceneTexture;

void main() {
  vec4 lightColor = texture2D(lightTexture, texCoord);
  vec4 sceneColor = texture2D(sceneTexture, texCoord);
  
  float lightIntensity = lightColor.r;
  gl_FragColor = vec4(sceneColor.rgb, lightIntensity);
}
