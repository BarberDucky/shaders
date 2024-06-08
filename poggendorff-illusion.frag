#define S(v) smoothstep(1.,-1., (v + .002 ) * iResolution.y )

// Oriented Box SDF by Inigo Quilez
//
// https://www.shadertoy.com/view/stcfzn
// iquilezles.org/articles/distfunctions2d
float sdOrientedBox( in vec2 p, in vec2 a, in vec2 b, float th )
{
    float l = length(b-a);
    vec2  d = (b-a)/l;
    vec2  q = (p-(a+b)*0.5);
          q = mat2(d.x,-d.y,d.y,d.x)*q;
          q = abs(q)-vec2(l,th)*0.5;
    return length(max(q,0.0)) + min(max(q.x,q.y),0.0);    
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - .5 * iResolution.xy) / iResolution.y;

    float shieldProgress = pow(sin(iTime * .3), 8.);

    float black = sdOrientedBox(uv, vec2(-.25, .45), vec2(.0, .0), .015);
    float red = sdOrientedBox(uv, vec2(.0, .0), vec2(.25, -.45), .015);
    float blue = sdOrientedBox(uv, vec2(.05, .0), vec2(.3, -.45), .015);
    float shield = sdOrientedBox(uv, vec2(.025, .45), vec2(.025, -.45 + .9 * shieldProgress), .23);
    
    vec3 color = vec3(1.);
    color = mix(color, vec3(0)    , S(black) );
    color = mix(color, vec3(1,0,0), S(red)   );
    color = mix(color, vec3(0,0,1), S(blue)  );
    color = mix(color, vec3(.5)   , S(shield));
    
    fragColor = vec4(color, 1.);
}