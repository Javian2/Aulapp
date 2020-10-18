//Propiedades:
function TNodo(entidad, hijos, padre, traslacion, rotacion, escalado, matrizTransf) {

    this.hijos = [];
    this.padre = null;
    this.traslacion = [0, 0, -3];
    this.rotacion = [0, 0, 0];
    this.escalado = [1, 1, 1];
    this.angle = 90;
    this.matrizTransf = glMatrix.mat4.create();
    this.esTraslacion = true;
    this.esRotacion = true;
    this.esEscalado = true;

    if (entidad != null)
        this.entidad = entidad;
    if (hijos != null)
        this.hijos = hijos;
    if (padre != null)
        this.padre = padre;
    if (traslacion != null)
        this.traslacion = traslacion; //cuando se inicialice, son las matrices de posicion del Nodo.
    if (rotacion != null)
        this.rotacion = rotacion;
    if (escalado != null)
        this.escalado = escalado;
    if (matrizTransf != null)
        this.matrizTransf = matrizTransf;
    //añado esto nuevo
    this.luzActiva = [];
    this.camaraActiva = [];
    this.viewportActivado = [];

    //Funciones
    this.addHijo = function(hijo, padre) {
        let insertado = false;

        if (this.hijos.length == 0) {
            this.hijos.push(hijo);
        } else {

            for (let i = 0; i < this.hijos.length && insertado == false; i++) {
                if (this.hijos[i + 1] == null) {
                    this.hijos.push(hijo);
                    insertado = true;
                }
            }
            for (let j = 0; j < this.hijos.length; j++) {
                this.hijos[j].padre = padre;
            }
            return insertado;
        }

    };
    this.remHijo = function(hijo) {
        let borrado = false;
        for (let i = 0; i < this.hijos.length && borrado == false; i++) {
            if (this.hijos[i] == hijo) {
                console.log("Borrado");
                this.hijos.splice(i, 1);
                borrado = true;
            }
        }
        return borrado;
    };
    this.setEntidad = function(entidad) {
        this.entidad = entidad;
    };
    this.getEntidad = function() {
        return this.entidad;
    };
    this.getPadre = function() {
        return this.padre;
    };


    this.recorrerArbol = function(TNodo, gl, lightAmbientLoc, lightDiffuseLoc, lightSpecularLoc, lightPosLoc, projectionLoc, modelViewLoc, matDiffuseLoc, matSpecularLoc, matShininessLoc) { //No dibujará solo cuando sea una malla, tambien dibujara luces, camara etc
        if (TNodo) {
            if (TNodo.entidad) {
                TNodo.entidad.dibujar(gl, lightAmbientLoc, lightDiffuseLoc, lightSpecularLoc, lightPosLoc, projectionLoc, modelViewLoc, TNodo, matDiffuseLoc, matSpecularLoc, matShininessLoc);
            }
            TNodo.hijos.forEach(hijo => {
                hijo.recorrerArbol(hijo, gl, lightAmbientLoc, lightDiffuseLoc, lightSpecularLoc, lightPosLoc, projectionLoc, modelViewLoc, matDiffuseLoc, matSpecularLoc, matShininessLoc);
            });
        }
    }

    this.calcularMatriz = function() {

        if (this.esTraslacion) {
            this.trasladar(this.traslacion);
            this.esTraslacion = false;
        }
        if (this.esEscalado) {
            this.escalar(this.escalado);
            this.esEscalado = false;
        }
        if (this.esRotacion) {
            this.rotar(this.rotacion, this.angle);
            this.esRotacion = false;
        }

    };

    this.setTraslacion = function(traslacion) {
        this.traslacion = traslacion;
        this.esTraslacion = true;
    };
    this.setRotacion = function(rotacion) {
        this.rotacion = rotacion;
        this.esRotacion = true;
    };
    this.setEscalado = function(escalado) {
        this.escalado = escalado;
        this.esEscalado = true;
    };
    this.trasladar = function(vector) {
        glMatrix.mat4.translate(this.matrizTransf, this.matrizTransf, vector);
        this.esTraslacion = true;
    };
    this.rotar = function(vec, ang) {
        let rad = (ang * Math.PI) / 180;
        glMatrix.mat4.rotate(this.matrizTransf, this.matrizTransf, rad, vec);
        this.esRotacion = true;
    };
    this.escalar = function(vector) {
        glMatrix.mat4.scale(this.matrizTransf, this.matrizTransf, vector);
        this.esEscalado = true;
    };
    this.getTraslacion = function() {
        return this.traslacion;
    };
    this.getRotacion = function() {
        return this.rotacion;
    };
    this.getEscalado = function() {
        return this.escalado;
    };
    this.setMatrizTransf = function(matrizTransf) {
        this.matrizTransf = matrizTransf;
    };
    this.getMatrizTransf = function() {
        return this.matrizTransf;
    };

}

function TEntidad(nombre) {

    this.nombre = nombre;
    this.activada = false;

    this.dibujar = function() {}

    this.setActivada = function(activar) {
        this.activada = activar;
    }
    this.getActivada = function() {
        return this.activada;
    }
}

