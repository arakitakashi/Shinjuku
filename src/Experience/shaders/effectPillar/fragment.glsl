precision mediump float;

uniform float uTime;
uniform vec3 colorPink;
uniform float uSound;

varying vec2 vUv;
varying vec3 vPos;

void main()
{
    float yOffset = cos( vUv.x * 3.14 * 8. + sin(uTime * 0.01) ) * 0.01 ;
    float pos = sin(uTime * 0.002 + vUv.y + (yOffset * (uSound * vPos.z * vUv.y * 0.5)));
    float strength = mod(pos * 3.0, 1.0);
    // vec3 col = vec3(strength) * vUv.y;
    float col = strength * vUv.y;
    vec3 finalCol = colorPink * col;
    gl_FragColor = vec4(finalCol, col);
    // gl_FragColor = vec4(vec3(uSound * 0.1), 1.0);
}