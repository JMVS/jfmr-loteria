// REFERENCIAS A LOS ELEMENTOS DEL DOM -----------------------------------

const elementoRecuadroUltimosNumeros = document.querySelector('.recuadro-ultimos-numeros');
const elementoBolasUltimosNumeros = document.querySelector('.bolas-ultimos-numeros');
const elementoHora = document.querySelector('.reloj');
const elementoBolaActual = document.querySelector('.bola-numero');
const elementoBola = document.querySelector('.bola');
const inputNumero = document.getElementById('number-input');
const botonAgregar = document.getElementById('boton-agregar');
const botonDeshacer = document.getElementById('boton-deshacer');
const botonNuevaPartida = document.getElementById('boton-nueva-partida');
const contadorBolillas = document.querySelector('.bolillas-total span:last-child');
const elementoError = document.getElementById('mensaje-error');
const bolaActual = document.querySelector('.bola-numero');
const bolasUltimosNumeros = document.querySelector('.bolas-ultimos-numeros');
const botonBingo = document.getElementById("boton-bingo");
const botonLinea = document.getElementById("boton-linea");
const botonCambiarColor = document.getElementById('boton-alternar-colores');
const ventanaEmergente = document.getElementById('ventana-emergente');
const ventanaEmergenteTitulo = document.getElementById('ventana-titulo');
const numerosJugados = document.getElementById('numeros-jugados');
const ventanaEmergenteCerrar = document.querySelector('.ventana-cerrar');

// VARIABLES Y CONSTANTES ------------------------------------------------

const colores = [['rgba(204, 0, 0, 0.75)','radial-gradient(circle at 50% 30%, rgba(245,48,48,0) 0%, rgba(150,0,0,0.1) 60%, rgba(144,0,0,1) 100%)'], ['rgba(0, 153, 51, 0.75)','radial-gradient(circle at 50% 30%, rgba(48,245,86,0) 0%, rgba(0,150,6,0.1) 60%, rgba(0,144,11,1) 100%)'], ['rgba(0, 153, 255, 0.75)','radial-gradient(circle at 50% 30%, rgba(48,143,245,0) 0%, rgba(0,72,150,0.1) 60%, rgba(0,57,144,1) 100%)'], ['rgba(247, 231, 7, 0.75)','radial-gradient(circle at 50% 30%, rgba(247,231,48,0) 0%, rgba(150,150,0,0.1) 60%, rgba(144,141,0,1) 100%)'],['rgba(111, 78, 55, 0.75)','radial-gradient(circle at 50% 30%, rgba(111,78,55,0) 0%, rgba(119,79,45,0.1) 60%, rgba(144,78,0,1) 100%)']]; // Rojo, Verde, Azul, Amarillo y Marr¨®n (bola, reflejos)

const textoBingo = 'ðŸ˜€ BINGO ðŸ¥³';
const textoLinea = 'ðŸ¤© LÃNEA ðŸ˜Š';
const textoTerno = 'ðŸ˜ TERNO ðŸ¤ª';
let indiceColorActual = 1; // Ãndice del arreglo colores (0 ya es el estado inicial)
let cantidadBolas = 0; // Cantidad de bolillas jugadas
let numerosIngresados = []; // Arreglo para almacenar los nÃºmeros ingresados

// EJECUTAR AL CARGAR LA PÃGINA ------------------------------------------

calcularBolas(); // Calcular espacio disponible para el listado de bolillas
actualizarHoraActual();  // Hora
setInterval(actualizarHoraActual, 60000); // Actualizar la hora cada minuto
prepararInputNumero(); // Borrar y hacer foco en el input de nÃºmeros


// FUNCIONES -------------------------------------------------------------

