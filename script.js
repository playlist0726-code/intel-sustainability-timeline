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

const bootstrapStylesheet = document.querySelector("#bootstrap-stylesheet");
const directionStatus = document.querySelector("#direction-status");
const languageButtons = document.querySelectorAll("[data-language]");
const rtlLanguages = new Set(["ar", "dv", "fa", "he", "ku", "ps", "ur"]);
const bootstrapBuilds = {
  ltr: {
    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css",
    integrity: "sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB",
  },
  rtl: {
    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.rtl.min.css",
    integrity: "sha384-CfCrinSRH2IR6a4e6fy2q6ioOX7O6Mtm1L9vRvFZ1trBncWmMePhzvafv7oIcWiW",
  },
};

function applyLanguageDirection({ announce = true } = {}) {
  const language = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const isRtl = rtlLanguages.has(language);
  const direction = isRtl ? "rtl" : "ltr";
  const build = bootstrapBuilds[direction];

  document.documentElement.dir = direction;
  bootstrapStylesheet.href = build.href;
  bootstrapStylesheet.integrity = build.integrity;

  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (announce && directionStatus) {
    directionStatus.textContent = isRtl
      ? "Right-to-left layout is active."
      : "Left-to-right layout is active.";
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.documentElement.lang = button.dataset.language;
    applyLanguageDirection();
  });
});

new MutationObserver(() => applyLanguageDirection()).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["lang"],
});

applyLanguageDirection({ announce: false });

const newsletterForm = document.querySelector("#newsletter-form");

if (newsletterForm) {
  const email = newsletterForm.querySelector("#subscriber-email");
  const consent = newsletterForm.querySelector("#newsletter-consent");
  const emailError = newsletterForm.querySelector("#email-error");
  const consentError = newsletterForm.querySelector("#consent-error");
  const formStatus = newsletterForm.querySelector("#form-status");

  const clearFieldError = (field, messageElement) => {
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");
    messageElement.textContent = "";
  };

  email.addEventListener("input", () => clearFieldError(email, emailError));
  consent.addEventListener("change", () => clearFieldError(consent, consentError));

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "";
    clearFieldError(email, emailError);
    clearFieldError(consent, consentError);

    let firstInvalidField = null;

    if (!email.value.trim() || !email.validity.valid) {
      email.classList.add("is-invalid");
      email.setAttribute("aria-invalid", "true");
      emailError.textContent = "Enter a valid email address, such as name@example.com.";
      firstInvalidField = email;
    }

    if (!consent.checked) {
      consent.classList.add("is-invalid");
      consent.setAttribute("aria-invalid", "true");
      consentError.textContent = "Please confirm that you agree to receive the newsletter.";
      firstInvalidField ||= consent;
    }

    if (firstInvalidField) {
      firstInvalidField.focus();
      return;
    }

    newsletterForm.reset();
    formStatus.textContent = "Thank you. Your sustainability newsletter preference has been recorded for this demo.";
  });
}
