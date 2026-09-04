console.log("app.js cargado");

function setKpi(id, valor, delta) {
  const tarjeta = document.getElementById(id);
  if (!tarjeta) return;

  tarjeta.querySelector('.kpi-value').textContent = valor;

  const deltaEl = tarjeta.querySelector('.kpi-delta');
  deltaEl.textContent = delta;
  deltaEl.classList.toggle('kpi-delta--down', delta.trim().startsWith('-'));
}

// Gráfico principal
const estilos = getComputedStyle(document.documentElement);

const ctxRendimiento = document
  .querySelector('#chart-rendimiento canvas')
  .getContext('2d');

const chartRendimiento = new Chart(ctxRendimiento, {
  type: 'line',
  data: {
    labels: ['22 Ene', '23 Ene', '24 Ene', '25 Ene', '26 Ene', '27 Ene', '28 Ene'],
    datasets: [{
      label: 'Visitas',
      data: [180, 195, 188, 210, 205, 230, 245],
      borderColor: estilos.getPropertyValue('--series-1'),
      backgroundColor: 'transparent',
      tension: 0.35,
      borderWidth: 2,
      pointRadius: 3
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } }
  }
});

// Gráfico donut
const ctxEstado = document
  .querySelector('#chart-estado canvas')
  .getContext('2d');

const chartEstado = new Chart(ctxEstado, {
  type: 'doughnut',
  data: {
    labels: ['Activas', 'Pausadas', 'Finalizadas'],
    datasets: [{
      data: [58, 24, 18],
      backgroundColor: [
        estilos.getPropertyValue('--series-1'),
        estilos.getPropertyValue('--series-2'),
        estilos.getPropertyValue('--series-3')
      ],
      borderWidth: 0
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10 } } }
  }
});

// Gráfico Costo por Lead
const ctxCostoLead = document
  .querySelector('#chart-costo-lead canvas')
  .getContext('2d');

const chartCostoLead = new Chart(ctxCostoLead, {
  type: 'bar',
  data: {
    labels: ['Search', 'Social', 'Display', 'Email'],
    datasets: [{
      data: [12.4, 9.8, 15.2, 6.1],
      backgroundColor: [
        estilos.getPropertyValue('--series-1')
      ],
      borderWidth: 0
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  }
});

// Gráfico Desglose por Canal
const ctxCanal = document
  .querySelector('#chart-canal canvas')
  .getContext('2d');

const chartCanal = new Chart(ctxCanal, {
  type: 'bar',
  data: {
    labels: ['Social', 'Email', 'Display', 'Referral', 'Search'],
    datasets: [{
      data: [420, 310, 260, 150, 90],
      backgroundColor: [
        estilos.getPropertyValue('--series-3')
      ],
      borderWidth: 0
    }]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } } 
    }
});

// Gráfico Embudo de Conversión
const ctxEmbudo = document
  .querySelector('#chart-embudo canvas')
  .getContext('2d');

const chartEmbudo = new Chart(ctxEmbudo, {
  type: 'bar',
  data: {
    labels: ['Visitas', 'Leads', 'MQL', 'Oportunidades', 'Clientes'],
    datasets: [{
      data: [12500, 3200, 1400, 640, 210],
      backgroundColor: ['#86b6ef', '#5598e7', '#2a78d6', '#1c5cab', '#104281'],
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } } 
    }
});

function formatearDelta(valorNuevo, valorAnterior) {
  const cambio = ((valorNuevo - valorAnterior) / valorAnterior) * 100;
  const signo = cambio >= 0 ? '+' : '';
  return `${signo}${cambio.toFixed(1)}%`;
}

let datosAnteriores = null;

function actualizarDashboard(datos) {
  if (datosAnteriores) {
    setKpi('kpi-campanas', Math.round(datos.campanas), formatearDelta(datos.campanas, datosAnteriores.campanas));
    setKpi('kpi-gasto', '$' + (datos.gasto / 1000).toFixed(1) + 'K', formatearDelta(datos.gasto, datosAnteriores.gasto));
    setKpi('kpi-presupuesto', datos.presupuesto.toFixed(1) + '%', formatearDelta(datos.presupuesto, datosAnteriores.presupuesto));
    setKpi('kpi-convertidos', datos.leadsConvertidos.toFixed(1) + '%', formatearDelta(datos.leadsConvertidos, datosAnteriores.leadsConvertidos));
    setKpi('kpi-generados', '$' + (datos.leadsGenerados / 1000000).toFixed(1) + 'M', formatearDelta(datos.leadsGenerados, datosAnteriores.leadsGenerados));
  }

  chartRendimiento.data.datasets[0].data = datos.rendimiento;
  chartRendimiento.update();

  datosAnteriores = datos;
}

async function obtenerDatos() {
  try {
    const respuesta = await fetch('https://tu-servicio.onrender.com/api/dashboard');
    if (!respuesta.ok) {
      throw new Error(`El servidor respondió con estado ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    actualizarDashboard(datos);
    marcarConectado();
  } catch (error) {
    console.error('No se pudo obtener datos del servidor:', error);
    marcarError();
  }
}

function marcarConectado() {
  document.getElementById('pulseDot').classList.remove('error');
  document.getElementById('statusTexto').textContent = 'Actualizado hace instantes';
}

function marcarError() {
  document.getElementById('pulseDot').classList.add('error');
  document.getElementById('statusTexto').textContent = 'Sin conexión con el servidor';
}

obtenerDatos();
setInterval(obtenerDatos, 30000);