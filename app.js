import { mostrarGrafico } from './chart.js';

const urlAPI = 'https://api.spacexdata.com/v5/launches/';

// Funcion para obtener todos los datos de la API
export const obtenerDatos = async () => {
    const respuesta = await fetch(urlAPI);
    const datos = await respuesta.json();
    console.log(datos);
    return datos;
}

// Funcion para crear una tarjeta con los datos del lanzamiento
export const crearTarjeta = (lanzamiento) => {
    const launchStatus = lanzamiento.success ? "Exitoso" : "Fallido";
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta');

    const detalles = lanzamiento.details;
    const detallesMostrados = detalles != null && detalles.length > 100 ? detalles.slice(0, 100) + "..." : detalles;

    tarjeta.innerHTML = `
        <h2>${lanzamiento.name}</h2>
        <img src="${lanzamiento.links.patch.small}" alt="${lanzamiento.name}"> 
        <p> ${launchStatus}</p>
        <p>Vuelo # ${lanzamiento.flight_number}</p>
        <p>Fecha: ${new Date(lanzamiento.date_utc).toLocaleDateString()}</p>
        <p class="mb-4 font-light text-gray-400">Detalles: ${detallesMostrados ? detallesMostrados : 'No hay detalles disponibles'}</p>
        <a href="${lanzamiento.links.youtube_id ? 'https://www.youtube.com/watch?v=' + lanzamiento.links.youtube_id : '#'}" class= "ytLink" target="_blank">Ver en YouTube</a>
    `;

    // tarjeta.addEventListener('click', () => {
    //     mostrarGrafico(lanzamiento);
    // });
    return tarjeta;
}


// Funcion para crear y mostrar todas las tarjetas
export const mostrarTarjetas = async () => {
    const datos = await obtenerDatos();
    const contenedor = document.getElementById('contenedorTarjetas');
    datos.forEach(lanzamiento => {
        const tarjeta = crearTarjeta(lanzamiento);
        contenedor.appendChild(tarjeta);

        mostrarGrafico(lanzamiento);
    });
}

// Funcion para filtrar y mostrar las tarjetas
const filtrarTarjetas = async () => {

    const contenedor = document.getElementById('contenedorTarjetas');
    contenedor.innerHTML = '';

    let launchNumber = document.getElementById('inputBusqueda').value;

    if (!launchNumber || isNaN(launchNumber) || launchNumber < 1 || launchNumber > 205) {
        alert('Ingresa un número de vuelo entre 1 y 205');
        return;
    }

    const datos = await obtenerDatos();
    const lanzamientosFiltrados = datos.filter(dato => dato.flight_number == launchNumber);
    lanzamientosFiltrados.forEach(lanzamiento => {
        const tarjeta = crearTarjeta(lanzamiento);
        contenedor.appendChild(tarjeta);
    });
}



// Funcion para borrar los filtros y mostrar todas las tarjetas
const borrarFiltros = async () => {
    document.getElementById('inputBusqueda').value = '';

    mostrarTarjetas();
}

document.getElementById('botonBorrar').addEventListener('click', borrarFiltros);

document.getElementById('botonBusqueda').addEventListener('click', filtrarTarjetas);

window.onload = mostrarTarjetas;

mostrarTarjetas();




