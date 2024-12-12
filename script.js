
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

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

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencia a los datos de la rifa
const numbersRef = ref(db, "numbers");

// Crear la cuadrícula de números
const grid = document.getElementById("numberGrid");
for (let i = 1; i <= 100; i++) {
    const div = document.createElement("div");
    div.className = "number hidden";
    div.textContent = i;
    div.addEventListener("click", () => {
        if (!div.classList.contains("sold")) {
            // Marca el número como vendido en Firebase
            set(ref(db, `numbers/${i}`), true);
        }
    });
    grid.appendChild(div);
}

// Escucha cambios en Firebase
onValue(numbersRef, (snapshot) => {
    const soldNumbers = snapshot.val() || {};
    document.querySelectorAll(".number").forEach((div) => {
        const number = parseInt(div.textContent);
        if (soldNumbers[number]) {
            div.classList.add("sold");
            div.classList.remove("hidden");
        }
    });
});
