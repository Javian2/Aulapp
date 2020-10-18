function TGestorRecursos(nombre) {

    this.vectorMallas = [];
    this.vectorTexturas = [];
    this.vectorMateriales = [];

    this.nombre = nombre;

    this.getRecurso = function(nombre) {
        var encontradoMalla = false;
        var encontradoMaterial = false;
        var encontradoTextura = false;
        let malla;
        let material;
        let textura;

        let ext = nombre.substring(nombre.lastIndexOf('.')).toLowerCase(); //Coge la extensión del archivo en minúsculas
        switch (ext) {
            case '.png':
                for (var k = 0; k < this.vectorTexturas.length && encontradoTextura == false; k++) {
                    if (this.vectorTexturas[k].nombre == nombre) {
                        encontradoTextura = true;
                        return this.vectorTexturas[k];
                    }
                }
                if (!encontradoTextura) {
                    textura = new TRecursoTextura(nombre);
                    textura.cargarFichero(nombre);
                    setTimeout(() => {
                        this.vectorTexturas.push(textura);
                    }, 200);
                    return textura;
                }
                break;
            case '.jpg':
                for (var k = 0; k < this.vectorTexturas.length && encontradoTextura == false; k++) {
                    if (this.vectorTexturas[k].nombre == nombre) {
                        encontradoTextura = true;
                        return this.vectorTexturas[k];
                    }
                }
                if (!encontradoTextura) {
                    textura = new TRecursoTextura(nombre);
                    textura.cargarFichero(nombre);
                    setTimeout(() => {
                        this.vectorTexturas.push(textura);
                    }, 200);
                    return textura;
                }
                break;
            case '.jpeg':
                for (var k = 0; k < this.vectorTexturas.length && encontradoTextura == false; k++) {
                    if (this.vectorTexturas[k].nombre == nombre) {
                        encontradoTextura = true;
                        return this.vectorTexturas[k];
                    }
                }
                if (!encontradoTextura) {
                    textura = new TRecursoTextura(nombre);
                    textura.cargarFichero(nombre);
                    setTimeout(() => {
                        this.vectorTexturas.push(textura);
                    }, 200);
                    return textura;
                }
                break;

            case '.json':
                //Buscar en los vectores de mallas, texturas y materiales 
                for (var i = 0; i < this.vectorMallas.length && !encontradoMalla; i++) {
                    if (this.vectorMallas[i].nombre == nombre) {
                        encontradoMalla = true;
                        return this.vectorMallas[i];
                    }
                }
                if (!encontradoMalla) {

                    malla = new TRecursoMalla(nombre);
                    malla.cargarFichero(nombre);
                    setTimeout(() => {
                        this.vectorMallas.push(malla);
                    }, 200);
                    return malla;
                }
                break;
            case '.mtl':
                for (var j = 0; j < this.vectorMateriales.length && encontradoMaterial == false; j++) {
                    if (this.vectorMateriales[j].nombre == nombre) {
                        encontradoMaterial = true;
                        return this.vectorMateriales[i];
                    }
                }
                if (!encontradoMaterial) {
                    material = new TRecursoMaterial(nombre);
                    material.cargarFichero(nombre);
                    setTimeout(() => {
                        this.vectorMateriales.push(material);
                    }, 200);
                    return material;
                }
                break;
            default:
                return null;
        }
    }

}

function TRecurso(nombre) {

    nombre = nombre;

    this.getNombre = function() {
        return this.nombre;
    }

    this.setNombre = function(nombre) {
        this.nombre = nombre;
    }
}