// FunciÃ³n para calcular el tamaÃ±o y cantidad de bolas
function calcularBolas() {
	// Obtener el ancho y alto disponibles
	const anchoDisponible = elementoRecuadroUltimosNumeros.offsetWidth - 70;
	const altoDisponible = elementoRecuadroUltimosNumeros.offsetHeight - 50;

	// Calcular el alto Ã³ptimo de las bolas (un tercio del alto disponible) para que siempre sean 3 filas
	const altoOptimoBola = altoDisponible / 3;

	// Calcular la cantidad de columnas
	const cantidadColumnas = Math.floor(anchoDisponible / altoOptimoBola);

	// Calcular la cantidad de bolillas
	const nuevaCantidadBolas = cantidadColumnas * 3;

	// Obtener todos los elementos existentes con la clase 'bola-ultimo-numero'
	const bolasUltimosNumeros = document.querySelectorAll('.bola-ultimo-numero');

	// Si no hay nÃºmeros ingresados, crear los elementos para las bolillas
	if (numerosIngresados.length === 0) {
		elementoBolasUltimosNumeros.innerHTML = '';

		for (let i = 0; i < nuevaCantidadBolas; i++) {
			const bolaNueva = document.createElement('div');
			bolaNueva.className = 'bola-ultimo-numero';
			bolaNueva.style.height = `${altoOptimoBola}px`;
			elementoBolasUltimosNumeros.appendChild(bolaNueva);
		}
	} else {
		// Si hay nÃºmeros ingresados, actualizar los elementos existentes
		if (bolasUltimosNumeros.length > nuevaCantidadBolas) {
			// Eliminar los elementos sobrantes
			for (let i = bolasUltimosNumeros.length - 1; i >= nuevaCantidadBolas; i--) {
				elementoBolasUltimosNumeros.removeChild(bolasUltimosNumeros[i]);
			}
		} else if (bolasUltimosNumeros.length < nuevaCantidadBolas) {
			// Crear los elementos faltantes
			for (let i = bolasUltimosNumeros.length; i < nuevaCantidadBolas; i++) {
				const bolaNueva = document.createElement('div');
				bolaNueva.className = 'bola-ultimo-numero';
				bolaNueva.style.height = `${altoOptimoBola}px`;
				elementoBolasUltimosNumeros.appendChild(bolaNueva);
			}
		}

		// Actualizar el tamaÃ±o de los elementos existentes
		for (let i = 0; i < bolasUltimosNumeros.length; i++) {
			bolasUltimosNumeros[i].style.height = `${altoOptimoBola}px`;
		}
	}

	// Actualizar la variable global con la nueva cantidad de bolillas
	cantidadBolas = nuevaCantidadBolas;
}

// FunciÃ³n para agregar un nuevo nÃºmero destacado
function agregarNumero() {
  const numero = parseInt(inputNumero.value);

  // Verificar si el nÃºmero estÃ¡ en el rango vÃ¡lido y no ha sido ingresado anteriormente
  if (numero >= 1 && numero <= 90 && !numerosIngresados.includes(numero)) {
    numerosIngresados.push(numero);

    // Actualizar la bolilla actual
    bolaActual.textContent = numero;

    // Actualizar el contador de bolillas
    contadorBolillas.textContent = numerosIngresados.length;

    // Actualizar las bolas de Ãºltimos nÃºmeros
    actualizarBolasUltimosNumeros();
	
	ocultarMensajeError();
  } else {
	mostrarMensajeError('NÃºmero no vÃ¡lido: Fuera de rango o repetido.');
  }
  prepararInputNumero();
}

// FunciÃ³n para deshacer el Ãºltimo nÃºmero ingresado
function deshacerUltimoNumero() {
	if (numerosIngresados.length > 0) {
		numerosIngresados.pop();

		// Actualizar la bolilla actual
		bolaActual.textContent = numerosIngresados.length > 0 ? numerosIngresados[numerosIngresados.length - 1] : '0';

		// Actualizar el contador de bolillas
		contadorBolillas.textContent = numerosIngresados.length;

		// Actualizar las bolas de Ãºltimos nÃºmeros
		actualizarBolasUltimosNumeros();
	}
	// Ocultar ventana emergente
	ocultarVentanaEmergente();
	prepararInputNumero();
}

