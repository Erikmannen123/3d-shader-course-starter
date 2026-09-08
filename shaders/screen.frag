#version 330 core

// These UVs address the rendered scene image, not a face of the cube.
in vec2 screenUV;
// C++ maps this sampler to texture unit 0 and binds the scene colour texture there.
uniform sampler2D sceneTexture;

out vec4 FragColor;

void main()
{
    // Pass-through: display pass 1's colour, including its cleared background.
    // Lighting is already in this image; we do not calculate it a second time.
    //vec3 color = texture(sceneTexture, screenUV).rgb;
    //FragColor = vec4(color, 1.0);
    FragColor = texture(sceneTexture, screenUV);
}
