const form = document.getElementById("checkInForm");
const water = document.getElementById("waterCount");
const zero = document.getElementById("zeroCount");
const power = document.getElementById("powerCount");
const greetingElem = document.getElementById("greeting");
const counter = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const maxGoal = 50;

// Attendee list array
let attendeeList = [];

// Load counts and attendee list from localStorage if available
function loadCounts() {
  const savedTotal = localStorage.getItem("attendeeCount");
  const savedWater = localStorage.getItem("waterCount");
  const savedZero = localStorage.getItem("zeroCount");
  const savedPower = localStorage.getItem("powerCount");
  if (savedTotal !== null) counter.textContent = savedTotal;
  if (savedWater !== null) water.textContent = savedWater;
  if (savedZero !== null) zero.textContent = savedZero;
  if (savedPower !== null) power.textContent = savedPower;

  const savedAttendees = localStorage.getItem("attendeeList");
  if (savedAttendees) {
    attendeeList = JSON.parse(savedAttendees);
  }
  renderAttendeeList();
}

// Save counts and attendee list to localStorage
function saveCounts() {
  localStorage.setItem("attendeeCount", counter.textContent);
  localStorage.setItem("waterCount", water.textContent);
  localStorage.setItem("zeroCount", zero.textContent);
  localStorage.setItem("powerCount", power.textContent);
  localStorage.setItem("attendeeList", JSON.stringify(attendeeList));
}

// Render attendee list below team counters
function renderAttendeeList() {
  const ul = document.getElementById("attendeeList");
  ul.innerHTML = "";
  attendeeList.forEach(function (attendee) {
    const li = document.createElement("li");
    li.textContent = `${attendee.name} (${attendee.teamLabel})`;
    ul.appendChild(li);
  });
}

// Load counts and attendees on page load
loadCounts();
updateProgressBar();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  if (checkIfMaxReached()) {
    return;
  }

  const inpName = document.getElementById("attendeeName").value;
  const inpTeam = document.getElementById("teamSelect").value;
  console.log(`Form submitted with name: ${inpName}, team: ${inpTeam}`);

  let teamLabel = "";
  if (inpTeam === "water") {
    water.textContent = parseInt(water.textContent) + 1;
    teamLabel = "Team Water Wise";
  } else if (inpTeam === "zero") {
    zero.textContent = parseInt(zero.textContent) + 1;
    teamLabel = "Team Net Zero";
  } else if (inpTeam === "power") {
    power.textContent = parseInt(power.textContent) + 1;
    teamLabel = "Team Renewables";
  }

  // Add attendee to list and save
  if (inpName && inpTeam) {
    attendeeList.push({ name: inpName, team: inpTeam, teamLabel: teamLabel });
    renderAttendeeList();
    showGreeting(inpName, inpTeam);
    document.getElementById("attendeeName").value = "";
    document.getElementById("teamSelect").value = "";
  }

  attendeeCount();
  updateProgressBar();
  saveCounts();
  checkIfMaxReached();
});

// Reset button clears all data and localStorage
document.getElementById("resetBtn").addEventListener("click", function () {
  if (!confirm("Are you sure you want to reset all data?")) return;
  localStorage.clear();
  counter.textContent = "0";
  water.textContent = "0";
  zero.textContent = "0";
  power.textContent = "0";
  attendeeList = [];
  renderAttendeeList();
  updateProgressBar();
  greetingElem.textContent = "";
  greetingElem.style.display = "none";
});

function checkIfMaxReached() {
  const current = parseInt(counter.textContent);
  if (current >= maxGoal) {
    showWinnerAlert();
    return true;
  }
  return false;
}

function showGreeting(name, team) {
  const teamName = team.charAt(0).toUpperCase() + team.slice(1);
  greetingElem.textContent = `Welcome ${name} to Team ${teamName}!`;
  greetingElem.style.display = "block";
}

function attendeeCount() {
  const current = parseInt(counter.textContent);
  if (current < maxGoal) {
    counter.textContent = current + 1;
    saveCounts();
  }
}

function showWinnerAlert() {
  const waterCount = parseInt(water.textContent);
  const zeroCount = parseInt(zero.textContent);
  const powerCount = parseInt(power.textContent);
  let winner = "";

  if (waterCount > zeroCount && waterCount > powerCount) {
    winner = "Team Water wins!";
  } else if (zeroCount > waterCount && zeroCount > powerCount) {
    winner = "Team Zero wins!";
  } else if (powerCount > waterCount && powerCount > zeroCount) {
    winner = "Team Renewables wins!";
  } else if (waterCount === zeroCount && waterCount > powerCount) {
    winner = "It's a tie between Team Water and Team Zero!";
  } else if (waterCount === powerCount && waterCount > zeroCount) {
    winner = "It's a tie between Team Water and Team Renewables!";
  } else if (zeroCount === powerCount && zeroCount > waterCount) {
    winner = "It's a tie between Team Zero and Team Renewables!";
  } else {
    winner = "It's a three-way tie!";
  }
  alert(`Maximum Number of Attendees Reached.\n${winner}`);
}

function updateProgressBar() {
  const currentCount = parseInt(counter.textContent);
  const percent = Math.min((currentCount / maxGoal) * 100, 100);
  progressBar.style.width = `${percent}%`;
}
