// Seleccionamos elementos
const form = document.getElementById('energiaForm');
const potenciaInput = document.getElementById('potencia');
const tiempoInput = document.getElementById('tiempo');
const energiaValor = document.getElementById('energiaValor');

let energiaData = []; // Aquí guardaremos los resultados para la gráfica
let labels = [];      // Para mostrar la cuenta de cálculos

// Configuración inicial de la gráfica con Chart.js
const ctx = document.getElementById('graficaEnergia').getContext('2d');
const grafica = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Energía (Wh)',
            data: energiaData,
            borderColor: 'rgba(0, 123, 255, 1)',
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            fill: true,
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Wh'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Cálculo'
                }
            }
        }
    }
});

// Función para calcular energía
function calcularEnergia(potencia, tiempo) {
    return potencia * tiempo; // Energía en Wh (vatios * horas)
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const potencia = parseFloat(potenciaInput.value);
    const tiempo = parseFloat(tiempoInput.value);

    if (isNaN(potencia) || isNaN(tiempo) || potencia < 0 || tiempo < 0) {
        alert('Por favor, ingresa valores válidos y positivos.');
        return;
    }

    const energia = calcularEnergia(potencia, tiempo);
    energiaValor.textContent = energia.toFixed(2);

    // Guardar datos para la gráfica
    energiaData.push(energia.toFixed(2));
    labels.push(`#${energiaData.length}`);

    // Actualizar gráfica
    grafica.update();

    // Limitar datos a 10 para no saturar la gráfica
    if (energiaData.length > 10) {
        energiaData.shift();
        labels.shift();
    }
});
