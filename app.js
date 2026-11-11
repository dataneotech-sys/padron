document.addEventListener('DOMContentLoaded', () => {
  const ciInput = document.getElementById('ciInput');
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');
  const resultArea = document.getElementById('resultArea');

  // Verificar que la base de datos esté cargada
  if (typeof PADRON_DATA === 'undefined') {
    resultArea.innerHTML = `
      <div class="result-card not-found">
        <div class="result-header">
          <div class="status-icon">⚠️</div>
          <div class="result-title">Error al cargar datos</div>
        </div>
        <p class="not-found-msg">No se pudo cargar el archivo con los datos del padrón (datos_padron.js).</p>
      </div>
    `;
    resultArea.classList.remove('hidden');
    return;
  }

  function formatCI(cleanDigits) {
    if (cleanDigits.length < 5) return cleanDigits;
    const body = cleanDigits.slice(0, -1);
    const dv = cleanDigits.slice(-1);
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedBody}-${dv}`;
  }

  function buscar() {
    const rawVal = ciInput.value.trim();
    // Extraer solo dígitos
    const digits = rawVal.replace(/\D/g, '');

    if (!digits) {
      resultArea.classList.add('hidden');
      return;
    }

    // Comprobamos en el objeto PADRON_DATA
    const match = PADRON_DATA[digits];

    if (match) {
      const [ciFormato, depto, loc] = match;
      const ciAMostrar = formatCI(digits);

      resultArea.innerHTML = `
        <div class="result-card success">
          <div class="result-header">
            <div class="status-icon">✓</div>
            <div>
              <div class="result-title">Habilitado para Votar</div>
              <small style="color: #166534;">Registro encontrado en el padrón</small>
            </div>
          </div>
          
          <div class="result-details">
            <div class="detail-item full-width">
              <span class="detail-label">Cédula de Identidad</span>
              <span class="detail-value ci-highlight">${ciAMostrar}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Departamento</span>
              <span class="detail-value">${depto}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Localidad de Votación</span>
              <span class="detail-value">${loc}</span>
            </div>
          </div>
        </div>
      `;
    } else {
      resultArea.innerHTML = `
        <div class="result-card not-found">
          <div class="result-header">
            <div class="status-icon">✕</div>
            <div class="result-title">No encontrado en el Padrón</div>
          </div>
          <p class="not-found-msg">
            La cédula <strong>${rawVal}</strong> no figura en el Padrón de Egresados del Cenur Este para estas elecciones.
          </p>
          <p style="font-size: 0.85rem; color: #92400e;">
            Verifica que no falte ningún número o consulta con las autoridades electorales universitarias correspondientes.
          </p>
        </div>
      `;
    }

    resultArea.classList.remove('hidden');
  }

  // Eventos
  ciInput.addEventListener('input', () => {
    if (ciInput.value.trim().length > 0) {
      clearBtn.style.display = 'flex';
      // Búsqueda en vivo cuando tenga al menos 6 dígitos
      const d = ciInput.value.replace(/\D/g, '');
      if (d.length >= 6) {
        buscar();
      }
    } else {
      clearBtn.style.display = 'none';
      resultArea.classList.add('hidden');
    }
  });

  ciInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      buscar();
    }
  });

  searchBtn.addEventListener('click', buscar);

  clearBtn.addEventListener('click', () => {
    ciInput.value = '';
    clearBtn.style.display = 'none';
    resultArea.classList.add('hidden');
    ciInput.focus();
  });
});
