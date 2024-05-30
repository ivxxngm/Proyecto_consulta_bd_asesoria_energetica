document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const cif = document.getElementById('cifInput').value.trim();
        const nombre = document.getElementById('nombreInput').value.trim();
        const comercializadora = document.getElementById('comercializadoraInput').value.trim();
        const estado = document.getElementById('estadoInput').value.trim();

        const query = `?cif=${encodeURIComponent(cif)}&nombre=${encodeURIComponent(nombre)}&comercializadora=${encodeURIComponent(comercializadora)}&estado=${encodeURIComponent(estado)}`;
        const url = `http://192.168.101.4:3000/asesoria_energetica/?search${query}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                let results = document.getElementById('results');
                results.innerHTML = '<h2>Resultados de la Consulta</h2>';

                // Filtrar los datos de acuerdo a los criterios de búsqueda
                let filteredData = data.filter(item => {
                    return (cif === '' || String(item.CIF).includes(cif)) &&
                           (nombre === '' || item.NOMBRE.includes(nombre)) &&
                           (comercializadora === '' || item.COMERCIALIZADORA.includes(comercializadora)) &&
                           (estado === '' || item.ESTADO.includes(estado));
                });

                if (filteredData.length === 0) {
                    results.innerHTML += '<p>No se encontraron resultados.</p>';
                    return;
                }

                filteredData.forEach(item => {
                    let resultDiv = document.createElement('div');
                    resultDiv.className = 'card my-2';
                    resultDiv.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title">Nombre: ${item.NOMBRE}</h5>
                            <p class="card-text">CIF: ${item.CIF}</p>
                            <p class="card-text">CUPS: ${item.CUPS}</p>
                            <p class="card-text">Tarifa: ${item.TARIFA}</p>
                            <p class="card-text">Comercializadora: ${item.COMERCIALIZADORA}</p>
                            <p class="card-text">Comercial: ${item.COMERCIAL}</p>
                            <p class="card-text">Estado: ${item.ESTADO}</p>
                            <p class="card-text">Acciones: ${item.ACCIONES}</p>
                            <p class="card-text">Pagado: ${item.PAGADO}</p>
                        </div>
                    `;
                    results.appendChild(resultDiv);
                });

                // Gráfica de Estado
                const ctxEstado = document.getElementById('estadoChart').getContext('2d');
                const estadoCount = filteredData.reduce((acc, item) => {
                    acc[item.ESTADO] = (acc[item.ESTADO] || 0) + 1;
                    return acc;
                }, {});

                new Chart(ctxEstado, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(estadoCount),
                        datasets: [{
                            label: 'Distribución de Estados',
                            data: Object.values(estadoCount),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Distribución de Estados'
                            }
                        }
                    }
                });

                // Gráfica de Pagado
                const ctxPagado = document.getElementById('pagadoChart').getContext('2d');
                const labelsPagado = filteredData.map(item => item.NOMBRE);
                const pagados = filteredData.map(item => item.PAGADO);

                new Chart(ctxPagado, {
                    type: 'bar',
                    data: {
                        labels: labelsPagado,
                        datasets: [{
                            label: 'Monto Pagado',
                            data: pagados,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Monto Pagado'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });

                // Gráfica de Comercializadora
                const ctxComercializadora = document.getElementById('comercializadoraChart').getContext('2d');
                const comercializadoraCount = filteredData.reduce((acc, item) => {
                    acc[item.COMERCIALIZADORA] = (acc[item.COMERCIALIZADORA] || 0) + 1;
                    return acc;
                }, {});

                new Chart(ctxComercializadora, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(comercializadoraCount),
                        datasets: [{
                            label: 'Distribución de Contratos por Comercializadora',
                            data: Object.values(comercializadoraCount),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Distribución de Contratos por Comercializadora'
                            }
                        }
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
