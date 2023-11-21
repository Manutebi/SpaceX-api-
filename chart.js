const urlAPI = 'https://api.spacexdata.com/v5/launches/';

let myChart;

export const mostrarGrafico = async () => {
    const ctx = document.getElementById('myChart').getContext('2d');

    const respuesta = await fetch(urlAPI);
    const datos = await respuesta.json();

    let exitosos = 0;
    let fallidos = 0;

    datos.forEach(lanzamiento => {
        if (lanzamiento.success) {
            exitosos++;
        } else {
            fallidos++;
        }
    });

    const total = datos.length;

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Exitosos', 'Fallidos', 'Total'],
            datasets: [{
                data: [exitosos, fallidos, total],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
