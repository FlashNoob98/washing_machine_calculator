const currentTimeEl = document.getElementById('current-time');
const resultEl = document.getElementById('result');
const errorEl = document.getElementById('error');
const calculateButton = document.getElementById('calculate');
const targetEndInput = document.getElementById('target-end');
const durationHoursInput = document.getElementById('duration-hours');
const durationMinutesInput = document.getElementById('duration-minutes');

let currentDate = null;
let timezoneOffsetMs = 0;

function formatTime(date) {
  return date.toLocaleString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function updateDisplayClock() {
  if (!currentDate) return;
  currentDate = new Date(currentDate.getTime() + 1000);
  currentTimeEl.textContent = formatTime(currentDate);
}

function fetchInternetTime() {
  currentDate = new Date();
  currentTimeEl.textContent = formatTime(currentDate);
  errorEl.textContent = '';
}

function parseTargetEndTime() {
  const value = targetEndInput.value;
  if (!value) {
    throw new Error('Inserisci l’orario di fine desiderato.');
  }

  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    throw new Error('Formato orario non valido. Usa HH:MM.');
  }

  const targetDate = new Date(currentDate);
  targetDate.setHours(hours, minutes, 0, 0);

  if (targetDate.getTime() <= currentDate.getTime()) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  return targetDate;
}

function computeDelay() {
  if (!currentDate) {
    throw new Error('Ora corrente non disponibile. Riprova tra pochi secondi.');
  }

  const targetDate = parseTargetEndTime();
  const durationHours = Number(durationHoursInput.value) || 0;
  const durationMinutes = Number(durationMinutesInput.value) || 0;

  if (durationHours < 0 || durationMinutes < 0 || durationMinutes >= 60) {
    throw new Error('La durata deve essere un valore valido.');
  }

  const durationMs = (durationHours * 60 + durationMinutes) * 60 * 1000;
  if (durationMs <= 0) {
    throw new Error('Inserisci una durata del programma maggiore di zero.');
  }

  const startDate = new Date(targetDate.getTime() - durationMs);
  const delayMs = startDate.getTime() - currentDate.getTime();

  return {
    targetDate,
    startDate,
    delayMs,
    durationMs,
  };
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':')
    .replace(/^00:/, '')
    .replace(/^0/, '');
}
function showResult() {
  try {
    const { targetDate, startDate, delayMs } = computeDelay();

    resultEl.innerHTML = `
      Orario di fine richiesto: <strong>${formatTime(targetDate)}</strong><br />
      Durata programma: <strong>${durationHoursInput.value}h ${durationMinutesInput.value}m</strong><br />
      Avvia la lavastoviglie alle: <strong>${startDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</strong><br />
      Ritardo consigliato: <strong>${delayMs <= 0 ? 'Avvia immediatamente' : formatDuration(delayMs)}</strong>
    `;
    resultEl.style.display = 'block';
    errorEl.textContent = '';
    errorEl.style.display = 'none';

  } catch (error) {

    resultEl.textContent = '';

    errorEl.textContent = error.message;
    errorEl.style.display = 'block';
  }
}

calculateButton.addEventListener('click', showResult);

fetchInternetTime();
setInterval(updateDisplayClock, 1000);
//setInterval(fetchInternetTime, 5 * 60 * 1000);
