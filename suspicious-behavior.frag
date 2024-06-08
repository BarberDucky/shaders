float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float circle(vec2 uv, vec2 center, float radius) {
    vec2 pos = uv;
    pos.y /= iResolution.x/iResolution.y;
    return smoothstep(radius - 0.02, radius, length(pos - center));
}

vec3 eye(vec2 uv, vec2 center, vec2 target, float isRed) {
    float upper = smoothstep(0.0, 0.07, -uv.y + sin(uv.x * 3.14) - 0.3);
    float lower = smoothstep(0.0, 0.05, uv.y - sin((uv.x + 1.) * 3.14) - 1.3);
    vec2 irisPos = center + 0.019 * target;
    float circle = circle(uv, irisPos, .1);
    vec3 irisColor = mix(vec3(isRed, 0., 0.), vec3(1.), circle);
    return upper * lower * irisColor;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float num = 10.;

    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    vec2 m = iMouse.xy / iResolution.xy;

    vec3 grain = vec3(0.1);
    
    float vignetteAmt = 1.-pow(length((m-uv)*3.), 0.9);
    grain *= vignetteAmt;

    grain += (random(uv))*.22;
    grain = clamp(grain.rgb, 0., 1.);

    vec2 id = floor(uv * num);
    vec2 segmentCenter = id + 0.5;
    uv = fract(uv * num);
    
    m *= num;

    vec2 target = clamp(m - segmentCenter, -5., 5.);

    vec2 mouseId = floor(m);
    float isRed = mouseId == id ? 1. : 0.;

    vec3 eyeRight = eye(vec2(uv.x - 0.22, uv.y), vec2(0.5, 0.29), target, isRed);
    vec3 eyeLeft = eye(vec2(uv.x + 0.22, uv.y), vec2(0.5, 0.29), target, isRed);

    vec3 col = vec3(eyeRight + eyeLeft);

    fragColor = vec4(col + grain, 1.0);
}
