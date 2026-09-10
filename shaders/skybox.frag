#version 330 core

out vec4 FragColor;

in vec3 worldPosition;
in vec3 vertexPos;

uniform vec3 viewPosition;

uniform float fogDensity;
uniform float fogHeight;
uniform float fogHeightFalloff;

uniform vec3 skyColor;
uniform vec3 fogColor;
const vec3 newfogColor = vec3(0.8, 0.898, 0.898);

//const vec3 skyColor = vec3(0.66, 0.847, 1);

void main()
{
    //Dist from point to camera
    float distanceToCamera = length(vertexPos - viewPosition);

    //Fog height offset
    float cameraHeight = viewPosition.y - fogHeight;
    float pointHeight = vertexPos.y - fogHeight;

    //clamping height below 0
    cameraHeight = max(cameraHeight, 0.0);
    pointHeight = max(pointHeight, 0.0);

    //Exponential height density
    float cameraDensity = exp(-cameraHeight * fogHeightFalloff * 300);
    float pointDensity = exp(-pointHeight * fogHeightFalloff * 300);

    float heightFactor = (cameraDensity + pointDensity) * 0.5;

    float fogAmount = 1.0 - exp(-fogDensity * distanceToCamera * heightFactor);
    fogAmount = clamp(fogAmount, 0.0, 1.0);

    vec3 combinedColor = mix(skyColor, fogColor, fogAmount);

    FragColor = vec4(combinedColor, 1.0);
}