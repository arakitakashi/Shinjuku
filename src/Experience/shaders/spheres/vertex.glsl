precision mediump float;
uniform float uTime;

varying vec2 vUv;

void main()
{   
    float xPos = position.x + (sin(uTime * 0.02) * 5.) * 2.;
    float zPos = position.z + (cos(uTime * 0.02) * 5.) * 2.;
    float yPos = position.y;
    vec3 pos = vec3(xPos, yPos, zPos);

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);

vUv = uv;
}