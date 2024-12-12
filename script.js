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

// Generamos números aleatorios del 1 al 100
let numbers = generateRandomNumbers(100);

// Crear la cuadrícula de números
numbers.forEach(number => {
  const numberDiv = document.createElement("div");
  numberDiv.className = "number";
  numberDiv.textContent = "?";  // Los números estarán ocultos
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
        soldElement.textContent = "Vendido"; // Mostrar "Vendido"
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

  // Mostrar el número en el cuadro (reemplazar el signo de interrogación)
  element.textContent = number;

  // Marcar el número como "vendido" en Firebase
  set(ref(db, `RIFA/NUMERO/${number}`), "vendido")
    .then(() => {
      // Cambiar el estilo del número a "vendido"
      element.classList.add("sold");

      // Mostrar mensaje con el número que le tocó
      alert(`¡Número ${number} seleccionado y marcado como vendido!`);
    })
    .catch((error) => {
      console.error("Error al actualizar Firebase:", error);
      alert("Hubo un problema al marcar el número como vendido.");
    });
}
