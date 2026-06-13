const wakeButton = document.querySelector("#wake-button");
const wakeLabel = wakeButton?.querySelector("span");
const collapseButton = document.querySelector("#collapse-button");
const recipes = [...document.querySelectorAll(".recipe")];
let wakeLock = null;
let keepAwake = false;

const localDate = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

document.querySelectorAll(`[data-date="${localDate}"]`).forEach((element) => {
  element.classList.add("is-today");
});

const todayRecipes = [...document.querySelectorAll(`.recipe[data-date="${localDate}"]`)];
if (todayRecipes.length) {
  recipes.forEach((recipe) => {
    recipe.open = todayRecipes.includes(recipe);
  });
}

function placeWakeButton(recipe) {
  if (!wakeButton || !("wakeLock" in navigator)) {
    return;
  }

  const target = recipe?.querySelector(".recipe-body");
  if (!target) {
    wakeButton.hidden = true;
    return;
  }

  target.prepend(wakeButton);
  wakeButton.hidden = false;
}

placeWakeButton(todayRecipes[0] || recipes.find((recipe) => recipe.open));

recipes.forEach((recipe) => {
  recipe.querySelector("summary")?.addEventListener("click", () => {
    if (!recipe.open) {
      placeWakeButton(recipe);
    } else if (wakeButton && recipe.contains(wakeButton)) {
      setTimeout(() => {
        placeWakeButton(recipes.find((candidate) => candidate.open));
      }, 0);
    }
  });
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target instanceof HTMLDetailsElement) {
      target.open = true;
      placeWakeButton(target);
    }
  });
});

collapseButton?.addEventListener("click", () => {
  const shouldOpen = recipes.every((recipe) => !recipe.open);
  recipes.forEach((recipe) => {
    recipe.open = shouldOpen;
  });
  collapseButton.textContent = shouldOpen ? "Collapse all" : "Open all";
  if (!shouldOpen) {
    wakeButton.hidden = true;
  }
});

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", updateWakeButton);
    updateWakeButton();
  } catch {
    keepAwake = false;
    updateWakeButton();
  }
}

function updateWakeButton() {
  const active = wakeLock && !wakeLock.released;
  wakeButton?.classList.toggle("active", Boolean(active));
  if (wakeLabel) {
    wakeLabel.textContent = active ? "Screen awake" : "Keep awake";
  }
}

if ("wakeLock" in navigator && wakeButton) {
  wakeButton.addEventListener("click", async () => {
    if (wakeLock && !wakeLock.released) {
      keepAwake = false;
      await wakeLock.release();
      wakeLock = null;
      updateWakeButton();
      return;
    }

    keepAwake = true;
    await requestWakeLock();
  });

  document.addEventListener("visibilitychange", async () => {
    if (keepAwake && document.visibilityState === "visible") {
      await requestWakeLock();
    }
  });
}
