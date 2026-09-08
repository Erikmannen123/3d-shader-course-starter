#version 330 core

// The vertex shader processes each vertex's local-space attributes.
layout (location = 0) in vec3 aPosition;
layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec2 aUV;

// These matrices are created in C++ and uploaded to the GPU as uniforms.
// A uniform keeps the same value for every vertex processed by this draw call.
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform mat3 normalMatrix;

out vec3 worldPosition;
out vec3 worldNormal;
out vec2 uv;
out vec3 vertexPos;
out float displacedMat;

uniform float time;

void main()
{
    vec3 displacedPosition = vec3(0,0,0);

    vec3 dir1 = vec3(0.9,0,0.8); 
    //dir1 = normalize(dir1);

    vec3 dir2 = vec3(0.7,0,0.9); 
    //dir2 = normalize(dir2);

    vec3 dir3 = vec3(0.9,0,0.7); 
    //dir3 = normalize(dir3);

    vec3 dir4 = vec3(1,0,0.5); 
    //dir4 = normalize(dir4);

    vec3 dir5 = vec3(0.5,0,0.5); 

    float waveFrecuency1 = 1;
    float waveFrecuency2 = 1.5;
    float waveFrecuency3 = 0.7;
    float waveFrecuency4 = 2;
    float waveFrecuency5 = 7;
    float waveHeight = 1.5;
    float overhang = 2;
    float waveSpeed = time * 2;

    displacedPosition = aPosition;

    float wave = asin(sin((aPosition.x * -dir1.x + aPosition.z * -dir1.z) * waveFrecuency1 + waveSpeed));
    wave += sin((aPosition.x * -dir2.x + aPosition.z * -dir2.z) * waveFrecuency2 + waveSpeed * 1) * 0.8;
    wave += sin((aPosition.x * -dir3.x + aPosition.z * -dir2.z) * waveFrecuency3 + waveSpeed * 0.1) * 0.9;
    wave += sin((aPosition.x * -dir4.x + aPosition.z * -dir3.z) * waveFrecuency4 + waveSpeed * 1.2) * 0.3;
    wave += sin((aPosition.x * -dir5.x + aPosition.z * -dir4.z) * waveFrecuency5 + waveSpeed * 5) * 0.1;
    
    wave *= waveHeight * 0.1;
    displacedPosition.xyz += wave * dir1 * overhang;
    displacedPosition.y = aPosition.y + wave;

    displacedMat = displacedPosition.y - aPosition.y;

    //displacedPosition = vec3(displacedPosition.x * overhang, displacedPosition.y * waveHeight, displacedPosition.z * overhang) + aPosition;
    displacedMat = (displacedPosition.x - aPosition.x) + (displacedPosition.z - aPosition.z);

    /*
    //displacedPosition -= sin((aPosition.x * dir.x + aPosition.z * dir.z) * waveFrecuency + time * 5);
    //displacedPosition = vec3(displacedPosition.x * overhang, displacedPosition.y * waveHeight, displacedPosition.z * overhang) + aPosition;
    //displacedMat = (displacedPosition.x - aPosition.x) + (displacedPosition.z - aPosition.z);
    */



    // Position path: local -> world -> view -> clip.
    vec4 world = model * vec4(displacedPosition, 1.0);
    worldPosition = world.xyz;
    vertexPos = displacedPosition;
    gl_Position = projection * view * world;

    // Normal path: local direction -> world direction. Translation must not
    // affect a direction, so normals use a mat3 normal matrix rather than model.
    worldNormal = normalMatrix * aNormal;

    // UVs use their own surface-coordinate domain and pass through unchanged.
    uv = aUV;
}
