import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { db } from "./index.html"; // Firebase loaded globally

// Elements
const submitBtn = document.getElementById("submit-fact");
const countryInput = document.getElementById("user-country");
const factInput = document.getElementById("user-fact");
const thankyou = document.getElementById("thankyou");
const countryListDiv = document.getElementById("country-list");

// Submit fact
submitBtn.addEventListener("click", () => {
  const country = countryInput.value.trim();
  const fact = factInput.value.trim();
  if (!country && !fact) return alert("Please enter a country or fact.");

  const newSubmission = {
    country: country || null,
    fact: fact || null,
    timestamp: Date.now(),
    approved: true // auto-approve for now
  };

  push(ref(db, "submissions"), newSubmission).then(() => {
    countryInput.value = "";
    factInput.value = "";
    thankyou.style.display = "block";
    setTimeout(() => (thankyou.style.display = "none"), 3000);
  });
});

// Load approved countries
function loadCountries() {
  onValue(ref(db, "submissions"), (snapshot) => {
    const data = snapshot.val();
    countryListDiv.innerHTML = "";
    if (!data) return;

    Object.values(data).forEach((entry) => {
      if (!entry.approved) return;
      const div = document.createElement("div");
      div.className = "country";
      div.innerHTML = `<h2>${entry.country}</h2><p>${entry.fact}</p>`;
      countryListDiv.appendChild(div);
    });
  });
}
loadCountries();
