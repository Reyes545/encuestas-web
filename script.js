
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const appSection = document.getElementById('appSection');
const preguntasContainer = document.getElementById('preguntasContainer');
const responderContainer = document.getElementById('responderContainer');

let preguntas = JSON.parse(localStorage.getItem('preguntas')) || [];
let respuestas = JSON.parse(localStorage.getItem('respuestas')) || [];

function showRegister() {
  loginSection.classList.add('hidden');
  registerSection.classList.remove('hidden');
}

function hideRegister() {
  registerSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
}

function register() {
  const user = document.getElementById('regUser').value;
  const pass = document.getElementById('regPass').value;
  if (user && pass) {
    localStorage.setItem('user_' + user, pass);
    alert("Cuenta registrada exitosamente.");
    hideRegister();
  } else {
    alert("Por favor llena todos los campos.");
  }
}

function login() {
  const user = document.getElementById('loginUser').value;
  const pass = document.getElementById('loginPass').value;
  const storedPass = localStorage.getItem('user_' + user);
  if (storedPass === pass) {
    loginSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    cargarPreguntas();
  } else {
    alert("Usuario o contraseña incorrectos.");
  }
}

function logout() {
  appSection.classList.add('hidden');
  loginSection.classList.remove('hidden');
}

function agregarPregunta() {
  const pregunta = document.getElementById('pregunta').value;
  const respuesta = document.getElementById('respuesta').value;
  if (pregunta && respuesta) {
    preguntas.push({ pregunta, respuesta });
    localStorage.setItem('preguntas', JSON.stringify(preguntas));
    document.getElementById('pregunta').value = "";
    document.getElementById('respuesta').value = "";
    cargarPreguntas();
  } else {
    alert("Llena ambos campos.");
  }
}

function cargarPreguntas() {
  preguntasContainer.innerHTML = "";
  responderContainer.innerHTML = "";
  preguntas.forEach((p, i) => {
    // Admin view
    const div = document.createElement('div');
    div.className = 'pregunta';
    div.innerHTML = `
      <strong>Pregunta:</strong><br><input type="text" value="${p.pregunta}" id="preg_${i}">
      <br><strong>Respuesta:</strong><br><input type="text" value="${p.respuesta}" id="resp_${i}">
      <br>
      <button class="btn-small" onclick="editarPregunta(${i})">Editar</button>
      <button class="btn-small" onclick="eliminarPregunta(${i})">Eliminar</button>
    `;
    preguntasContainer.appendChild(div);

    // Responder view
    const resDiv = document.createElement('div');
    resDiv.className = 'pregunta';
    resDiv.innerHTML = `
      <strong>${p.pregunta}</strong><br>
      <button onclick="responderEncuesta(${i})">Responder: ${p.respuesta}</button>
    `;
    responderContainer.appendChild(resDiv);
  });

  actualizarGrafica();
}

function editarPregunta(index) {
  const nuevaPregunta = document.getElementById('preg_' + index).value;
  const nuevaRespuesta = document.getElementById('resp_' + index).value;
  preguntas[index] = { pregunta: nuevaPregunta, respuesta: nuevaRespuesta };
  localStorage.setItem('preguntas', JSON.stringify(preguntas));
  cargarPreguntas();
}

function eliminarPregunta(index) {
  if (confirm("¿Deseas eliminar esta pregunta?")) {
    preguntas.splice(index, 1);
    respuestas = respuestas.filter(r => r.index !== index);
    localStorage.setItem('preguntas', JSON.stringify(preguntas));
    localStorage.setItem('respuestas', JSON.stringify(respuestas));
    cargarPreguntas();
  }
}

function responderEncuesta(index) {
  respuestas.push({ index: index });
  localStorage.setItem('respuestas', JSON.stringify(respuestas));
  alert("¡Respuesta registrada!");
  actualizarGrafica();
}

// Gráfica
function actualizarGrafica() {
  const ctx = document.getElementById('resultadosChart').getContext('2d');
  const counts = preguntas.map((_, i) => respuestas.filter(r => r.index === i).length);

  if (window.chart) window.chart.destroy();
  window.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: preguntas.map(p => p.pregunta),
      datasets: [{
        label: 'Respuestas recibidas',
        data: counts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
