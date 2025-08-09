document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('energiaChart').getContext('2d');

  // Crear gráfico vacío
  const energiaChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Energía consumida (Wh)'],
      datasets: [{
        label: 'Wh',
        data: [0],
        backgroundColor: ['#007bff']
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });

  const btnCalcular = document.getElementById('btnCalcular');
  const resultadoDiv = document.getElementById('resultado');

  btnCalcular.addEventListener('click', () => {
    const potencia = parseFloat(document.getElementById('potencia').value);
    const tiempo = parseFloat(document.getElementById('tiempo').value);

    if (isNaN(potencia) || potencia <= 0) {
      resultadoDiv.textContent = "Por favor ingresa una potencia válida (mayor a 0).";
      return;
    }
    if (isNaN(tiempo) || tiempo <= 0) {
      resultadoDiv.textContent = "Por favor ingresa un tiempo válido (mayor a 0).";
      return;
    }

    const energia = potencia * tiempo;

    resultadoDiv.textContent = `La energía consumida es: ${energia.toFixed(2)} Wh`;

    energiaChart.data.datasets[0].data[0] = energia;
    energiaChart.update();
  });
});
