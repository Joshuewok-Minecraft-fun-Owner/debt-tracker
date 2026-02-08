// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD8aRlj5F76g20G4BqHpHfn30D3rfnEBDU",
  authDomain: "kai-s-debt-tracker.firebaseapp.com",
  projectId: "kai-s-debt-tracker",
  storageBucket: "kai-s-debt-tracker.firebasestorage.app",
  messagingSenderId: "957599213827",
  appId: "1:957599213827:web:ac5f6f662aedad1bf76136",
  measurementId: "G-P0DJL061XZ"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// References
const balanceRef = db.ref("balance");
const historyRef = db.ref("history");

// DOM elements
const balanceEl = document.getElementById("balance");
const historyEl = document.getElementById("history");
const amountInput = document.getElementById("amount");

let balance = 0;
let history = [];

// Sync balance from Firebase
balanceRef.on("value", snapshot => {
    balance = snapshot.val() || 0;
    balanceEl.textContent = `$${balance.toFixed(2)}`;
});

// Sync history from Firebase
historyRef.on("value", snapshot => {
    history = snapshot.val() || [];
    renderHistory();
});

// Render history list
function renderHistory() {
    historyEl.innerHTML = "";
    history.forEach(entry => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.textContent = `${entry.type} $${entry.amount.toFixed(2)} — ${entry.date}`;
        historyEl.appendChild(div);
    });
}

// Add amount
document.getElementById("add-btn").onclick = () => {
    const amt = Number(amountInput.value);
    if (amt > 0) {
        balance += amt;
        balanceRef.set(balance);

        history.unshift({ type: "Added", amount: amt, date: new Date().toLocaleString() });
        historyRef.set(history);
    }
};

// Subtract amount
document.getElementById("subtract-btn").onclick = () => {
    const amt = Number(amountInput.value);
    if (amt > 0) {
        balance -= amt;
        balanceRef.set(balance);

        history.unshift({ type: "Subtracted", amount: amt, date: new Date().toLocaleString() });
        historyRef.set(history);
    }
};

// Clear all data
document.getElementById("clear-btn").onclick = () => {
    if (confirm("Clear ALL debt data?")) {
        balanceRef.set(0);
        historyRef.set([]);
    }
};
