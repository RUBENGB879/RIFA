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
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Mostrar números de forma aleatoria
function shuffleNumbers() {
    let numbers = [];
    for (let i = 1; i <= 100; i++) {
        numbers.push(i);
    }
    return numbers.sort(() => Math.random() - 0.5); // Mezcla aleatoriamente los números
}

// Mostrar los números en la interfaz
function displayNumbers() {
    const grid = document.getElementById('numberGrid');
    grid.innerHTML = ''; // Limpiar la cuadrícula

    const numbers = shuffleNumbers();
    
    numbers.forEach((number) => {
        const numberElement = document.createElement('div');
        numberElement.classList.add('number', 'hidden'); // Inicialmente oculto
        numberElement.textContent = number;
        numberElement.addEventListener('click', () => selectNumber(number));
        grid.appendChild(numberElement);
        
        // Mostrar los números después de un breve retraso
        setTimeout(() => {
            numberElement.classList.remove('hidden'); // Hacer visible el número
        }, 100); // Ajusta el tiempo según sea necesario
    });
}

// Mostrar el modal para ingresar los datos del comprador y vendedor
function showModal() {
    document.getElementById('dataModal').style.display = 'block';
}

// Guardar los datos de la compra en la base de datos
function saveSale() {
    const buyerName = document.getElementById('buyerName').value;
    const sellerName = document.getElementById('sellerName').value;

    if (!buyerName || !sellerName) {
        alert('Por favor, ingresa el nombre del comprador y vendedor.');
        return;
    }

    // Obtener el número seleccionado
    const selectedNumber = document.querySelector('.number.selected').textContent;

    // Actualizar la base de datos
    const updates = {};
    updates[`/sales/${selectedNumber}`] = { user: buyerName, vendedor: sellerName };
    updates[`/numbers/${selectedNumber}/sold`] = true; // Marcar como vendido

    // Hacer el update en Firebase
    firebase.database().ref().update(updates).then(() => {
        alert('¡Compra confirmada!');
        document.getElementById('dataModal').style.display = 'none'; // Cerrar el modal
        displayNumbers(); // Actualizar la cuadrícula de números
    }).catch(error => {
        alert('Error al guardar la venta: ' + error);
    });
}

// Seleccionar el número
function selectNumber(number) {
    // Evitar que se seleccione un número ya vendido
    const numberRef = firebase.database().ref('numbers/' + number);
    
    numberRef.once('value').then((snapshot) => {
        if (snapshot.exists() && snapshot.val().sold) {
            alert('Este número ya ha sido vendido.');
            return;
        }

        // Marcar el número como seleccionado
        const selectedNumberElement = document.querySelectorAll('.number');
        
        selectedNumberElement.forEach((el) => {
            if (el.textContent === number.toString()) {
                el.classList.add('selected');
                showModal(); // Mostrar el modal para ingresar los datos
            }
        });
    });
}

// Cargar los números cuando la página se carga
window.onload = () => {
   displayNumbers();
};

// Escuchar cambios en Firebase para actualizar en tiempo real
firebase.database().ref('/numbers').on('value', (snapshot) => {
   displayNumbers(); // Llama a esta función para actualizar la vista cuando cambie la base de datos.
});