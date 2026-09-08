#version 330 core

// Rasterization generates fragments for the covered samples of the cube.
// This shader uses interpolated surface data to produce a colour for each fragment.

in vec3 worldPosition;
in vec3 vertexPos;
in float displacedMat;
in vec3 worldNormal;
in vec2 uv;


// lightDirection points from the surface toward the directional light.
uniform vec3 lightDirection;
uniform vec3 lightColor;
uniform vec3 viewPosition;
uniform vec3 baseColor;
uniform float ambientStrength;
uniform float specularStrength;
uniform sampler2D surfaceTexture;
uniform float planeSize;
uniform float time;

out vec4 FragColor; // The colour produced for this fragment.

void main()
{
    float UVScale = 1.0;
    vec3 colorTint = vec3(0.114, 0.557, 0.922);
    vec3 waveColorTint = vec3(0.318, 0.671, 0.961);
    //vec3 waveColorTint = vec3(0.114, 0.557, 0.922);
    vec3 foamTint = vec3(0.89, 1, 1);
    float Brightness = 1.0;
    float Contrast = 0.05;
    float alpha = 1;
    float waterAlpha = 1;
    float foamAlpha = 1;
    float foamScale = 1.0;

    vec4 texel = texture(surfaceTexture, uv * UVScale * planeSize);
    vec3 materialColor = texel.rgb * baseColor * Brightness;

    float waveMask = clamp(((-displacedMat + 0.2) * 1),0,1);

    //wave foam Pattern
    float noise = sin(vertexPos.x + vertexPos.z * foamScale * 2);
    noise += sin(vertexPos.x + vertexPos.z * foamScale * 10);
    noise -= sin(vertexPos.x + vertexPos.z * foamScale * 40);
    noise += sin(vertexPos.z + vertexPos.x * foamScale * 2);
    noise += sin(vertexPos.z + vertexPos.x * foamScale * 50);
    noise -= sin(vertexPos.z + vertexPos.x * foamScale * 30);
    
    float foamNoiseMask = clamp(((displacedMat + 0.5) * 0.6),0,1);
    float foamMask = clamp(((displacedMat - 0.4) * 1),0,1);
    foamMask = clamp(foamMask * 1.0 + clamp(noise * foamNoiseMask,0,1) * 0.3,0,1);

    //Combinding tints
    vec3 waveWaterCombined = mix(waveColorTint, colorTint, waveMask);
    vec3 combinedTint = mix(waveWaterCombined, foamTint, foamMask);

    alpha = mix(waterAlpha, foamAlpha, foamMask);

    //Applying Texture
    //materialColor = mix(combinedTint, materialColor, Contrast);
    materialColor = combinedTint;

    // Interpolation can change a normal's length, so normalize per fragment.
    vec3 N = normalize(worldNormal);
    vec3 L = normalize(lightDirection);

    float diffuse = max(dot(N, L), 0.0);

    vec3 V = normalize(viewPosition - worldPosition);
    vec3 H = normalize(L + V);

    // Only a surface facing the light may receive a specular highlight.
    //use mask to change the shininess of the water and foam
    float waterShininess = 10;
    float foamShininess = 32;
    float shininess = mix(waterShininess, foamShininess, foamMask);
    float specular = 0.0;
    if (diffuse > 0.0)
    {
        specular = pow(max(dot(N, H), 0.0), shininess);
    }

    vec3 ambientColor = ambientStrength * materialColor * lightColor;
    vec3 diffuseColor = diffuse * materialColor * lightColor;
    vec3 specularColor = specularStrength * specular * lightColor;

    vec3 color = ambientColor + diffuseColor + specularColor;
    FragColor = vec4(color, alpha);

}