// FunciÃ³n para actualizar el contenido del elemento bolasUltimosNumeros
function actualizarBolasUltimosNumeros() {
	// Obtener todos los elementos existentes con la clase 'bola-ultimo-numero'
	const bolasUltimosNumeros = document.querySelectorAll('.bola-ultimo-numero');

	// Actualizar el contenido de texto de los elementos existentes
	for (let i = 0; i < cantidadBolas; i++) {
		if (i < numerosIngresados.length) {
			bolasUltimosNumeros[i].textContent = numerosIngresados[numerosIngresados.length - 2 - i];
		} else {
			bolasUltimosNumeros[i].textContent = '';
		}
	}
}

// FunciÃ³n para iniciar una nueva partida
function nuevaPartida() {
	numerosIngresados = [];
	bolaActual.textContent = '0';
	contadorBolillas.textContent = '-';
	bolasUltimosNumeros.innerHTML = '';
	ocultarMensajeError()
	calcularBolas()
	prepararInputNumero();
}

function cambiarColorBola() {
	// Obtener los valores
	const colorBola = colores[indiceColorActual][0];
	const colorReflejos = colores[indiceColorActual][1];
	
	// Actualizar los estilos
	elementoBola.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 59.55 59.55'%3E%3Cstyle%3E.cls-1%20%7B%20stroke%3A%20${colorBola}%3B%20stroke-width%3A%202.86px%3B%20%7D.cls-1%2C%20.cls-2%20%7B%20fill%3A%20none%3B%20stroke-miterlimit%3A%2010%3B%20%7D.cls-2%20%7B%20stroke%3A%20%231d1d1b%3B%20stroke-width%3A%20.21px%3B%20%7D%3C/style%3E%3Ccircle class='cls-1' cx='29.77' cy='29.77' r='28.35'/%3E%3Ccircle class='cls-2' cx='29.77' cy='29.77' r='26.52'/%3E%3C/svg%3E")`;
	elementoBola.style.setProperty('--colorBola', colorReflejos);
	
	// Incrementar el Ã­ndice
	indiceColorActual = (indiceColorActual + 1) % colores.length;
	
	// Ocultar ventana emergente
	ocultarVentanaEmergente();
	
	prepararInputNumero();
}

// FunciÃ³n para eliminar el contenido y poner el foco en el input de nÃºmeros
function prepararInputNumero() {
	inputNumero.value = ''; // Borrar valor
	inputNumero.focus(); // Devolver el foco
}

// Funciones para mostrar/ocultar los mensajes de error en la pÃ¡gina
function mostrarMensajeError(mensaje) {
	elementoError.textContent = mensaje;
	elementoError.style.display = 'flex';
}

function ocultarMensajeError() {
	elementoError.textContent = '';
	elementoError.style.display = 'none';
}

// FunciÃ³n para actualizar la hora actual
function actualizarHoraActual() {
	const ahora = new Date();
	const horas = ahora.getHours().toString().padStart(2, '0');
	const minutos = ahora.getMinutes().toString().padStart(2, '0');
	elementoHora.textContent = `${horas}:${minutos}`;
}