//function TLuz(intensidad, posicion) {
function TLuz() {
    //por defecto
    this.ai = [0.0, 0.0, 0.0];
    this.di = [0.0, 0.0, 0.0];
    this.si = [0.0, 0.0, 0.0];
    this.pos = [0.5, 0.0, 0.0];

    this.actu = true;


    TEntidad.call(this);

    this.setAmbientIntensity = function(intent) {
        this.ai = intent;
    };
    this.getAmbientIntensity = function() {
        return this.ai;
    };
    this.setDiffuseIntensity = function(intent) {
        this.di = intent;
    };
    this.getDiffuseIntensity = function() {
        return this.di;
    };
    this.setSpecularIntensity = function(intent) {
        this.si = intent;
    };
    this.getSpecularIntensity = function() {
        return this.si;
    };
    this.setPos = function(intent) {
        this.pos = intent;
    };
    this.getPos = function() {
        return this.pos;
    };

    this.dibujar = function(gl, lightAmbientLoc, lightDiffuseLoc, lightSpecularLoc, lightPosLoc) {

        if (this.activada && this.actu) {
            gl.uniform3fv(lightPosLoc, this.pos);

            gl.uniform3fv(lightAmbientLoc, this.ai);
            gl.uniform3fv(lightDiffuseLoc, this.di);
            gl.uniform3fv(lightSpecularLoc, this.si);
            this.actu = false;
        }


    };
}

function TCamara(perspectiva, cerca, lejos, gl) {

    this.esPerspectiva = perspectiva;
    this.cercano = cerca;
    this.lejano = lejos;
    //this.matriz = glMatrix.mat4.create();

    //Camara para shader
    this.projection = m4.perspective(
        60 * Math.PI / 180, // fov
        gl.canvas.clientWidth / gl.canvas.clientHeight, // aspect
        cerca, // near
        lejos, // far
    );

    TEntidad.call(this);

    this.setCercano = function(cercano) {
        this.cercano = cercano;
    }

    this.setLejano = function(lejano) {
        this.lejano = lejano;
    }

    this.setPerspectiva = function(f1, f2) {

            this.matriz = glMatrix.mat4.create();
            var alto = Math.tan(f1 * Math.PI / 360);
            var ancho = f2 * alto;

            this.matriz[0] = 1 / alto;
            this.matriz[5] = 1 / ancho;
            this.matriz[10] = (this.lejano + this.cercano) / (this.cercano - this.lejano);
            this.matriz[11] = 2 * this.lejano * this.cercano / (this.cercano - this.lejano);
            this.matriz[14] = -1;
            this.matriz[15] = 0;

            this.esPerspectiva = true;

        }
        //f1 lejos, f2 cerca
    this.setParalela = function(f1, f2, arriba, abajo, izquierda, derecha) {

        this.matriz = glMatrix.mat4.create();

        this.matriz[0] = 2 / (derecha - izquierda);
        this.matriz[3] = -((derecha + izquierda) / (derecha - izquierda));
        this.matriz[5] = 2 / (arriba - abajo);
        this.matriz[7] = -((arriba + abajo) / (arriba - abajo));
        this.matriz[10] = 2 / (f1 - f2);
        this.matriz[11] = -((f1 + f2) / (f1 - f2));
        this.matriz[14] = 0;
        this.matriz[15] = 1;

    }

    this.dibujar = function(gl, lightAmbientLoc, lightDiffuseLoc, lightSpecularLoc, lightPosLoc, projectionLoc) {
        //console.log("Dibujo camaras");
        gl.uniformMatrix4fv(projectionLoc, false, this.projection);
    };
}

function TMalla(nombre, name, material) {
    //Malla
    this.vertices = [];
    this.normales = [];
    this.indices = [];
    this.uvs = [];
    //Materiales
    this.colorDiffuse;
    this.colorSpecular;
    this.specularCoef = 0;
    //this.colorAmbient = [];
    //this.mapDiffuse = "";
    this.actuMateriales = true;

    //Texturas
    this.actuTexturas = true;
    if (name) {
        this.name = name;
    }
    if (material) {
        this.colorDiffuse = material.colorDiffuse;
        this.colorSpecular = material.colorSpecular;
        this.specularCoef = material.specularCoef;
    }

    this.nombre = nombre;

    TEntidad.call(this, nombre);

    this.dibujar = function(gl, lightAmbientLoc, lightDiffuseLoc, lightSpecularLoc, lightPosLoc, projectionLoc, modelViewLoc, nodo, matDiffuseLoc, matSpecularLoc, matShininessLoc) {

        if (name && this.actuTexturas) {
            // Create a texture.
            var texture = gl.createTexture();
            // use texture unit 0
            gl.activeTexture(gl.TEXTURE0 + 0);
            // bind to the TEXTURE_2D bind point of texture unit 0
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Fill the texture with a 1x1 blue pixel.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 205]));
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

            // Asynchronously load an image
            var image = new Image();
            image.src = "assets/js/models/" + name;

            setTimeout(() => {
                // Now that the image has loaded make copy it to the texture.
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
            }, 53);
            this.actuTexturas = false;

        }

        if (material && this.actuMateriales) {
            gl.uniform1i(matDiffuseLoc, material.colorDiffuse);
            gl.uniform1i(matSpecularLoc, material.colorSpecular);
            gl.uniform1f(matShininessLoc, 0.01 * material.specularCoef);
            this.actuMateriales = false;
        }



        //Calcular la matrix model, sacada del nodo y pasarla al shader
        nodo.calcularMatriz();
        gl.uniformMatrix4fv(modelViewLoc, false, nodo.matrizTransf);


        if (this.indices && this.indices.length >= 0) {
            setTimeout(() => {
                gl.drawElements(
                    gl.TRIANGLES,
                    this.indices.length, // num vertices to process
                    gl.UNSIGNED_SHORT, // type of indices
                    0, // offset on bytes to indices
                );
            }, 55);
        }

    }

}

function TViewport(entidad) {

    this.entidad = entidad
    this.activado = false;


    this.setActivado = function(activar) {
        this.activado = activar;
    }
    this.getActivado = function() {
        return this.activado;
    }

    /*this.getX = function() {
        return this.posX;
    }
    this.getY = function() {
        return this.posY;
    }
    this.getAlto = function() {
        return this.alto;
    }
    this.getAncho = function() {
        return this.ancho;
    }*/
}