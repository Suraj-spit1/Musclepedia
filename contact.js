"use strict";

// Contact form handler
document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const feedback = document.getElementById("contactFeedback");

    const firstName = document.getElementById("firstName").value.trim();
    const lastName  = document.getElementById("lastName").value.trim();
    const email     = document.getElementById("email").value.trim();
    const subject   = document.getElementById("subject").value;
    const message   = document.getElementById("message").value.trim();

    // Basic validation
    if (!firstName || !lastName || !email || !subject || !message) {
        feedback.textContent = "Please fill in all required fields.";
        feedback.classList.add("error");
        return;
    }

    // Simple email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        feedback.textContent = "Please enter a valid email address.";
        feedback.classList.add("error");
        return;
    }

    // Success (form is front-end only)
    feedback.classList.remove("error");
    feedback.textContent = "Message sent! We'll get back to you soon.";
    event.target.reset();
});

// Mobile navigation toggle
const menuToggle = document.getElementById("menuToggle");
const navLinks   = document.getElementById("navLinks");

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Toggle navigation");
});

navLinks.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Toggle navigation");
    }
});

// Set footer year
document.getElementById("year").textContent = new Date().getFullYear();
