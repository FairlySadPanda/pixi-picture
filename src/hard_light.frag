varying vec2 vTextureCoord;
varying vec2 vMapCoord;
varying vec4 vColor;

uniform sampler2D uSampler[2];
uniform vec4 uTextureClamp;
uniform vec4 uColor;

void main(void)
{
    vec2 textureCoord = clamp(vTextureCoord, uTextureClamp.xy, uTextureClamp.zw);
    vec4 source = texture2D(uSampler[0], textureCoord);
    vec4 target = texture2D(uSampler[1], vMapCoord);

    //reverse hardlight
    //yeah, premultiplied
    if (source.a == 0.0) {
        return;
    }
    vec3 Cb = source.rgb/source.a, Cs;
    if (target.a > 0.0) {
        Cs = target.rgb / target.a;
    }
    vec3 multiply = Cb * Cs * 2.0;
    vec3 Cs2 = Cs * 2.0 - 1.0;
    vec3 screen = Cb + Cs2 - Cb * Cs2;
    vec3 B;
    if (Cb.r <= 0.5) {
        B.r = multiply.r;
    } else {
        B.r = screen.r;
    }
    if (Cb.g <= 0.5) {
        B.g = multiply.g;
    } else {
        B.g = screen.g;
    }
    if (Cb.b <= 0.5) {
        B.b = multiply.b;
    } else {
        B.b = screen.b;
    }
    vec4 res;
    res.xyz = (1.0 - source.a) * Cs + source.a * B;
    res.a = source.a + target.a * (1.0-source.a);
    gl_FragColor = vec4(res.xyz * res.a, res.a);
}
