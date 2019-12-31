let countdown;
const timerDisplay = document.querySelector(".display__time-left");
const endTime = document.querySelector(".display__end-time");
const buttons = document.querySelectorAll("[data-time]");

function timer(seconds) {
  //clear any existing timers when we select new timers
  clearInterval(countdown);
  // figure out when the timer started. current timestamp in milliseconds
  const now = Date.now();
  // in seconds, * 1000 to get in milliseconds
  const then = now + seconds * 1000;
  // run function immediately once
  displayTimeLeft(seconds);
  displayEndTime(then);
  //need to store interval in its own var so we can stop it
  countdown = setInterval(() => {
    //figure out time left on clock
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    //check if we should stop it
    if (secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    //display it
    // and then once every 1 sec
    displayTimeLeft(secondsLeft);
  }, 1000);
}

// allows setInterval to run immediately
function displayTimeLeft(seconds) {
  // only care about whole minutes, so get the lower bound
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${
    remainderSeconds < 10 ? "0" : ""
  }${remainderSeconds}`;
  //the title tag in html
  document.title = display;
  timerDisplay.textContent = display;
}

//param is when you wanna finish
function displayEndTime(timestamp) {
  // gives us a proper date string:
  // Ex: new Date(1577763730571) gives us:
  // Mon Dec 30 2019 19:42:10 GMT-0800 (Pacific Standard Time)
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();
  //   account for european time: 13:00 is 1:00pm
  endTime.textContent = `Be Back At ${hour > 12 ? hour - 12 : hour}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
}

function startTimer() {
  // provides object with time on it. provides string of number of seoncds. all matches in html with each data-[value] attribute
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

buttons.forEach(button => button.addEventListener("click", startTimer));
document.customForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  timer(mins * 60);
  this.reset();
});
