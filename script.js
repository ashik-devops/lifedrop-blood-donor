/* LifeDrop – Blood Donor Management System
   Vanilla JavaScript only. No backend. Demo data only. */

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const locations = ["Khulna", "Dhaka", "Chattogram", "Rajshahi", "Sylhet"];

/* Sample donors. These names are fictional demo data. */
const donors = [
  { name: "Rahim Ahmed", bloodGroup: "A+", location: "Khulna", availability: "Available", lastDonation: "3 months ago", phone: "01710000001" },
  { name: "Tanvir Hasan", bloodGroup: "B+", location: "Dhaka", availability: "Available", lastDonation: "5 months ago", phone: "01710000002" },
  { name: "Nabila Akter", bloodGroup: "O+", location: "Khulna", availability: "Unavailable", lastDonation: "1 month ago", phone: "01710000003" },
  { name: "Arif Hossain", bloodGroup: "AB+", location: "Chattogram", availability: "Available", lastDonation: "Never donated", phone: "01710000004" },
  { name: "Sadia Rahman", bloodGroup: "A-", location: "Rajshahi", availability: "Available", lastDonation: "4 months ago", phone: "01710000005" },
  { name: "Fahim Islam", bloodGroup: "O-", location: "Khulna", availability: "Available", lastDonation: "6 months ago", phone: "01710000006" },
  { name: "Meherin Chowdhury", bloodGroup: "B-", location: "Dhaka", availability: "Unavailable", lastDonation: "2 months ago", phone: "01710000007" },
  { name: "Kamal Uddin", bloodGroup: "AB-", location: "Khulna", availability: "Available", lastDonation: "8 months ago", phone: "01710000008" },
  { name: "Lamiya Sultana", bloodGroup: "A+", location: "Sylhet", availability: "Available", lastDonation: "4 months ago", phone: "01710000009" },
  { name: "Rashed Khan", bloodGroup: "O+", location: "Dhaka", availability: "Available", lastDonation: "7 months ago", phone: "01710000010" }
];

/* Sample blood requests. Demo data only. */
const requests = [
  { patient: "Demo Patient A", bloodGroup: "O+", hospital: "Khulna Medical College Hospital", location: "Khulna", urgency: "Emergency", date: "2026-09-25" },
  { patient: "Demo Patient B", bloodGroup: "A+", hospital: "Dhaka Medical College Hospital", location: "Dhaka", urgency: "Urgent", date: "2026-09-28" },
  { patient: "Demo Patient C", bloodGroup: "B+", hospital: "Rajshahi Medical College Hospital", location: "Rajshahi", urgency: "Normal", date: "2026-10-02" }
];

/* ---------- Helper functions ---------- */
function fillSelect(selectId, values, firstOption) {
  const select = document.getElementById(selectId);
  select.innerHTML = "";
  if (firstOption) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = firstOption;
    select.appendChild(option);
  }
  values.forEach(function (value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^01[0-9]{9}$/.test(phone);
}

/* ---------- Navbar and theme ---------- */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");

menuBtn.addEventListener("click", function () {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    navLinks.classList.remove("open");
  });
});

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeToggle.textContent = theme === "dark" ? "Light" : "Dark";
  localStorage.setItem("lifedrop-theme", theme);
}

themeToggle.addEventListener("click", function () {
  const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(nextTheme);
});

applyTheme(localStorage.getItem("lifedrop-theme") || "light");

/* ---------- Blood group buttons ---------- */
const bloodGroupButtons = document.getElementById("bloodGroupButtons");
const bloodGroupMessage = document.getElementById("bloodGroupMessage");

bloodGroups.forEach(function (group) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "blood-btn";
  button.textContent = group;
  button.addEventListener("click", function () {
    document.querySelectorAll(".blood-btn").forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");
    document.getElementById("filterBloodGroup").value = group;
    bloodGroupMessage.textContent = "Donor search can be filtered by blood group " + group + ".";
    showDonors();
  });
  bloodGroupButtons.appendChild(button);
});

