
document.getElementById('formulario').addEventListener('submit', function(e) {
  e.preventDefault();

  const consumo = parseFloat(document.getElementById('consumo').value);
  const energiaRenovable = 0.45; // 45% de capacidad instalada renovable (ejemplo)

  const porcentaje = energiaRenovable * 100;
  const consumoVerde = consumo * energiaRenovable;

  document.getElementById('resultado').textContent = 
    `Se estima que ${consumoVerde.toFixed(2)} kWh de tu consumo provienen de energías renovables (${porcentaje}%).`;
});
