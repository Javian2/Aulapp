#version 300 es
    precision highp float;
    
    in vec3 v_position;
    in vec3 v_normal;
    in vec2 v_texcoord;

    struct TMaterial {
        sampler2D Diffuse;
        sampler2D Specular;
        float Shininess;
    };
    struct TLight {
        vec3 Position;

        vec3 Ambient;
        vec3 Diffuse;
        vec3 Specular;
    };

    uniform TMaterial Material;
    uniform TLight Light;

    vec3 Phong(){
        vec3 n = normalize(v_normal);
        vec3 s = normalize(Light.Position - v_position);
        vec3 v = normalize(-v_position);
        vec3 r = reflect(-s, n);

        vec3 Ambient = Light.Ambient * vec3(texture(Material.Diffuse, v_texcoord));
        vec3 Diffuse = Light.Diffuse * max(dot(s, n), 0.0) * vec3(texture(Material.Diffuse, v_texcoord));

        vec3 Specular = Light.Specular * pow(max(dot(r, v), 0.0), Material.Shininess) * vec3(texture(Material.Specular, v_texcoord));

        return Ambient + Diffuse + Specular;
    }
    
    out vec4 outColor;
    
    void main() {
        outColor = vec4 (Phong(), 1.0);
    }