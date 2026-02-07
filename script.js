document.addEventListener("DOMContentLoaded", () => {

  const symbols = [
    "simboluri/s1.png",
    "simboluri/s2.png",
    "simboluri/s3.png",
    "simboluri/s4.png",
    "simboluri/s5.png",
    "simboluri/s6.png"
  ];

  const columns = document.querySelectorAll(".column");
  const spinBtn = document.getElementById("spinBtn");
  const jackpotLabel = document.getElementById("jackpotLabel");
  const claimBtn = document.getElementById("claimBtn");

  const spinSound = document.getElementById("spinSound");
  const winSound = document.getElementById("winSound");

  let credits = 1000;
  const creditsEl = document.getElementById("credits");

  function randomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  function spinColumn(column, finalSymbols, delay) {
    const imgs = column.querySelectorAll("img");
    let count = 0;

    const interval = setInterval(() => {
      imgs.forEach(img => img.src = randomSymbol());
      count++;

      if (count > 14) {
        clearInterval(interval);
        setTimeout(() => {
          imgs[0].src = finalSymbols[0];
          imgs[1].src = finalSymbols[1];
          imgs[2].src = finalSymbols[2];
        }, delay);
      }
    }, 80);
  }

  spinBtn.addEventListener("click", () => {

    spinBtn.disabled = true;

    // reset UI jackpot
    jackpotLabel.style.display = "none";
    claimBtn.style.display = "none";

    // scoate highlight vechi
    document.querySelectorAll(".win-line").forEach(el => {
      el.classList.remove("win-line");
    });

    credits -= 10;
    creditsEl.textContent = credits;

    spinSound.currentTime = 0;
    spinSound.play();

    setTimeout(() => {
      spinSound.pause();
      spinSound.currentTime = 0;
    }, 1800);

    const jackpotChance = Math.random() < 0.18;
    let middleRow = [];

    columns.forEach((col, index) => {
      let final;

      if (jackpotChance) {
        const winSymbol = middleRow[0] || randomSymbol();
        final = [randomSymbol(), winSymbol, randomSymbol()];
        middleRow.push(winSymbol);
      } else {
        final = [randomSymbol(), randomSymbol(), randomSymbol()];
        middleRow.push(final[1]);
      }

      spinColumn(col, final, index * 180);
    });

    setTimeout(() => {
      const win = middleRow.every(s => s === middleRow[0]);

      if (win) {
        winSound.currentTime = 0;
        winSound.play();

        credits += 500;
        creditsEl.textContent = credits;

        // highlight DOAR linia din mijloc
        columns.forEach(col => {
          col.querySelector(".middle img").classList.add("win-line");
        });

        // UI jackpot
        spinBtn.style.display = "none";
        jackpotLabel.style.display = "block";
        claimBtn.style.display = "inline-block";

      } else {
        spinBtn.disabled = false;
      }

    }, 2600);
  });

  // CLAIM PRIZE
claimBtn.addEventListener("click", () => {
  window.location.href = "prize.html";
});


});
