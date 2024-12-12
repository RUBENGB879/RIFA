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

// Crear un array con los números del 1 al 100 y mezclarlo aleatoriamente
const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
shuffleArray(numbers);

// Función para mezclar un array aleatoriamente
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Crear la cuadrícula de números (sin mostrar el número aún)
numbers.forEach((number, index) => {
  const numberDiv = document.createElement("div");
  numberDiv.className = "number";
  numberDiv.id = `number-${number}`;
  numberDiv.addEventListener("click", () => selectNumber(number, numberDiv));
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

// Función para seleccionar un número
function selectNumber(number, element) {
  if (element.classList.contains("sold")) {
    alert("Este número ya ha sido vendido.");
    return;
  }

  // Mostrar el número en el cuadro
  element.textContent = number;

  // Mostrar el formulario de datos
  const dataModal = document.getElementById("dataModal");
  dataModal.style.display = "block";

  // Guardar la información en Firebase después de que el formulario se haya completado
  document.querySelector("button[onclick='continuePurchase()']").onclick = () => continuePurchase(number);
}

// Función para continuar la compra
function continuePurchase(number) {
  const buyerName = document.getElementById("buyerName").value;
  const sellerName = document.getElementById("sellerName").value;

  if (!buyerName || !sellerName) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  // Guardar los datos en Firebase
  set(ref(db, `purchases/${number}`), {
    buyer: buyerName,
    seller: sellerName
  })
  .then(() => {
    alert(`Compra confirmada para el número ${number}!`);
    // Marcar el número como vendido en Firebase
    set(ref(db, `numbers/${number}`), true)
      .then(() => {
        const soldElement = document.getElementById(`number-${number}`);
        soldElement.classList.add("sold");
      })
      .catch((error) => {
        console.error("Error al actualizar Firebase:", error);
        alert("Hubo un problema al actualizar la base de datos.");
      });

    // Cerrar el modal y resetear el formulario
    document.getElementById("dataModal").style.display = "none";
    document.getElementById("buyerName").value = "";
    document.getElementById("sellerName").value = "";
  })
  .catch((error) => {
    console.error("Error al guardar la compra:", error);
    alert("Hubo un problema al guardar los datos.");
  });
}
