function inicializarShaders(positions, normals, uvs, indices) {
    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl2");

    // If we don't have a GL context, give up now

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    // Vertex shader program
    const vsSource = `# version 300 es
    layout (location = 0) in vec4 VertexPosition;
    layout (location = 1) in vec3 VertexNormal;
    layout (location = 2) in vec2 TextureCoord;

    out vec3 Position;
    out vec3 Normal;
    out vec2 TexCoords;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uNormalMatrix;
    uniform mat4 uMVP;

    void main()
    {

        
        Position = vec3 (uModelViewMatrix * VertexPosition);

        Normal = normalize(mat3(uNormalMatrix) * VertexNormal);

        TexCoords = TextureCoord;

        gl_Position = uMVP * VertexPosition;
    
    }
  `;

    // Fragment shader program
    const fsSource = `# version 300 es
    precision mediump float;
    in vec3 Position;
    in vec3 Normal;
    in vec2 TexCoords;

    layout (location = 0) out vec4 FragColor;

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
        vec3 n = normalize(Normal);
        vec3 s = normalize(Light.Position - Position);
        vec3 v = normalize(-Position);
        vec3 r = reflect(-s, n);

        vec3 Ambient = Light.Ambient * vec3(texture(Material.Diffuse, TexCoords));
        vec3 Diffuse = Light.Diffuse * max(dot(s, n), 0.0) * vec3(texture(Material.Diffuse, TexCoords));

        vec3 Specular = Light.Specular * pow(max(dot(r, v), 0.0), Material.Shininess) * vec3(texture(Material.Specular, TexCoords));

        return Ambient + Diffuse + Specular;
    }

    void main()
    {
      FragColor = vec4 (Phong(), 1.0);
    }
  `;


    //Crear el programa y linkarlo a los shaders que acabamos de crear
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vsSource);
    gl.shaderSource(fragmentShader, fsSource);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);


    //Comprobaciones de si los shaders estan correctamente
    var success = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
    if (!success) {
        console.log("Error al compilar shader: ");
        console.log(gl.getShaderInfoLog(vertexShader));
    }

    success = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
    if (!success) {
        console.log("Error al compilar shader: ");
        console.log(gl.getShaderInfoLog(fragmentShader));
    }


    const programLightingMap = gl.createProgram();
    gl.attachShader(programLightingMap, vertexShader);
    gl.attachShader(programLightingMap, fragmentShader);
    gl.linkProgram(programLightingMap);

    console.log(gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS));
    console.log(gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS));

    gl.useProgram(programLightingMap);
    console.log(gl.getProgramParameter(programLightingMap, gl.LINK_STATUS));


    //Llamar a la funcion e inicializar buffers             //Materiales y texturas
    const buffers = initBuffers(gl, positions, normals, uvs, indices);


    /* 
        var diffuseMap = new Uint8Array();
        var specularMap = new Uint8Array();
                                                                                                TODO(revisar)
        gl.GenTextures(1, diffuseMap);
        gl.GenTextures(1, specularMap); 
 */
    const diffuseMap = gl.createTexture();
    const specularMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, diffuseMap);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));
    gl.bindTexture(gl.TEXTURE_2D, specularMap);
    // Fill the texture with a 1x1 blue pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255]));

    // Asynchronously load an image
    var image = new Image();
    image.src = "Steve.png";
    image.addEventListener('load', function() {
        //cargar la textura que contiene el mapa difuso
        gl.bindTexture(gl.TEXTURE_2D, diffuseMap);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); //quitado  image.width, image.height, 0,

        // Check if the image is a power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn off mips and set wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            //No validas dice--------------------------------------------------------------------------------------------TODO
            /*             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST_MIPMAP_NEAREST); */
        }
    });

    image.addEventListener('load', function() {
        //cargar la textura que contiene el mapa especular
        gl.bindTexture(gl.TEXTURE_2D, specularMap);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image); //quitado  image.width, image.height, 0,

        // Check if the image is a power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn off mips and set wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            /*             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, 0); */
        }
    });

    function isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }


    const modelViewLoc = gl.getUniformLocation(programLightingMap, "uModelViewMatrix");
    const normalLoc = gl.getUniformLocation(programLightingMap, "uNormalMatrix");
    const mvpLoc = gl.getUniformLocation(programLightingMap, "uMVP");

    const matDiffuseLoc = gl.getUniformLocation(programLightingMap, "Material.Diffuse");
    const matSpecularLoc = gl.getUniformLocation(programLightingMap, "Material.Specular");
    const matShininessLoc = gl.getUniformLocation(programLightingMap, "Material.Shininess");

    const lightPosLoc = gl.getUniformLocation(programLightingMap, "Light.Position");
    const lightAmbientLoc = gl.getUniformLocation(programLightingMap, "Light.Ambient");
    const lightDiffuseLoc = gl.getUniformLocation(programLightingMap, "Light.Diffuse");
    const lightSpecularLoc = gl.getUniformLocation(programLightingMap, "Light.Specular");

    //Estas se las tendremos que pasar por parametros                         TODO
    const modelViewMatrix = glMatrix.mat4.create();
    const normalMatrix = glMatrix.mat4.create();
    const MVP = glMatrix.mat4.create();


    gl.uniformMatrix4fv(modelViewLoc, false, modelViewMatrix); //cambiado    1, gl.FALSE,   por   false
    gl.uniformMatrix4fv(normalLoc, false, normalMatrix);
    gl.uniformMatrix4fv(mvpLoc, false, MVP);

    gl.uniform1i(matDiffuseLoc, 0);
    gl.uniform1i(matSpecularLoc, 1);
    gl.uniform1f(matShininessLoc, Shininess);

    gl.uniform3f(lightPosLoc, PosicionLux.x, PosicionLux.y, PosicionLux.z);
    gl.uniform3f(lightAmbientLoc, LuzAmbiente);
    gl.uniform3f(lightDiffuseLoc, LuzDifusa);
    gl.uniform3f(lightSpecularLoc, LuzEspecular);

    //Enlazar y activar texturas
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, diffuseMap);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, specularMap);

    //Dibujar
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
    gl.drawElements(gl.TRIANGLES, buffers.indices.length, gl.UNSIGNED_SHORT, 0);


    // initBuffers
    function initBuffers(gl, positions, normals, uvs, indices) { //-----------------------Quitado el positions.length

        // Buffer para vertices
        const positionBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 4, gl.FLOAT, gl.FALSE, 0, null);

        // Buffer para normales
        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, 0, null);


        // Buffer para Coordenadas de textura (uv)
        const textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 0, null);


        // Buffer para Coordenadas de textura (uv)
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        return {
            position: positionBuffer,
            normal: normalBuffer,
            textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        };

    }

}