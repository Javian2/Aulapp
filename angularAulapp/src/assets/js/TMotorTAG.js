function TMotorTAG(vertex, fragment) {

    this.gestorRecursos = new TGestorRecursos();
    this.nodos = [];

    const canvas = document.querySelector("#glCanvas");
    // Initialize the GL context
    const gl = canvas.getContext("webgl2");

    // If we don't have a GL context, give up now

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }
    'use strict';

    //Funcion para cargar los ficheros shader
    var getSourceSynch = function(url) {
        var req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.send(null);
        return (req.status == 200) ? req.responseText : null;
    };

    //Funcion para iniciar el programa, cargar shaders, linkarlos, attach, y borrarlos
    var iniciarPrograma = function() {

        //Cargar shaders
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, getSourceSynch('assets/js/' + vertex));
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(vertexShader))
        };
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, getSourceSynch('assets/js/' + fragment));
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(fragmentShader))
        };

        //Crear programa y linkarlo
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log('Fallo al crear el programa o cargar los shaders en el ' + gl.getProgramInfoLog(program));
        }

        gl.detachShader(program, vertexShader);
        gl.deleteShader(vertexShader);
        gl.detachShader(program, fragmentShader);
        gl.deleteShader(fragmentShader);

        return program;
    }
    const prg = iniciarPrograma();

    //Recuperar localizaciones de las variables de los shaders
    const positionLoc = gl.getAttribLocation(prg, 'position');
    const normalLoc = gl.getAttribLocation(prg, 'normal');
    const texcoordLoc = gl.getAttribLocation(prg, 'texcoord');
    const projectionLoc = gl.getUniformLocation(prg, 'projection');
    const modelViewLoc = gl.getUniformLocation(prg, 'modelView');

    const matDiffuseLoc = gl.getUniformLocation(prg, "Material.Diffuse");
    const matSpecularLoc = gl.getUniformLocation(prg, "Material.Specular");
    const matShininessLoc = gl.getUniformLocation(prg, "Material.Shininess");

    const lightPosLoc = gl.getUniformLocation(prg, "Light.Position");
    const lightAmbientLoc = gl.getUniformLocation(prg, "Light.Ambient");
    const lightDiffuseLoc = gl.getUniformLocation(prg, "Light.Diffuse");
    const lightSpecularLoc = gl.getUniformLocation(prg, "Light.Specular");

    const cubeVertexArray = gl.createVertexArray();


    //añadir atributos para mantenimiento de las cámaras, luces y viewports
    this.crearNodo = function(ent, hijos, padre, traslacion, rotacion, escalado, matrizTransf) {
        var nodo = new TNodo(ent, hijos, padre, traslacion, rotacion, escalado, matrizTransf);

        //Añadir el nuevo nodo como hijo del nodo padre
        if (padre != null)
            padre.addHijo(nodo, padre);

        //Devolver la referencia al nodo creado y anadirlo al array del motor
        this.nodos.push(nodo);
        return nodo;
    }

    this.crearMalla = function(nombre, name, material) {
        var entidad = new TMalla(nombre, name, material);

        this.comprobar(entidad);

        return entidad;
    }

    this.crearTextura = function(nombre) {
        var textura = this.gestorRecursos.getRecurso(nombre);
        //textura.draw(gl);
        return textura;
    }

    this.asignarTextura = function(entidad, textura) {
        entidad.name = textura.name;
    }

    this.crearMaterial = function(nombre) {
        var material = this.gestorRecursos.getRecurso(nombre);
        //material.draw(gl);
        return material;
    }

    this.asignarMaterial = function(entidad, material) {
        entidad.colorDiffuse = material.colorDiffuse;
        entidad.colorSpecular = material.colorSpecular;
        entidad.specularCoef = material.specularCoef;
    }

    //Comprueba que en el gestor esta la entidad cargada y si no lo carga
    this.comprobar = function(entidad) {
        var malla = this.gestorRecursos.getRecurso(entidad.nombre);
        setTimeout(() => {

            entidad.vertices = malla.positions;
            entidad.normales = malla.normals;
            entidad.indices = malla.indexes;
            entidad.uvs = malla.uvs;

            entidad.colorDiffuse = malla.colorDiffuse;
            entidad.colorSpecular = malla.colorSpecular;
            entidad.colorAmbient = malla.colorAmbient;
            entidad.specularCoef = malla.specularCoef;
            entidad.mapDiffuse = malla.mapDiffuse;

            entidad.name = malla.name;
            entidad.image = malla.image;

            //Dibujar la entidad malla
            malla.draw(gl, cubeVertexArray, positionLoc, normalLoc, texcoordLoc);

        }, 200);
    }


    this.activarViewport = function(nViewportFachada, nEscenaFachada) {
        nEscenaFachada.activarViewport(nViewportFachada);
    }
    this.addHijos = function(hijos, padre) {
        padre.addHijo(hijos, padre);
        return padre;
    }

    this.setEntidad = function(nodo, entidad) {
        nodo.setEntidad(entidad);
        return nodo;
    }

    this.activarLuz = function(nLuzFachada, nodo) {
        //luzActiva
        nLuzFachada.setActivada(true);
        nodo.luzActiva.push(nLuzFachada);
    }
    this.actualizarLuz = function(valor) {
        valor *= 0.01;

        motor.nodos.forEach(nodo => {
            if (nodo.getEntidad() instanceof TLuz) {
                nodo.entidad.setAmbientIntensity([valor, valor, valor]);
                nodo.entidad.setDiffuseIntensity([valor, valor, valor]);
                nodo.entidad.setSpecularIntensity([valor, 0, 0]);
                nodo.entidad.actu = true;
            }
        });
    }
    this.posicionarLuz = function(valor) {
        valor *= 0.01;

        motor.nodos.forEach(nodo => {
            if (nodo.getEntidad() instanceof TLuz) {
                nodo.entidad.setPos([valor, valor, valor]);

                nodo.entidad.actu = true;
            }
        });
    }

    this.getLuzActiva = function(nLuzFachada) {
        return nLuzFachada.getActivada();
    }
    this.addCamara = function(nCamFachada, nodo) {
        //camaraActiva. Solo se puede activar una camara.
        let cont = 0;
        //nCamFachada.setActivada(true);
        nodo.camaraActiva.push(nCamFachada);
        for (let i = 0; i < nodo.camaraActiva.length; i++) {
            if (nodo.camaraActiva[i].getActivada() == false) {
                cont++;
            }
        }
        if (cont == nodo.camaraActiva.length) {
            nodo.camaraActiva[nodo.camaraActiva.length - 1].setActivada(true);
        }
    }
    this.activarCamara = function(nCamFachada, activar, nodo) {

        if (activar == true) {
            let stop = false;
            for (let i = 0;
                (i < nodo.camaraActiva.length && stop == false); i++) {
                if (nodo.camaraActiva[i].getActivada() == true) {
                    nodo.camaraActiva[i].setActivada(false);
                    stop == true;
                }
            }
            nCamFachada.setActivada(activar);
        } else {
            console.log("No puedes apagar una cámara si no enciendes otra en su lugar.");
            alert("No puedes apagar una cámara si no enciendes otra en su lugar.");
        }

    }
    this.getCamaraActiva = function(nCamFachada) {
        return nCamFachada.getActivada();
    }

    this.addViewport = function(nViewportFachada, nodo) {
        //nViewportFachada.setActivado(true);
        let cont = 0;
        nodo.viewportActivado.push(nViewportFachada);
        for (let i = 0; i < nodo.viewportActivado.length; i++) {
            if (nodo.viewportActivado[i].getActivado() == false) {
                cont++;
            }
        }
        if (cont == nodo.viewportActivado.length) {
            nodo.viewportActivado[nodo.viewportActivado.length - 1].setActivado(true);
        }

    }

    this.activarViewport = function(nViewportFachada, activar, nodo) {

        if (activar == true) {
            let stop = false;
            for (let i = 0;
                (i < nodo.viewportActivado.length && stop == false); i++) {
                if (nodo.viewportActivado[i].getActivado() == true) {
                    nodo.viewportActivado[i].setActivado(false);
                    stop == true;
                }
            }
            nViewportFachada.setActivado(activar);
        } else {
            console.log("No puedes desactivar un viewport si no activas otro en su lugar.");
            alert("No puedes desactivar un viewport si no activas otro en su lugar.");
        }

    }
    this.getViewportActivo = function(nViewportFachada) {
        return nViewportFachada.getActivado();
    }

    this.crearCamara = function(perspectiva, cerca, lejos, escena) {
        camara = new TCamara(perspectiva, cerca, lejos, gl);
        camara = this.crearNodo(camara, null, escena, null, null, null, null);
        return camara;
    }
    this.crearLuz = function(escena) {
        var luz = new TLuz();
        luz = this.crearNodo(luz, null, escena, null, null, null, null);
        return luz;
    }
    this.crearViewport = function(x, y) {
        /*let posX = 0;
        let posY = 0;
        let alto = 50;
        let ancho = 50;
        var viewport = new TViewport(posX, posY, alto, ancho);*/
        //posición (x,y) en la ventana y tamaño (alto, ancho)
        var viewport = new TViewport(gl.viewport(x, y, gl.canvas.width, gl.canvas.height));
        return viewport;
    }
    this.alejar = function(nodo) {
        if (nodo) {
            nodo.escalar([0.95, 0.95, 0.95]);
        } else {
            motor.nodos.forEach(nodo => {
                if (nodo.getEntidad() instanceof TMalla) {
                    nodo.escalar([0.95, 0.95, 0.95]);
                }
            });
        }
    }
    this.acercar = function(nodo) {
        if (nodo) {
            nodo.escalar([1.05, 1.05, 1.05]);
        } else {
            motor.nodos.forEach(nodo => {
                if (nodo.getEntidad() instanceof TMalla) {
                    nodo.escalar([1.05, 1.05, 1.05]);
                }
            });
        }
    }
    this.getCanvas = function() {
        return canvas;
    }

    this.dibujarEscena = function() {

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        //gl.clearColor(0.5, 0.7, 1.0, 1.0);   Lo quito porq con el delay de texturas no va
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.useProgram(prg);
        gl.bindVertexArray(cubeVertexArray);
        // Picking unit 6 just to be different. The default of 0
        // would render but would show less state changing.


        //---------------------TEXTURAS------------------------------------------------------------------

        // Create a texture.  Textura a color azul por si no se carga la correspondiente
        var texture = gl.createTexture();
        // use texture unit 0
        gl.activeTexture(gl.TEXTURE0 + 0);
        // bind to the TEXTURE_2D bind point of texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 205]));

        //---------------------fin TEXTURAS------------------------------------------------------------------


        //Recorrer nodos, empezando por el nodo padre(escena)
        this.nodos[0].recorrerArbol(this.nodos[0], gl, lightAmbientLoc, lightDiffuseLoc, lightSpecularLoc, lightPosLoc, projectionLoc, modelViewLoc, matDiffuseLoc, matSpecularLoc, matShininessLoc);


    }
    this.recorrerEscena = function() {
        this.nodos[0].recorrerArbol(this.nodos[0], gl, lightAmbientLoc, lightDiffuseLoc, lightSpecularLoc, lightPosLoc, projectionLoc, modelViewLoc, matDiffuseLoc, matSpecularLoc, matShininessLoc);
    }

}