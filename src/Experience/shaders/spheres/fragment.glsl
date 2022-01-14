precision mediump float;

uniform float uTime;
uniform vec3 colorPink;

varying vec2 vUv;
varying vec3 vPos;

void main()
{
    gl_FragColor = vec4(vUv, 1., 1.);
    // gl_FragColor = vec4(vec3(vUv.y), 1.0);
}