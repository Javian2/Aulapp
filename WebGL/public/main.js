//AHORA LE PASO POR PARÁMETRO EL MODELO Y LA TEXTURA PARA LLAMARLO DESDE LA INTERFAZ

var motor;

var escena;
let nodo;
let anim;


function main() {
    motor = new TMotorTAG("shaders/shader.vert", "shaders/shader.frag");
    escena = motor.crearNodo();
    //CUANDO SELECCIONE EL MODELO QUE QUIERE, SE ABRE. POR DEFECTO DISPLAY: NONE


    //Se crea la fachada, lo que es el motor pasandole los shaders

    //Creamos las camaras
    let camara = motor.crearCamara(true, 0.1, 10, escena);


    //Se crea la luz y se le asigna sus intesidades
    let luz = motor.crearLuz(escena);
    luz.entidad.setAmbientIntensity([0.5, 0.5, 0.5]);
    luz.entidad.setDiffuseIntensity([0.5, 0.5, 0.5]);
    luz.entidad.setSpecularIntensity([0.5, 0.0, 0.0]);
    luz.entidad.setPos([0.5, 0.0, 0.0]);



    //AÑADIMOS LAS LUCES AL ARRAY DE LUCES
    motor.activarLuz(luz.entidad, escena);


    //AÑADIMOS LAS CÁMARAS AL ARRAY DE CÁMARAS
    motor.addCamara(camara.entidad, escena);


    //TRABAJADO CON LOS VIEWPORTS
    //viewport 1
    let viewport1 = motor.crearViewport(0, 0);

    //AÑADIMOS LOS VIEWPORTS AL ARRAY DE VIEWPORTS
    //viewport 1
    motor.addViewport(viewport1, escena);



    console.log(motor);

    setTimeout(() => {
        motor.dibujarEscena();
    }, 200);

}

function modelos(modelo, texture) {
    document.getElementById("mydiv").style.display = "inline";
    //Si hay animacion en curso, la para
    if (anim)
        window.cancelAnimationFrame(anim);

    //Es para eliminar el ultimo nodo malla si lo hay
    motor.nodos.forEach(nodo => {
        if (nodo.getEntidad() instanceof TMalla) {
            console.log("Es malla");
            const index = motor.nodos.indexOf(nodo);
            if (index > -1) {
                motor.nodos.splice(index, 1);
            }

        }
    });

    //Una vez hemos parado la animacion anterior y borrado el nodo anterior, creamos pintamos y animamos el nuevo
    setTimeout(() => {
        nodo = motor.crearNodo(null, null, escena, null, null, null, null);

        //Creamos una textura
        let textura = motor.crearTextura(texture);

        //Crear textura
        let material = motor.crearMaterial('models/cuboMaterial.mtl');

        //Creamos la entidad al nodo, con textura y/o material si lo queremos, y luego le asignamos la entidad al nodo

        let entidad = motor.crearMalla('models/' + modelo, textura.name, material);
        entidad.actuTexturas = true;
        motor.setEntidad(nodo, entidad);
        setTimeout(() => {
            motor.dibujarEscena();
        }, 200);

        //Activar mover el modelo con el raton
        setTimeout(() => {
            animarModelos();
        }, 200);
    }, 100);

}

function cambiarLuz(valor) {
    motor.actualizarLuz(valor);
}

function posicionarLuz(valor) {
    motor.posicionarLuz(valor);
}

function acercar() {
    motor.acercar();
}

function alejar() {
    motor.alejar();
}

//CIERRA EL DIV
function cerrarModelos() {
    document.getElementById("mydiv").style.display = "none";
    window.cancelAnimationFrame(anim);
}

function girarModeloDerecha() {
    console.log("derecha");
    nodo.rotar([0, 0, 1], 1);
    nodo.rotar([0, 1, 0], 30);
    motor.recorrerEscena();
}

function girarModeloIzquierda() {
    console.log("izquierda");
    nodo.rotar([0, 0, 1], 1);
    nodo.rotar([0, -1, 0], 30);
    motor.recorrerEscena();
}

function girarModeloAbajo() {
    console.log("abajo")
    nodo.rotar([0, 0, 1], 1);
    nodo.rotar([1, 0, 0], 30);
    motor.recorrerEscena();
}

function girarModeloArriba() {
    console.log("arriba")
    nodo.rotar([0, 0, 1], 1);
    nodo.rotar([-1, 0, 0], 30);
    motor.recorrerEscena();
}

function animarModelos() {
    let canvas = motor.getCanvas();
    var drag = false;
    var old_x, old_y;
    var dX = 0,
        dY = 0;
    var THETA = 0,
        PHI = 0;
    canvas.scroll = function(e) {
        nodo.escalar([0.9, 0.9, 0.9]);
        return false;
    }
    canvas.onmousedown = function(e) {
        drag = true;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
        return false;
    }
    canvas.onmouseup = function(e) {
        drag = false;
    }
    canvas.onmousemove = function(e) {
        if (!drag) return false;
        dX = (e.pageX - old_x) * 2 * Math.PI / canvas.width,
            dY = (e.pageY - old_y) * 2 * Math.PI / canvas.height;
        THETA += dX;
        PHI += dY;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
    }
    canvas.onwheel = function(e) {
        scroll = true;
        if (e.deltaY < 0) {
            motor.acercar(nodo);
        } else if (e.deltaY > 0) {
            motor.alejar(nodo);
        }
    }

    window.onmousedown = function(e) {
        scroll = false;
    }

    function noScroll() {
        window.scrollTo(0, 0);
    }
    var animate = function(time) {

        if (!scroll) {
            window.removeEventListener('scroll', noScroll);
        } else {
            window.addEventListener('scroll', noScroll)
        }

        if (!drag) {
            THETA *= 0.95, PHI *= 0.95;
        } else {
            THETA *= 0.99, PHI *= 0.99;
        }
        nodo.rotar([0, 1, 0], THETA);
        nodo.rotar([1, 0, 0], PHI);

        setTimeout(() => {
            motor.recorrerEscena();
        }, 55);

        anim = window.requestAnimationFrame(animate);
    }
    animate(0);
}

function abrirEntorno() {
    document.getElementById("mydiv").style.display = "inline";
    main();
}