/* ---------- Donor search ---------- */
fillSelect("filterBloodGroup", bloodGroups, "All Groups");
fillSelect("filterLocation", locations, "All Locations");
fillSelect("donorBloodGroup", bloodGroups, "Select blood group");
fillSelect("donorLocation", locations, "Select location");
fillSelect("requestBloodGroup", bloodGroups, "Select blood group");
fillSelect("requestLocation", locations, "Select location");

function showDonors() {
  const selectedGroup = document.getElementById("filterBloodGroup").value;
  const selectedLocation = document.getElementById("filterLocation").value;
  const selectedAvailability = document.getElementById("filterAvailability").value;
  const donorCards = document.getElementById("donorCards");
  const noDonorMessage = document.getElementById("noDonorMessage");

  const filtered = donors.filter(function (donor) {
    const groupOk = selectedGroup === "" || donor.bloodGroup === selectedGroup;
    const locationOk = selectedLocation === "" || donor.location === selectedLocation;
    const availabilityOk = selectedAvailability === "" || donor.availability === selectedAvailability;
    return groupOk && locationOk && availabilityOk;
  });

  donorCards.innerHTML = "";

  if (filtered.length === 0) {
    noDonorMessage.style.display = "block";
    return;
  }

  noDonorMessage.style.display = "none";

  filtered.forEach(function (donor) {
    const card = document.createElement("article");
    card.className = "donor-card card";
    card.innerHTML =
      "<span class='blood-tag'>" + donor.bloodGroup + "</span>" +
      "<h3>" + donor.name + "</h3>" +
      "<p>Location: " + donor.location + "</p>" +
      "<p>Availability: " + donor.availability + "</p>" +
      "<p>Last donation: " + donor.lastDonation + "</p>" +
      "<button class='btn btn-primary' type='button'>Contact / Request</button>";

    card.querySelector("button").addEventListener("click", function () {
      openModal(
        "<h3>" + donor.name + "</h3>" +
        "<p>Blood group: " + donor.bloodGroup + "</p>" +
        "<p>Location: " + donor.location + "</p>" +
        "<p>Availability: " + donor.availability + "</p>" +
        "<p>Last donation: " + donor.lastDonation + "</p>" +
        "<p>Demo contact: " + donor.phone + "</p>" +
        "<p>This is sample data for a university project.</p>"
      );
    });

    donorCards.appendChild(card);
  });
}

document.getElementById("donorFilterForm").addEventListener("submit", function (event) {
  event.preventDefault();
  showDonors();
});

showDonors();

/* ---------- Sample request cards ---------- */
function showRequests() {
  const requestCards = document.getElementById("requestCards");
  requestCards.innerHTML = "";

  requests.forEach(function (request) {
    const card = document.createElement("article");
    card.className = "request-card card";
    card.innerHTML =
      "<span class='urgency " + request.urgency + "'>" + request.urgency + "</span>" +
      "<h3>" + request.patient + "</h3>" +
      "<p>Blood group: " + request.bloodGroup + "</p>" +
      "<p>Hospital: " + request.hospital + "</p>" +
      "<p>Location: " + request.location + "</p>" +
      "<p>Required date: " + request.date + "</p>" +
      "<button class='btn btn-primary' type='button'>Respond</button>";

    card.querySelector("button").addEventListener("click", function () {
      openModal(
        "<h3>Respond to " + request.patient + "</h3>" +
        "<p>Blood group needed: " + request.bloodGroup + "</p>" +
        "<p>Hospital: " + request.hospital + "</p>" +
        "<p>Location: " + request.location + "</p>" +
        "<p>Urgency: " + request.urgency + "</p>" +
        "<p>This is a demo response. No real message is sent.</p>"
      );
    });

    requestCards.appendChild(card);
  });
}

showRequests();

/* ---------- Modal ---------- */
const detailsModal = document.getElementById("detailsModal");
const modalContent = document.getElementById("modalContent");

function openModal(html) {
  modalContent.innerHTML = html;
  detailsModal.hidden = false;
}

