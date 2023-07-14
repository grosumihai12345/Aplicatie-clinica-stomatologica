// Obține elementele de input pentru data și ora
var dateInput = document.getElementById("date-input");
var timeInput = document.getElementById("time-input");

// Adaugă un eveniment pentru verificarea datelor introduse la schimbarea valorii
dateInput.addEventListener("change", validateDateTime);
timeInput.addEventListener("change", validateDateTime);

function validateDateTime() {
  // Obține data și ora introduse
  var selectedDate = new Date(dateInput.value);
  var selectedTime = timeInput.value;

  // Obține ziua săptămânii pentru data introdusă (0 - Duminică, 6 - Sâmbătă)
  var dayOfWeek = selectedDate.getDay();

  // Obține ora și minutele din timpul introdus
  var hours = parseInt(selectedTime.split(":")[0]);
  var minutes = parseInt(selectedTime.split(":")[1]);

  // Obține ora curentă
  var currentHour = new Date().getHours();

  // Verifică dacă data introdusă nu este din trecut
  if (selectedDate < new Date().setHours(0, 0, 0, 0)) {
    alert("Data introdusă nu poate fi din trecut!");
    dateInput.value = ""; // Golește câmpul de data introdusă
    return;
  }

  // Verifică dacă ora introdusă este între 9:00 și 18:00
  if (hours < 9 || hours > 18 || (hours === 18 && minutes > 0)) {
    alert("Programările sunt disponibile doar între 9:00 și 18:00!");
    timeInput.value = "09:00"; // Setează ora implicită la 09:00
    return;
  }

  // Verifică dacă ora introdusă se termină în :00 (ore fixe)
  if (minutes !== 0) {
    alert("Vă rugăm să alegeți doar ore fixe (care se termină în :00)!");
    timeInput.value = selectedTime.slice(0, -1) + "00"; // Setează minutele la 00
    return;
  }

  // Verifică dacă programările nu se fac în weekend (sâmbătă sau duminică)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    alert("Nu se pot face programări în weekend!");
    dateInput.value = ""; // Golește câmpul de data introdusă
    return;
  }
}
