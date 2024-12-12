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

// Función para generar números aleatorios
function getRandomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

// Crear la cuadrícula de números aleatorios
const numbers = [];
while (numbers.length < 100) {
  let num = getRandomNumber();
  if (!numbers.includes(num)) numbers.push(num);
}

numbers.forEach(i => {
  const numberDiv = document.createElement("div");
  numberDiv.className = "number";
  numberDiv.textContent = ''; // No mostrar el número en el cuadro
  numberDiv.id = `number-${i}`;
  numberDiv.addEventListener("click", () => selectNumber(i, numberDiv));
  numberGrid.appendChild(numberDiv);
});

// Escuchar cambios en Firebase y actualizar la cuadrícula
onValue(numbersRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    for (let key in data) {
      if (data[key]) {
        const soldElement = document.getElementById(`number-${key}`);
        if (soldElement) soldElement.classList.add("sold");
      }
    }
  }
});

// Función para mostrar el modal de compra
function showPurchaseModal(number, element) {
  // Mostrar el modal
  const modal = document.getElementById('dataModal');
  modal.style.display = 'block';

  // Guardar el número seleccionado para usarlo más tarde
  window.selectedNumber = number;
  window.selectedElement = element;
}

// Función para confirmar la compra
function confirmPurchase() {
  const buyerName = document.getElementById('buyerName').value.trim();
  const sellerName = document.getElementById('sellerName').value.trim();

  if (!buyerName || !sellerName) {
    alert("Por favor, ingresa tanto el nombre del comprador como el del vendedor.");
    return;
  }

  // Si los campos están completos, guardar la información en Firebase
  const number = window.selectedNumber;
  const element = window.selectedElement;

  // Marcar el número como vendido en Firebase
  set(ref(db, `numbers/${number}`), true)
    .then(() => {
      // Guardar la información de la compra en Firebase
      set(ref(db, `purchases/${number}`), {
        buyer: buyerName,
        seller: sellerName
      })
        .then(() => {
          // Cambiar el estilo del número a "vendido"
          element.classList.add("sold");

          // Cerrar el modal
          document.getElementById('dataModal').style.display = 'none';

          // Mostrar mensaje de éxito con el número seleccionado
          alert(`¡Compra confirmada! El número que te tocó es: ${number}`);
        })
        .catch((error) => {
          console.error("Error al guardar los datos de la compra:", error);
          alert("Hubo un problema al guardar los datos.");
        });
    })
    .catch((error) => {
      console.error("Error al actualizar Firebase:", error);
      alert("Hubo un problema al marcar el número como vendido.");
    });
}

// Función para seleccionar un número
function selectNumber(number, element) {
  if (element.classList.contains("sold")) {
    alert("Este número ya ha sido vendido.");
    return;
  }

  // Mostrar el modal de compra
  showPurchaseModal(number, element);
}

