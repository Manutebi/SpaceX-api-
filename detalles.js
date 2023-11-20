const urlAPI = 'https://api.spacexdata.com/v5/launches/';

import { obtenerDatos } from './app.js';
import { crearTarjeta } from './app.js';


const obtenerID = () => {
    const parametrosURL = new URLSearchParams(window.location.search);
    return parametrosURL.get('id');
}

const mostrarDetalles = async () => {
    const id = obtenerID();
    const datos = await obtenerDatos(id);
    const tarjeta = crearTarjeta(datos);
    const contenedor = document.getElementById('contenedorDetalles');
    contenedor.appendChild(tarjeta);
}

mostrarDetalles();
