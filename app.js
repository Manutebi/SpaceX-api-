
const urlAPI = 'https://api.spacexdata.com/v5/launches/';

// Funcion para obtener todos los datos de la API
export const obtenerDatos = async () => {
    const respuesta = await fetch(urlAPI);
    const datos = await respuesta.json();
    return datos;
}

// Funcion para crear una tarjeta con los datos del lanzamiento
export const crearTarjeta = (lanzamiento) => {
    const launchStatus = lanzamiento.success ? "Exitoso" : "Fallido";
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('tarjeta');
    tarjeta.innerHTML = `
        <h2>${lanzamiento.name}</h2>
        <img src="${lanzamiento.links.patch.small}" alt="${lanzamiento.name}"> 
        <p> ${launchStatus}</p>
        <p>Vuelo # ${lanzamiento.flight_number}</p>
        <p>Fecha: ${new Date(lanzamiento.date_utc).toLocaleDateString()}</p>
        <p>Detalles: ${lanzamiento.details ? lanzamiento.details : 'No hay detalles disponibles'}</p>
    `;

    tarjeta.addEventListener('click', () => {
        mostrarGrafico(lanzamiento);
    });
    return tarjeta;
}


// Funcion para crear y mostrar todas las tarjetas
export const mostrarTarjetas = async () => {
    const datos = await obtenerDatos();
    const contenedor = document.getElementById('contenedorTarjetas');
    datos.forEach(lanzamiento => {
        const tarjeta = crearTarjeta(lanzamiento);
        contenedor.appendChild(tarjeta);
    });
}

// Funcion para filtrar y mostrar las tarjetas
const filtrarTarjetas = async () => {

    const contenedor = document.getElementById('contenedorTarjetas');
    contenedor.innerHTML = '';

    let launchNumber = document.getElementById('inputBusqueda').value;

    const datos = await obtenerDatos();
    const lanzamientosFiltrados = datos.filter(dato => dato.flight_number == launchNumber);
    lanzamientosFiltrados.forEach(lanzamiento => {
        const tarjeta = crearTarjeta(lanzamiento);
        contenedor.appendChild(tarjeta);
    });
}

let myChart;

const mostrarGrafico = (lanzamiento) => {
    const ctx = document.getElementById('myChart').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Número de Vuelo', 'Estado del Lanzamiento', 'Nombre del Cohete'],
            datasets: [{
                data: [lanzamiento.flight_number, lanzamiento.success ? 1 : 0, lanzamiento.name],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        }
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




