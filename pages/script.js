// Contact page logic

// Section toggling logic
const formSection = document.getElementById('formSection');
const infoSection = document.getElementById('infoSection');
let currentView = 'form';

function showForm() {
    formSection.classList.remove('hide-up');
    formSection.classList.add('visible');
    infoSection.classList.remove('visible');
    infoSection.classList.add('hide-up');
    currentView = 'form';
}

function showInfo() {
    formSection.classList.remove('visible');
    formSection.classList.add('hide-up');
    infoSection.classList.remove('hide-up');
    infoSection.classList.add('visible');
    currentView = 'info';
}

function toggleView() {
    if (currentView === 'form') {
        showInfo();
    } else {
        showForm();
    }
}

window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0 && currentView === 'form') {
        showInfo();
    } else if (e.deltaY < 0 && currentView === 'info') {
        showForm();
    }
}, { passive: true });

window.addEventListener('dblclick', () => {
    toggleView();
});

// Validation functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
}

// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyArUblMGjSboVjL0y9uXvcmD9yGCIeKLwQ",
    authDomain: "sundeep-kumarr.firebaseapp.com",
    databaseURL: "https://sundeep-kumarr-default-rtdb.firebaseio.com",
    projectId: "sundeep-kumarr",
    storageBucket: "sundeep-kumarr.firebasestorage.app",
    messagingSenderId: "607938989487",
    appId: "1:607938989487:web:ed76b81e87bc0873de335a",
    measurementId: "G-HNL7GT7S9C"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Submit Form Data to Firebase
document.getElementById("submit").addEventListener("click", submitForm);

function submitForm(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    if (!name || !email || !message) {
        alert("Please fill in all required fields (Name, Email, Message).");
        return;
    }
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (!isValidPhone(phone)) {
        alert("Please enter a valid phone number.");
        return;
    }

    // Reference to Firebase database
    const dbRef = ref(database, "messages");

    // Push data to Firebase
    push(dbRef, {
        name: name,
        phone: phone,
        email: email,
        message: message,
        timestamp: Date.now()
    })
    .then(() => {
        const notificationContent = `New message from ${name}:\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`;
        sendTelegramNotification(notificationContent);
        sendEmailNotification({ name, phone, email, message });
        alert(`Thanks ${name}, your message has been sent!`);
        document.getElementById("contactForm").reset();
    })
    .catch((error) => {
        console.error("Error:", error);
        alert("Failed to send message.");
    });
}

/* ========= Telegram Notification ========= */
async function sendTelegramNotification(messageContent) {
    const telegramBotToken = "7479865106:AAF-WWEWDRTUvTK5Zq7dOtPYA2g3uRIPR5w";
    const telegramChatId = "5819112565";
    const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    try {
        const response = await fetch(telegramApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: telegramChatId,
                text: messageContent
            })
        });
        return response.json();
    } catch (error) {
        console.error("Telegram Notification Error:", error);
    }
}

/* ========= Email Notification Placeholder ========= */
async function sendEmailNotification(formData) {
    // Integrate with your email service here
    // Example: EmailJS, SendGrid, etc.
    // This is a placeholder function.
}

/* ========= Popup Message ========= */
function showPopup(message) {
    let popup = document.getElementById('popupMessage');
    if (!popup) {
        popup = document.createElement('div');
        popup.id = 'popupMessage';
        popup.style.position = 'fixed';
        popup.style.bottom = '40px';
        popup.style.left = '50%';
        popup.style.transform = 'translateX(-50%)';
        popup.style.background = '#fe6807';
        popup.style.color = '#fff';
        popup.style.padding = '16px 32px';
        popup.style.borderRadius = '24px';
        popup.style.fontSize = '1.1rem';
        popup.style.boxShadow = '0 4px 24px rgba(0,0,0,0.15)';
        popup.style.zIndex = '9999';
        popup.style.display = 'none';
        popup.style.transition = 'opacity 0.4s';
        document.body.appendChild(popup);
    }
    popup.textContent = message;
    popup.style.display = 'block';
    popup.style.opacity = '1';

    // Trigger reflow to enable animation
    void popup.offsetWidth;

    popup.classList.add('show-popup');

    // Auto-hide after 2 seconds
    setTimeout(() => {
        popup.classList.remove('show-popup');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 400); // Match transition duration
    }, 2000);
}