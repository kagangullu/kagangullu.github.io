import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// Firebase konfigürasyonu
const firebaseConfig = {
    apiKey: "AIzaSyBEfUlWoBNOnIosQSUPJ23cWeZws7TKTcc",
    authDomain: "dm-marketing-app.firebaseapp.com",
    projectId: "dm-marketing-app",
    storageBucket: "dm-marketing-app.firebasestorage.app",
    messagingSenderId: "134047990300",
    appId: "1:134047990300:web:87fb98f6f6e6cb1869d5d9",
    measurementId: "G-YBZVPYR8DQ"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sayfa yüklendiğinde veritabanından checkbox durumunu çek
document.addEventListener('DOMContentLoaded', () => {
    // Tüm checkbox'ları al
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
        const userId = checkbox.id.split('-')[1]; // ID'den kullanıcıyı ayıkla

        // Kullanıcı verisini Firestore'dan çek
        const userRef = doc(db, 'users', userId);
        getDoc(userRef).then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                checkbox.checked = userData.checked || false; // Veriyi checkbox'a uygula

                // Checkbox'un bulunduğu satırın data-checked özelliğini güncelle
                const row = checkbox.closest('tr');
                row.dataset.checked = (userData.checked || false).toString();
            } else {
                console.log("Kullanıcı bulunamadı:", userId);
            }
        }).catch((error) => {
            console.error("Firestore'dan veri okuma hatası:", error);
        });
    });
});

// Checkbox tıklama işlevini tanımla
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox, index) => {
    checkbox.addEventListener('click', (event) => {
        const userId = checkbox.id.split('-')[1]; // ID'den kullanıcıyı ayıkla
        const isChecked = checkbox.checked;

        // Veritabanına yaz
        const userRef = doc(db, 'users', userId);

        setDoc(userRef, { checked: isChecked }, { merge: true })
            .then(() => {
                console.log("Checkbox durumu başarıyla kaydedildi:", userId, isChecked);

                // Satırın data-checked özelliğini güncelle
                const row = checkbox.closest('tr');
                row.dataset.checked = isChecked.toString();
            })
            .catch((error) => {
                console.error("Firestore'a yazarken hata:", error);
            });
    });
});