// FunciÃ³n para mostrar la ventana emergente
function mostrarVentanaEmergente(titulo) {
	// Verificar la cantidad de bolillas jugadas y el tÃ­tulo para saber si se puede mostrar el mensaje o no
	const bolasJugadas = numerosIngresados.length;
	const tituloSimple = titulo.split(' ')[1]; // Quitar los emojis
	if ((titulo === textoBingo && bolasJugadas < 30) ||
		(titulo === textoLinea && bolasJugadas < 5) ||
		(titulo === textoTerno && bolasJugadas < 3)) {
			mostrarMensajeError("No hay suficientes bolillas jugadas para " + tituloSimple);
	return; // Salir de la funciÃ³n si no se cumplen las condiciones
	}

	// Si se cumplen las condiciones, continuar con el resto de la funciÃ³n
	ventanaEmergenteTitulo.textContent = titulo;
	numerosJugados.innerHTML = '';
	const gridContainer = document.createElement('div'); // Crea un contenedor para los nÃºmeros
	gridContainer.classList.add('grilla-bolillas');
	numerosIngresados.sort((a, b) => a - b).forEach(number => {
	const span = document.createElement('span');
	span.classList.add('grilla-numero');
	span.textContent = number < 10 ? `0${number}` : number;
	gridContainer.appendChild(span);
	});
	numerosJugados.appendChild(gridContainer); // Agrega el contenedor al div de nÃºmeros jugados
	ventanaEmergente.style.display = 'flex';
}

// FunciÃ³n para ocultar la ventana emergente
function ocultarVentanaEmergente() {
	ventanaEmergente.style.display = 'none';
	prepararInputNumero();
}

// EVENTOS Y ACCIONES ----------------------------------------------------

// Llamar a la funciÃ³n para calcular las bolas al cambiar el tamaÃ±o de la ventana
window.addEventListener('resize', () => {
	calcularBolas();
});

// Cerrar la ventana emergente al hacer clic o presionar Esc
ventanaEmergente.addEventListener('click', (e) => {
  if (e.target === ventanaEmergente) {
	ocultarVentanaEmergente();
  }
});
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && ventanaEmergente.style.display === 'flex') {
		ocultarVentanaEmergente();
	}
});

// Botones
botonAgregar.addEventListener('click', agregarNumero);
botonBingo.addEventListener('click', () => mostrarVentanaEmergente(textoBingo));
botonLinea.addEventListener('click', () => mostrarVentanaEmergente(textoLinea));
botonDeshacer.addEventListener('click', deshacerUltimoNumero);
botonNuevaPartida.addEventListener('click', nuevaPartida);
botonCambiarColor.addEventListener('click', cambiarColorBola);
ventanaEmergenteCerrar.addEventListener('click', ocultarVentanaEmergente);

// Atajos de teclado
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();

    if (e.ctrlKey && e.altKey || !e.ctrlKey && !e.altKey) {
        switch (key) {
            case 'b': // Ctrl+Alt+B o B: Mostrar ventana emergente para BINGO
                e.preventDefault();
                mostrarVentanaEmergente(textoBingo);
                break;
            case 'l': // Ctrl+Alt+L o L: Mostrar ventana emergente para LINEA
                e.preventDefault();
                mostrarVentanaEmergente(textoLinea);
                break;
            case 'o': // Ctrl+Alt+O o O: Mostrar ventana emergente para TERNO (alternativa para Linux)
            case 't': // Ctrl+Alt+T o T: Mostrar ventana emergente para TERNO
                e.preventDefault();
                mostrarVentanaEmergente(textoTerno);
                break;
            case 'c': // Ctrl+Alt+C o C: Cambiar el color de la bolilla
                e.preventDefault();
                cambiarColorBola();
                break;
            case 'z': // Ctrl+Alt+Z o Z: Deshacer
                e.preventDefault();
                deshacerUltimoNumero();
                break;
            case 'n': // Ctrl+Alt+N o N: Nueva partida
                e.preventDefault();
                nuevaPartida();
                break;
            default:
                // No hacer nada, dejar que las teclas pasen de largo
                break;
        }
    }
});

// Poner el nÃºmero en la bolilla actual al presionar Enter
inputNumero.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    agregarNumero();
  }
});

/* Propuesta para usar las teclas de funciÃ³n
document.addEventListener('keydown', function(event) {
  if (event.key.startsWith('F') && event.key !== 'F11') {
    // Check if the pressed key starts with 'F' (for function keys)
    // and is not F11
    console.log('Function key pressed: ' + event.key);

    // Prevent the default browser behavior for function keys other than F11
    event.preventDefault();
  }
});
*/
