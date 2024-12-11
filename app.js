import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBEfUlWoBNOnIosQSUPJ23cWeZws7TKTcc",
    authDomain: "dm-marketing-app.firebaseapp.com",
    projectId: "dm-marketing-app",
    storageBucket: "dm-marketing-app.appspot.com",
    messagingSenderId: "134047990300",
    appId: "1:134047990300:web:87fb98f6f6e6cb1869d5d9"
};

// Firebase başlat
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Kullanıcıları yükle
document.addEventListener("DOMContentLoaded", () => {
    const userTable = document.getElementById("user-table");
    const userCount = document.getElementById("user-count");

    fetch("data.json") // Kullanıcı verisini JSON dosyasından çek
        .then(response => response.json())
        .then(users => {
            userCount.textContent = `${users.length} users found`;
            loadCheckedUsers(users);
        })
        .catch(error => console.error("Veri yüklenirken hata oluştu:", error));
});

// Firestore'dan checkbox verilerini çek ve tabloyu oluştur
function loadCheckedUsers(users) {
    db.collection("checkedUsers").get().then(snapshot => {
        const checkedUsers = {};
        snapshot.forEach(doc => {
            checkedUsers[doc.id] = doc.data().checked;
        });

        displayUsers(users, checkedUsers);
    });
}

// Kullanıcıları tabloya yazdır
function displayUsers(users, checkedUsers) {
    const userTable = document.getElementById("user-table");

    users.forEach((user, index) => {
        const isChecked = checkedUsers[user.Username] || false;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.Full_name} 
                ${user.Is_verified === "TRUE" ? '<img src="verified.png" alt="Verified" style="width:20px; margin-left:10px;">' : ""}
            </td>
            <td>
                <input type="checkbox" id="checkbox-${index}" ${isChecked ? "checked" : ""}>
            </td>
        `;

        // Checkbox olayını ekle
        const checkbox = row.querySelector("input[type='checkbox']");
        checkbox.addEventListener("click", () => saveCheckboxState(user.Username, checkbox.checked));

        userTable.appendChild(row);
    });
}

// Checkbox durumunu Firestore'a kaydet
function saveCheckboxState(username, isChecked) {
    db.collection("checkedUsers").doc(username).set({ checked: isChecked }, { merge: true })
        .then(() => console.log("Başarıyla kaydedildi:", username, isChecked))
        .catch(error => console.error("Hata:", error));
}