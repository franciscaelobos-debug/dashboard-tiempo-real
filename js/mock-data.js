let estadoActual = {
  campanas: 134,
  gasto: 32500,
  presupuesto: 44.1,
  leadsConvertidos: 52.3,
  leadsGenerados: 52300000,
  rendimiento: [180, 195, 188, 210, 205, 230, 245]
};

function paso(valor, variacion) {
  const cambio = (Math.random() * 2 - 1) * variacion;
  return valor + cambio;
}

function generarSiguienteDato() {
  const ultimoPunto = estadoActual.rendimiento[estadoActual.rendimiento.length - 1];
  const puntoNuevo = Math.max(0, Math.round(paso(ultimoPunto, 15)));

  estadoActual = {
    campanas: Math.round(paso(estadoActual.campanas, 2)),
    gasto: paso(estadoActual.gasto, 400),
    presupuesto: paso(estadoActual.presupuesto, 0.6),
    leadsConvertidos: paso(estadoActual.leadsConvertidos, 0.6),
    leadsGenerados: paso(estadoActual.leadsGenerados, 300000),
    rendimiento: [...estadoActual.rendimiento.slice(1), puntoNuevo]
  };

  return estadoActual;
}