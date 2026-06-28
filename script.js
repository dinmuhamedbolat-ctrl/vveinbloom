const services = [
  {
    id: "classic",
    name: "Маникюр с покрытием",
    price: 6000,
    duration: 110,
    text: "Аппаратная обработка, выравнивание и стойкое покрытие гель-лаком.",
  },
  {
    id: "strength",
    name: "Укрепление + дизайн",
    price: 7500,
    duration: 140,
    text: "Для тонких ногтей: укрепление базой или гелем и легкий акцентный дизайн.",
  },
  {
    id: "care",
    name: "без покрытия",
    price: 2100,
    duration: 75,
    text: "Форма, кутикула, полировка",
  },
];

const slots = ["14:00", "16:00", "18:00"];
const rub = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "KZT", maximumFractionDigits: 0 });

const serviceGrid = document.querySelector("#serviceGrid");
const serviceSelect = document.querySelector("#service");
const slotGrid = document.querySelector("#slotGrid");
const bookingForm = document.querySelector("#bookingForm");
const dateInput = document.querySelector("#date");
const summaryText = document.querySelector("#summaryText");
const summaryTotal = document.querySelector("#summaryTotal");
const confirmation = document.querySelector("#confirmation");
const confirmationTitle = document.querySelector("#confirmationTitle");
const confirmationText = document.querySelector("#confirmationText");
const editBooking = document.querySelector("#editBooking");

let selectedSlot = slots[0];

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} ч ${rest} мин` : `${hours} ч`;
}

function getService() {
  return services.find((service) => service.id === serviceSelect.value) ?? services[0];
}

function renderServices() {
  serviceGrid.innerHTML = services
    .map(
      (service) => `
        <article class="service-card">
          <div>
            <h3>${service.name}</h3>
            <p>${service.text}</p>
          </div>
          <div class="service-meta">
            <span>${rub.format(service.price)}</span>
            <span>${formatDuration(service.duration)}</span>
          </div>
        </article>
      `,
    )
    .join("");

  serviceSelect.innerHTML = services
    .map((service) => `<option value="${service.id}">${service.name}</option>`)
    .join("");
}

function renderSlots() {
  slotGrid.innerHTML = slots
    .map(
      (slot) => `
        <button class="slot-button" type="button" aria-pressed="${slot === selectedSlot}" data-slot="${slot}">
          ${slot}
        </button>
      `,
    )
    .join("");
}

function updateSummary() {
  const service = getService();
  summaryText.textContent = `${service.name}: ${rub.format(service.price)}, ${formatDuration(service.duration)}`;
  summaryTotal.textContent = rub.format(service.price);
}

function setInitialDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const value = tomorrow.toISOString().slice(0, 10);
  dateInput.min = value;
  dateInput.value = value;
}

slotGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-slot]");
  if (!button) return;
  selectedSlot = button.dataset.slot;
  renderSlots();
});

serviceSelect.addEventListener("change", updateSummary);

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const service = getService();
  const date = new Date(`${formData.get("date")}T${selectedSlot}:00`);
  const readableDate = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    weekday: "long",
  });

  confirmationTitle.textContent = `${formData.get("name")}, запись подтверждена`;
  confirmationText.textContent = `${readableDate} в ${selectedSlot}, мастер ${formData.get("master")}. Услуга: ${service.name}, ${rub.format(service.price)}. Мы свяжемся с вами по номеру ${formData.get("phone")}.`;
  confirmation.hidden = false;
  confirmation.scrollIntoView({ behavior: "smooth", block: "center" });
});

editBooking.addEventListener("click", () => {
  confirmation.hidden = true;
  bookingForm.scrollIntoView({ behavior: "smooth", block: "center" });
});

renderServices();
setInitialDate();
renderSlots();
updateSummary();
