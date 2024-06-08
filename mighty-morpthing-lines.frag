float drawLine( vec2 p, vec2 a, vec2 b ) {
  vec2 pa = p-a, ba = b-a;
  float h = clamp(dot(pa,ba)/dot(ba,ba), 0.0, 1.0);
  float d = length(pa - ba*h);
  return sqrt(smoothstep(0., 1., d));
}

float getGlow(float dist, float radius, float intensity) {
  return pow(radius/dist, intensity);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;

    vec3 col = vec3(0.);
    float radius = 0.002;
    float intensity = 0.7;
    float lineLength = .90;
    
    float speedOffsets[5] = float[5](0.9, 0.3, 1.7, 0.0, 1.3);
    vec2 curveModifiers[5] = vec2[5](vec2(0.8, 0.0), vec2(1.15, -0.69), vec2(1.1, 2.64), vec2(1.29, 2.52), vec2(1.1, 2.3));
    float offsetPoints[5] = float[5](-0.05, 0., 1.2, 1.1, 1.26);
    vec3 lineColors[5] = vec3[5](vec3(0.0, 0.5, 0.25), vec3(1.0, 1.0, 1.0), vec3(0.2, 0.2, 0.75), vec3(1.0, 0.25, 0.25), vec3(1.0, 1.0, 0.0));
    
    for (int i = 0; i < 5; i++) {
        float t = mod(iTime * 0.6 - speedOffsets[i], 2.3);
        vec2 lineStart = vec2(t - 0.5, 1.);
        vec2 lineEnd = vec2(t - lineLength - 0.5, 1.);
        float curve = cos(uv.y * curveModifiers[i].x + curveModifiers[i].y);
        vec2 offsetPoint = vec2(uv.y, uv.x + curve + offsetPoints[i]);
        float distanceToLine = drawLine(offsetPoint, lineStart, lineEnd);
        float fallOff = smoothstep(lineEnd.x, lineStart.x, uv.y);
        float glow = getGlow(distanceToLine, radius, intensity);
        glow = clamp(glow, 0.0, 1.89);
        glow *= smoothstep(0., 1., 1. - distanceToLine);
        col += vec3(glow * lineColors[i] * fallOff);
    }
    
    fragColor = vec4(col, 1.);
}