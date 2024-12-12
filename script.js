// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBpvppW4dSA1Q8QLpN3Lm7vG_VsWxjaUZY",
  authDomain: "rifa-b34bd.firebaseapp.com",
  databaseURL: "https://rifa-b34bd-default-rtdb.firebaseio.com",
  projectId: "rifa-b34bd",
  storageBucket: "rifa-b34bd.firebasestorage.app",
  messagingSenderId: "43453281277",
  appId: "1:43453281277:web:58e780f8af2f9c12b19f94",
  measurementId: "G-Z4LXCJEF85"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencia a la base de datos
const numbersRef = ref(db, "numbers");

// Obtener el contenedor de la cuadrícula
const numberGrid = document.getElementById("numberGrid");

// Crear la cuadrícula de números aleatorios
function createRandomNumbers() {
  const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
  return numbers.sort(() => Math.random() - 0.5); // Mezcla aleatoriamente los números
}

// Mostrar los números en la interfaz
function displayNumbers() {
  const randomNumbers = createRandomNumbers();
  
  randomNumbers.forEach((number) => {
    const numberDiv = document.createElement("div");
    numberDiv.className = "number hidden"; // Inicialmente oculto
    numberDiv.textContent = number;
    numberDiv.id = `number-${number}`;
    numberDiv.addEventListener("click", () => selectNumber(number, numberDiv));
    numberGrid.appendChild(numberDiv);
  });
}

// Escuchar cambios en Firebase y actualizar la cuadrícula
onValue(numbersRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    for (let key in data) {
      if (data[key].sold) {
        const soldElement = document.getElementById(`number-${key}`);
        if (soldElement) soldElement.classList.add("sold"); // Marcar como vendido
      }
    }
  }
});

// Función para seleccionar un número
function selectNumber(number, element) {
  if (element.classList.contains("sold")) {
    alert("Este número ya ha sido vendido.");
    return;
  }

  // Mostrar modal para ingresar datos
  document.getElementById('dataModal').style.display = 'block';
  
  // Guardar el número seleccionado en una variable global para usarlo más tarde
  window.selectedNumber = number;
}

// Guardar los datos de la compra en Firebase
function saveSale() {
  const buyerName = document.getElementById('buyerName').value;
  const sellerName = document.getElementById('sellerName').value;

  if (!buyerName || !sellerName) {
    alert('Por favor, ingresa el nombre del comprador y vendedor.');
    return;
  }

  // Marcar el número como vendido en Firebase
  set(ref(db, `numbers/${window.selectedNumber}`), { sold: true })
    .then(() => {
      alert(`¡Número ${window.selectedNumber} seleccionado y marcado como vendido!`);
      document.getElementById('dataModal').style.display = 'none'; // Cerrar el modal
      displayNumbers(); // Actualizar la cuadrícula de números
    })
    .catch((error) => {
      console.error("Error al actualizar Firebase:", error);
      alert("Hubo un problema al seleccionar este número. Intenta nuevamente.");
    });
}

// Cargar los números cuando la página se carga
window.onload = () => {
   displayNumbers();
};

// Bloquear la salida si el formulario no ha sido completado
window.addEventListener('beforeunload', function (event) {
   if (document.getElementById('dataModal').style.display === 'block') {
       const confirmationMessage = "Tienes un número seleccionado, ¿estás seguro de que quieres salir sin completar la compra?";
       event.returnValue = confirmationMessage; // Este mensaje aparece en algunos navegadores.
       return confirmationMessage; // Para otros navegadores.
   }
});

