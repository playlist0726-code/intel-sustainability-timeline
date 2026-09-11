document.querySelectorAll(".card-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".milestone");
    const willOpen = !card.classList.contains("is-open");

    document.querySelectorAll(".milestone.is-open").forEach((openCard) => {
      if (openCard !== card) {
        openCard.classList.remove("is-open");
        openCard.querySelector(".card-toggle")?.setAttribute("aria-expanded", "false");
      }
    });

    card.classList.toggle("is-open", willOpen);
    button.setAttribute("aria-expanded", String(willOpen));
    button.querySelector("span").textContent = willOpen ? "Close milestone" : "Explore milestone";
  });
});
