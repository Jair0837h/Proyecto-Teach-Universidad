// Navegación simple entre secciones
const buttonsNav = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('main section');

buttonsNav.forEach(btn => {
  btn.addEventListener('click', () => {
    buttonsNav.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.getAttribute('data-target');
    sections.forEach(sec => {
      sec.classList.toggle('active', sec.id === target);
    });
  });
});

// Datos simulados históricos para tabla y gráficos (simplificado)
const datosHistoricos = [
  {year:1965, wind:10, solar:0.1, hydro:100, biofuel:5, geothermal:20},
  {year:1975, wind:20, solar:0.5, hydro:120, biofuel:10, geothermal:25},
  {year:1985, wind:50, solar:2, hydro:150, biofuel:18, geothermal:30},
  {year:1995, wind:120, solar:10, hydro:170, biofuel:35, geothermal:40},
  {year:2005, wind:300, solar:50, hydro:200, biofuel:80, geothermal:55},
  {year:2015, wind:900, solar:350, hydro:220, biofuel:160, geothermal:70},
  {year:2022, wind:1400, solar:1000, hydro:240, biofuel:250, geothermal:80}
];

// Llenar tabla con datos históricos
const tbodyTabla = document.querySelector('#tablaDatos tbody');
datosHistoricos.forEach(d => {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${d.year}</td>
    <td>${d.wind.toLocaleString()}</td>
    <td>${d.solar.toLocaleString()}</td>
    <td>${d.hydro.toLocaleString()}</td>
    <td>${d.biofuel.toLocaleString()}</td>
    <td>${d.geothermal.toLocaleString()}</td>
  `;
  tbodyTabla.appendChild(tr);
});

// Formulario Estimación
const formEstimacion = document.getElementById('formEstimacion');
const consumoInput = document.getElementById('consumoTotal');
const errorConsumo = document.getElementById('errorConsumo');
const resultadoEstimacion = document.getElementById('resultadoEstimacion');

function validarNumeroPositivo(valor) {
  if (valor === '' || valor === null) return false;
  const n = Number(valor);
  return !isNaN(n) && n > 0;
}

// Para estimar capacidad instalada y proporción renovable:
formEstimacion.addEventListener('submit', e => {
  e.preventDefault();
  const consumo = consumoInput.value.trim();

  if (!validarNumeroPositivo(consumo)) {
    errorConsumo.style.display = 'block';
    errorConsumo.textContent = 'Ingrese un número positivo válido';
    resultadoEstimacion.style.display = 'none';
    return;
  }
  errorConsumo.style.display = 'none';

  const consumoNum = Number(consumo);

  // Último dato año 2022
  const ultimo = datosHistoricos[datosHistoricos.length - 1];

  // Capacidad instalada (sumamos MW convertido a GW para homogeneizar):
  const capacidadGW = (ultimo.wind / 1000) + (ultimo.solar / 1000) + (ultimo.hydro / 1000) + (ultimo.geothermal / 1000);

  // Producción total renovable estimada (sumamos las fuentes renovables)
  const produccionRenovable = ultimo.wind + ultimo.solar + ultimo.hydro + ultimo.biofuel + ultimo.geothermal;

  // Simplificamos producción total (renovable + no renovable)
  const produccionTotal = produccionRenovable * 1.5;

  // Proporción renovable en producción total
  const proporcionRenovable = produccionRenovable / produccionTotal;

  // Estimación consumo renovable usuario (en kWh)
  const consumoRenovable = consumoNum * proporcionRenovable;

  // % renovable en consumo total
  const porcentajeRenovable = proporcionRenovable * 100;

  resultadoEstimacion.style.display = 'block';
  resultadoEstimacion.innerHTML = `
    <p>Capacidad instalada total de energía renovable (GW): <strong>${capacidadGW.toFixed(3)}</strong></p>
    <p>Proporción de energía renovable en la producción total: <strong>${(proporcionRenovable * 100).toFixed(1)}%</strong></p>
    <p>Su consumo estimado de energía renovable: <strong>${consumoRenovable.toFixed(0)} kWh</strong> de ${consumoNum.toLocaleString()} kWh</p>
    <p>Porcentaje estimado de energía renovable en su consumo total: <strong>${porcentajeRenovable.toFixed(1)}%</strong></p>
  `;
});

// ----------- GRÁFICOS DASHBOARD -------------

let graficoBarras, graficoTorta, graficoLineas, graficoArea;

// Datos para gráficos del último año
const ultimo = datosHistoricos[datosHistoricos.length - 1];

// Gráfico Barras: Producción por Fuente
function crearGraficoBarras() {
  const ctx = document.getElementById('graficoBarras').getContext('2d');
  if (graficoBarras) graficoBarras.destroy();

  graficoBarras = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Eólica', 'Solar', 'Hidroeléctrica', 'Biofuel', 'Geotérmica'],
      datasets: [{
        label: 'Producción (GWh)',
        data: [ultimo.wind, ultimo.solar, ultimo.hydro, ultimo.biofuel, ultimo.geothermal],
        backgroundColor: ['#2563eb', '#fbbf24', '#22c55e', '#f97316', '#8b5cf6'],
        borderRadius: 6,
        barPercentage: 0.6,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'GWh' }
        },
        x: {
          title: { display: true, text: 'Fuente' }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true }
      }
    }
  });
}

// Gráfico Torta: Participación en consumo
function crearGraficoTorta() {
  const ctx = document.getElementById('graficoTorta').getContext('2d');
  if (graficoTorta) graficoTorta.destroy();

  // Datos simplificados (del último año)
  const dataParticipacion = [
    {label:'Renovable Total', value: 45},
    {label:'Eólica', value: 15},
    {label:'Solar', value: 10},
    {label:'Hidroeléctrica', value: 20}
  ];

  graficoTorta = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: dataParticipacion.map(d => d.label),
      datasets: [{
        data: dataParticipacion.map(d => d.value),
        backgroundColor: ['#22c55e', '#2563eb', '#fbbf24', '#3b82f6'],
        borderWidth: 1,
        hoverOffset: 15
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true }
      }
    }
  });
}

// Gráfico Líneas: Tendencia capacidad instalada
function crearGraficoLineas() {
  const ctx = document.getElementById('graficoLineas').getContext('2d');
  if (graficoLineas) graficoLineas.destroy();

  // Mapear datos por años para capacidad instalada (GW)
  const labels = datosHistoricos.map(d => d.year);
  const windCapacity = datosHistoricos.map(d => d.wind / 1000);
  const solarCapacity = datosHistoricos.map(d => d.solar / 1000);
  const geothermalCapacity = datosHistoricos.map(d => d.geothermal / 1000);

  graficoLineas = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Eólica (GW)',
          data: windCapacity,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.3)',
          fill: false,
          tension: 0.3,
          pointRadius: 4,
        },
        {
          label: 'Solar (GW)',
          data: solarCapacity,
          borderColor: '#fbbf24',
          backgroundColor: 'rgba(251, 191, 36, 0.3)',
          fill: false,
          tension: 0.3,
          pointRadius: 4,
        },
        {
          label: 'Geotérmica (GW)',
          data: geothermalCapacity,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.3)',
          fill: false,
          tension: 0.3,
          pointRadius: 4,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Capacidad Instalada (GW)' }
        },
        x: {
          title: { display: true, text: 'Año' }
        }
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true }
      }
    }
  });
}

// Gráfico Área: Consumo renovable vs convencional (simplificado)
function crearGraficoArea() {
  const ctx = document.getElementById('graficoArea').getContext('2d');
  if (graficoArea) graficoArea.destroy();

  // Consumo renovable y convencional (simulado)
  // Renovable = wind + solar + hydro + biofuel + geothermal (GWh)
  // Convencional = 1.5 veces renovable (simulación)
  const labels = datosHistoricos.map(d => d.year);
  const consumoRenovable = datosHistoricos.map(d =>
    d.wind + d.solar + d.hydro + d.biofuel + d.geothermal);
  const consumoConvencional = consumoRenovable.map(v => v * 1.5);

  graficoArea = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Consumo Renovable (GWh)',
          data: consumoRenovable,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          fill: true,
          tension: 0.3,
          pointRadius: 3,
        },
        {
          label: 'Consumo Convencional (GWh)',
          data: consumoConvencional,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          fill: true,
          tension: 0.3,
          pointRadius: 3,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Consumo (GWh)' }
        },
        x: {
          title: { display: true, text: 'Año' }
        }
      },
      plugins: {
        legend: { position: 'bottom' },
        tooltip: { enabled: true }
      }
    }
  });
}

// Crear todos los gráficos al cargar la página y cuando se muestra el dashboard
function inicializarDashboard() {
  crearGraficoBarras();
  crearGraficoTorta();
  crearGraficoLineas();
  crearGraficoArea();
}

// Inicializamos dashboard cuando se activa la pestaña correspondiente
buttonsNav.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.getAttribute('data-target') === 'dashboard') {
      setTimeout(inicializarDashboard, 100); // pequeño delay para que canvas sea visible
    }
  });
});

// Inicializamos dashboard por defecto si está activo al cargar
if(document.querySelector('nav button.active').getAttribute('data-target') === 'dashboard'){
  inicializarDashboard();
}
