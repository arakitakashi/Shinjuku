precision mediump float;
uniform float uTime;

varying vec2 vUv;
varying vec3 vPos;

void main()
{
gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

vUv = uv;
vPos = position;
}