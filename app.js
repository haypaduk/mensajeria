// Variables
const listaTweets = document.querySelector('#lista-tweets');
const formulario = document.querySelector('#formulario');
let mensajes = [];
let editandoId = null; // Para rastrear si estamos editando

// Event Listeners
eventListeners();

function eventListeners() {
    formulario.addEventListener('submit', manejarFormulario);
    listaTweets.addEventListener('click', manejarAcciones);
    document.addEventListener('DOMContentLoaded', () => {
        mensajes = JSON.parse(localStorage.getItem('mensajes')) || [];
        crearHTML();
    });
}

// Manejar submit del formulario (Agregar o Editar)
function manejarFormulario(e) {
    e.preventDefault();
    
    const nombre = document.querySelector('#nombre').value;
    const telefono = document.querySelector('#telefono').value;
    const correo = document.querySelector('#correo').value;
    const mensaje = document.querySelector('#mensaje').value;
    const fecha = document.querySelector('#fecha').value;

    if (nombre === '' || telefono === '' || correo === '' || mensaje === '' || fecha === '') {
        mostrarError('Todos los campos son obligatorios');
        return;
    }

    const mensajeObj = {
        id: editandoId || Date.now(), // Usa el ID existente si estamos editando
        nombre,
        telefono,
        correo,
        mensaje,
        fecha
    };

    if (editandoId) {
        // Actualizar mensaje existente
        mensajes = mensajes.map(msg => msg.id === editandoId ? mensajeObj : msg);
        editandoId = null;
        formulario.querySelector('input[type="submit"]').value = 'Agregar'; // Volver al texto original
    } else {
        // Agregar nuevo mensaje
        mensajes = [...mensajes, mensajeObj];
    }

    crearHTML();
    formulario.reset();
}

function mostrarError(error) {
    const mensajeError = document.createElement('p');
    mensajeError.textContent = error;
    mensajeError.classList.add('error');
    const contenido = document.querySelector('#contenido');
    contenido.appendChild(mensajeError);
    setTimeout(() => mensajeError.remove(), 3000);
}

function crearHTML() {
    limpiarHTML();
    
    if (mensajes.length > 0) {
        mensajes.forEach(mensaje => {
            const botonBorrar = document.createElement('a');
            botonBorrar.classList = 'borrar-tweet';
            botonBorrar.innerText = 'X';

            const botonEditar = document.createElement('a');
            botonEditar.classList = 'editar-tweet';
            botonEditar.innerText = 'Editar';

            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Nombre:</strong> ${mensaje.nombre}<br>
                <strong>Teléfono:</strong> ${mensaje.telefono}<br>
                <strong>Correo:</strong> ${mensaje.correo}<br>
                <strong>Mensaje:</strong> ${mensaje.mensaje}<br>
                <strong>Fecha:</strong> ${mensaje.fecha}
            `;
            li.appendChild(botonBorrar);
            li.appendChild(botonEditar);
            li.dataset.mensajeId = mensaje.id;
            listaTweets.appendChild(li);
        });
    }
    sincronizarStorage();
}

function manejarAcciones(e) {
    if (e.target.classList.contains('borrar-tweet')) {
        const id = e.target.parentElement.dataset.mensajeId;
        mensajes = mensajes.filter(mensaje => mensaje.id != id);
        crearHTML();
    } else if (e.target.classList.contains('editar-tweet')) {
        const id = e.target.parentElement.dataset.mensajeId;
        const mensaje = mensajes.find(msg => msg.id == id);
        cargarFormulario(mensaje);
    }
}

function cargarFormulario(mensaje) {
    document.querySelector('#nombre').value = mensaje.nombre;
    document.querySelector('#telefono').value = mensaje.telefono;
    document.querySelector('#correo').value = mensaje.correo;
    document.querySelector('#mensaje').value = mensaje.mensaje;
    document.querySelector('#fecha').value = mensaje.fecha;
    
    editandoId = mensaje.id;
    formulario.querySelector('input[type="submit"]').value = 'Guardar Cambios';
}

function sincronizarStorage() {
    localStorage.setItem('mensajes', JSON.stringify(mensajes));
}

function limpiarHTML() {
    while (listaTweets.firstChild) {
        listaTweets.removeChild(listaTweets.firstChild);
    }
}