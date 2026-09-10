#version 330 core

layout (location = 0) in vec3 aPos;

uniform mat4 view;
uniform mat4 projection;

out vec3 vertexPos;

void main()
{
    // Remove camera translation so the skybox always follows the camera.
    mat4 viewNoTranslation = mat4(mat3(view));

    vec4 pos = projection * viewNoTranslation * vec4(aPos, 1.0);

    vertexPos = aPos;

    gl_Position = pos.xyww;
}