function closeModal() {
  detailsModal.hidden = true;
}

document.getElementById("modalClose").addEventListener("click", closeModal);
detailsModal.addEventListener("click", function (event) {
  if (event.target === detailsModal) {
    closeModal();
  }
});

/* ---------- Form validation ---------- */
document.getElementById("donorForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const errorBox = document.getElementById("donorFormError");
  const successBox = document.getElementById("donorFormSuccess");
  errorBox.textContent = "";
  successBox.textContent = "";

  const name = document.getElementById("donorName").value.trim();
  const email = document.getElementById("donorEmail").value.trim();
  const phone = document.getElementById("donorPhone").value.trim();
  const bloodGroup = document.getElementById("donorBloodGroup").value;
  const age = document.getElementById("donorAge").value.trim();
  const gender = document.getElementById("donorGender").value;
  const location = document.getElementById("donorLocation").value;
  const availability = document.getElementById("donorAvailability").value;
  const lastDonation = document.getElementById("donorLastDonation").value;

  if (!name || !email || !phone || !bloodGroup || !age || !gender || !location || !availability || !lastDonation) {
    errorBox.textContent = "Please fill in all required fields.";
    return;
  }
  if (!isValidEmail(email)) {
    errorBox.textContent = "Please enter a valid email address.";
    return;
  }
  if (!isValidPhone(phone)) {
    errorBox.textContent = "Please enter a valid 11-digit Bangladeshi phone number.";
    return;
  }

  successBox.textContent = "Donor registration successful!";
  event.target.reset();
});

document.getElementById("requestForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const errorBox = document.getElementById("requestFormError");
  const successBox = document.getElementById("requestFormSuccess");
  errorBox.textContent = "";
  successBox.textContent = "";

  const patientName = document.getElementById("patientName").value.trim();
  const bloodGroup = document.getElementById("requestBloodGroup").value;
  const hospitalName = document.getElementById("hospitalName").value.trim();
  const location = document.getElementById("requestLocation").value;
  const requiredDate = document.getElementById("requiredDate").value;
  const phone = document.getElementById("requestPhone").value.trim();
  const urgency = document.getElementById("urgencyLevel").value;
  const message = document.getElementById("requestMessage").value.trim();

  if (!patientName || !bloodGroup || !hospitalName || !location || !requiredDate || !phone || !urgency || !message) {
    errorBox.textContent = "Please fill in all required fields.";
    return;
  }
  if (!isValidPhone(phone)) {
    errorBox.textContent = "Please enter a valid 11-digit Bangladeshi phone number.";
    return;
  }

  successBox.textContent = "Blood request submitted successfully!";
  event.target.reset();
});

document.getElementById("contactForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const errorBox = document.getElementById("contactFormError");
  const successBox = document.getElementById("contactFormSuccess");
  errorBox.textContent = "";
  successBox.textContent = "";

  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !email || !message) {
    errorBox.textContent = "Please fill in all required fields.";
    return;
  }
  if (!isValidEmail(email)) {
    errorBox.textContent = "Please enter a valid email address.";
    return;
  }

  successBox.textContent = "Message sent successfully! (Demo only)";
  event.target.reset();
});

/* ---------- Statistics animation ---------- */
const statNumbers = document.querySelectorAll(".stat-number");
let statsAnimated = false;

function animateStats() {
  if (statsAnimated) {
    return;
  }
  statsAnimated = true;

  statNumbers.forEach(function (number) {
    const target = Number(number.getAttribute("data-target"));
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        number.textContent = target;
        clearInterval(timer);
      } else {
        number.textContent = current;
      }
    }, 30);
  });
}

const statsSection = document.getElementById("statistics");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      animateStats();
    }
  });
  observer.observe(statsSection);
} else {
  animateStats();
}

/* ---------- Scroll to top and footer year ---------- */
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", function () {
  scrollTopBtn.style.display = window.scrollY > 400 ? "block" : "none";
});

scrollTopBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("year").textContent = new Date().getFullYear();
