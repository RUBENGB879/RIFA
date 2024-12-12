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
const numbersRef = ref(db, "RIFA/NUMERO");

// Obtener el contenedor de la cuadrícula
const numberGrid = document.getElementById("numberGrid");
let numbers = generateRandomNumbers(100); // Generamos números aleatorios

// Crear la cuadrícula de números
numbers.forEach(number => {
  const numberDiv = document.createElement("div");
  numberDiv.className = "number";
  numberDiv.textContent = number;
  numberDiv.id = `number-${number}`;
  numberDiv.addEventListener("click", () => selectNumber(number, numberDiv));
  numberGrid.appendChild(numberDiv);
});

// Escuchar cambios en Firebase y actualizar la cuadrícula
onValue(numbersRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    for (let key in data) {
      if (data[key] === "vendido") {
        const soldElement = document.getElementById(`number-${key}`);
        if (soldElement) soldElement.classList.add("sold");
      }
    }
  }
});

// Función para generar números aleatorios del 1 al 100
function generateRandomNumbers(count) {
  let numbers = [];
  while (numbers.length < count) {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    if (!numbers.includes(randomNum)) {
      numbers.push(randomNum);
    }
  }
  return numbers;
}

// Función para seleccionar un número
function selectNumber(number, element) {
  if (element.classList.contains("sold")) {
    alert("Este número ya ha sido vendido.");
    return;
  }

  window.selectedNumber = number;
  window.selectedElement = element;

  // Mostrar el modal de ingreso de datos
  document.getElementById('dataModal').style.display = 'flex';
}

// Función para confirmar la compra
function confirmPurchase() {
  const buyerName = document.getElementById('buyerName').value.trim();
  const sellerName = document.getElementById('sellerName').value.trim();

  if (!buyerName || !sellerName) {
    alert("Por favor, ingresa tanto el nombre del comprador como el del vendedor.");
    return;
  }

  const number = window.selectedNumber;  // El número seleccionado
  const element = window.selectedElement;  // El cuadro seleccionado (HTML)

  // Marcar el número como "vendido" en la base de datos
  set(ref(db, `RIFA/NUMERO/${number}`), "vendido")  // Cambiar a "vendido"
    .then(() => {
      // Guardar la información del comprador
      set(ref(db, `RIFA/COMPRADOR/${number}`), buyerName);

      // Guardar la información del vendedor
      set(ref(db, `RIFA/VENDEDOR/${number}`), sellerName)
        .then(() => {
          // Cambiar el estilo del número a "vendido"
          element.classList.add("sold");

          // Cerrar el modal de ingreso de datos
          document.getElementById('dataModal').style.display = 'none';

          // Mostrar mensaje con el número que le tocó
          alert(`¡Compra confirmada! El número que te tocó es: ${number}`);
        })
        .catch((error) => {
          console.error("Error al guardar los datos del vendedor:", error);
          alert("Hubo un problema al guardar los datos del vendedor.");
        });
    })
    .catch((error) => {
      console.error("Error al actualizar Firebase:", error);
      alert("Hubo un problema al marcar el número como vendido.");
    });
}