function TRecursoMalla(nombre) {

    this.positions = [];
    this.normals = [];
    this.indexes = [];
    this.uvs = [];

    TRecurso.call(this, nombre);

    this.cargarFichero = function(nombre) {

        var req = new XMLHttpRequest();
        //req.responseType = 'json';
        req.open('GET', nombre, true);

        req.onreadystatechange = function() {

            if (req.readyState === 4 && req.status === 200 && nombre) {
                var jsonResponse = req.response;
                var texto = JSON.parse(jsonResponse);

                if (texto.data) {
                    TRecursoMalla.prototype.positions = texto.data.attributes.position.array;
                    TRecursoMalla.prototype.normals = texto.data.attributes.normal.array;
                    TRecursoMalla.prototype.indexes = texto.data.index.array;
                    if (texto.data.attributes.uv)
                        TRecursoMalla.prototype.uvs = texto.data.attributes.uv.array;
                } else if (texto.geometries) {
                    //inicializar estas variables para poder hacer push
                    TRecursoMalla.prototype.positions = [];
                    TRecursoMalla.prototype.normals = [];
                    TRecursoMalla.prototype.indexes = [];
                    TRecursoMalla.prototype.uvs = [];
                    texto.geometries.forEach(geometrie => {
                        //Anadir cada array de vertices, normales, etc en el array de arrays de la malla
                        if (geometrie.data) {
                            TRecursoMalla.prototype.positions.push(geometrie.data.vertices);
                            TRecursoMalla.prototype.normals.push(geometrie.data.normals);
                            TRecursoMalla.prototype.indexes.push(geometrie.data.faces);
                            TRecursoMalla.prototype.uvs.push(geometrie.data.uvs);
                        }

                    });

                } else if (texto.faces) {
                    //inicializar estas variables para poder hacer push
                    TRecursoMalla.prototype.positions = texto.vertices;
                    TRecursoMalla.prototype.normals = texto.normals;
                    TRecursoMalla.prototype.indexes = texto.faces;
                    TRecursoMalla.prototype.uvs = texto.uvs;
                    console.log(texto.vertices);

                }

            }

        };
        req.send(null);

        setTimeout(() => {
            //Una vez leido el json y guardado en la variables, se guardan en las variables de la malla
            this.positions = TRecursoMalla.prototype.positions;
            this.normals = TRecursoMalla.prototype.normals;
            this.indexes = TRecursoMalla.prototype.indexes;
            this.uvs = TRecursoMalla.prototype.uvs;
        }, 200);
    }

    this.draw = function(gl, cubeVertexArray, positionLoc, normalLoc, texcoordLoc) {
        //Cargar buffers de malla


        // vertex positions for a cube
        const cubeVertexPositions = new Float32Array(this.positions);
        // vertex normals for a cube
        const cubeVertexNormals = new Float32Array(this.normals);
        // vertex texture coordinates for a cube
        const cubeVertexTexcoords = new Float32Array(this.uvs);

        const cubeVertexIndices = new Uint16Array(this.indexes);

        gl.bindVertexArray(cubeVertexArray);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, cubeVertexPositions, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(
            positionLoc, // location
            3, // size (components per iteration)
            gl.FLOAT, // type of to get from buffer
            false, // normalize
            0, // stride (bytes to advance each iteration)
            0, // offset (bytes from start of buffer)
        );

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, cubeVertexNormals, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(normalLoc);
        gl.vertexAttribPointer(
            normalLoc, // location
            3, // size (components per iteration)
            gl.FLOAT, // type of to get from buffer
            false, // normalize
            0, // stride (bytes to advance each iteration)
            0, // offset (bytes from start of buffer)
        );

        const texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, cubeVertexTexcoords, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(texcoordLoc);
        gl.vertexAttribPointer(
            texcoordLoc, // location
            2, // size (components per iteration)
            gl.FLOAT, // type of to get from buffer
            false, // normalize
            0, // stride (bytes to advance each iteration)
            0, // offset (bytes from start of buffer)
        );

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndices, gl.STATIC_DRAW);

        gl.bindVertexArray(null);


    }

}


function TRecursoTextura(nombre) {

    name = "";

    TRecurso.call(this, nombre);

    this.cargarFichero = function(nombre) {
        this.name = nombre;
    }

    this.draw = function() {
        console.log("Dibuja textura en la entidad TMalla");
    }

}



function TRecursoMaterial(nombre) {

    //Estas son las variables que necesitaremos para nuestro shader
    this.colorDiffuse = []; //[0.64, 0.64, 0.64],
    this.colorSpecular = []; //[0.05, 0.05, 0.05],
    this.colorAmbient = []; //[0.64, 0.64, 0.64],
    this.specularCoef = 0; //0 - 100
    this.mapDiffuse = "";

    TRecurso.call(this, nombre);

    this.cargarFichero = function(nombre) {

        var req = new XMLHttpRequest();
        req.open('GET', nombre, true);

        req.onreadystatechange = function() {

            if (req.readyState === 4 && req.status === 200 && nombre) {
                var jsonResponse = req.response;
                var texto = JSON.parse(jsonResponse);

                if (texto.geometries) {
                    TRecursoMaterial.prototype.colorDiffuse = [];
                    TRecursoMaterial.prototype.colorSpecular = [];
                    TRecursoMaterial.prototype.colorAmbient = [];
                    TRecursoMaterial.prototype.specularCoef = 0;
                    TRecursoMaterial.prototype.mapDiffuse = "";

                    texto.geometries.forEach(objeto => {

                        if (objeto.materials) {

                            objeto.materials.forEach(final => {
                                TRecursoMaterial.prototype.colorDiffuse.push(final.colorDiffuse);
                                TRecursoMaterial.prototype.colorSpecular.push(final.colorSpecular);
                                TRecursoMaterial.prototype.colorAmbient.push(final.colorAmbient);
                                TRecursoMaterial.prototype.specularCoef = (final.specularCoef);
                                TRecursoMaterial.prototype.mapDiffuse = (final.mapDiffuse);
                            })
                        }
                    })
                } else if (texto.materials) {
                    TRecursoMaterial.prototype.colorDiffuse = texto.materials[0].colorDiffuse;
                    TRecursoMaterial.prototype.colorSpecular = texto.materials[0].colorSpecular;
                    TRecursoMaterial.prototype.colorAmbient = texto.materials[0].colorAmbient;
                    TRecursoMaterial.prototype.specularCoef = texto.materials[0].specularCoef;
                    TRecursoMaterial.prototype.mapDiffuse = texto.materials[0].mapDiffuse;
                }
            }
        };
        req.send(null);

        setTimeout(() => {
            this.nombre = nombre;
            this.specularCoef = TRecursoMaterial.prototype.specularCoef;
            this.mapDiffuse = TRecursoMaterial.prototype.mapDiffuse;
            this.colorDiffuse = TRecursoMaterial.prototype.colorDiffuse;
            this.colorSpecular = TRecursoMaterial.prototype.colorSpecular;
            this.colorAmbient = TRecursoMaterial.prototype.colorAmbient;

        }, 200);
    }

    this.draw = function() {
        //Cargar buffers de material

    }

}