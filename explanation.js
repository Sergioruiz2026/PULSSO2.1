const explanationText = "PASO 1\nMarcas cómo estás hoy.\n\nPASO 2\nEliges a las personas que forman tu red de apoyo.\n\nPASO 3\nSi dejas de entrar durante tres días, PULSSO avisa a tu red para que pueda preguntarte cómo estás.\n\nPASO 4\nPuedes responder con voz o por WhatsApp.\n\nIMPORTANTE\nPULSSO no es terapia, no reemplaza a profesionales de la salud y no diagnostica. Solo te ayuda a no estar solo o sola en momentos difíciles.\n\nRED DE APOYO\nContactos MINSAL. Crisis o riesgo inmediato: llama al *4141, Salud Responde al 600 360 7777 o a la Línea de Prevención del Suicidio.";
const titleText = "Demo de cómo funciona PULSSO";
const pilotText = "Piloto INACAP VALPARAISO";

function configureVoiceButton(title) {
  const voiceButton = [...document.querySelectorAll("button")].find(
    (element) => element.textContent.includes("Escuchar cómo funciona PULSSO con voz")
  );

  if (!voiceButton || voiceButton.dataset.fullExplanationVoice === "true") {
    return Boolean(voiceButton);
  }

  const replacement = voiceButton.cloneNode(true);
  replacement.dataset.fullExplanationVoice = "true";
  replacement.textContent = "🔊";
  replacement.setAttribute("aria-label", "Escuchar explicación completa de PULSSO");
  replacement.setAttribute("title", "Escuchar explicación completa de PULSSO");
  Object.assign(replacement.style, {
    display: "inline-flex",
    width: "36px",
    height: "36px",
    padding: "0",
    borderRadius: "50%",
    fontSize: "18px",
    lineHeight: "1",
    marginTop: "0",
    marginLeft: "8px",
    verticalAlign: "middle",
    background: "#14b8a6",
    color: "#06151b",
    boxShadow: "0 5px 18px rgba(20, 184, 166, 0.22)"
  });
  replacement.addEventListener("click", () => {
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(
      `${title.textContent}. ${explanationText.replaceAll("\n", " ")}`
    );
    speech.lang = "es-CL";
    speech.rate = 0.88;
    speech.pitch = 1;
    speech.volume = 1;
    const spanishVoice = window.speechSynthesis.getVoices().find(
      (voice) => voice.lang.toLowerCase().startsWith("es")
    );
    if (spanishVoice) {
      speech.voice = spanishVoice;
    }
    replacement.textContent = "■";
    replacement.setAttribute("title", "Reproduciendo explicación");
    speech.onend = () => {
      replacement.textContent = "🔊";
      replacement.setAttribute("title", "Escuchar explicación completa de PULSSO");
    };
    window.speechSynthesis.speak(speech);
  });
  voiceButton.replaceWith(replacement);
  title.insertAdjacentElement("afterend", replacement);
  return true;
}

function updateExplanation() {
  const pilot = [...document.querySelectorAll("div")].find(
    (element) => element.textContent.trim() === "Solo para el piloto UDD / U de Chile"
  );
  const title = [...document.querySelectorAll("div")].find(
    (element) => element.textContent.trim() === titleText
  );
  const explanation = [...document.querySelectorAll("div")].find(
    (element) => element.dataset.pulssoExplanation === "true" ||
      element.textContent.trim() === "Voz neutral chilena, sin música. Escucha la simulación real."
  );

  if (pilot) {
    pilot.textContent = pilotText;
  }

  if (title && explanation) {
    explanation.textContent = explanationText;
    explanation.dataset.pulssoExplanation = "true";
    explanation.style.whiteSpace = "pre-line";
    title.style.display = "inline-flex";
    title.style.alignItems = "center";

    const repeatedText = [...document.querySelectorAll("div")].find(
      (element) => element.childElementCount === 0 &&
        element.textContent.includes("PULSSO funciona así: guardas tres personas")
    );
    if (repeatedText && repeatedText !== explanation) {
      repeatedText.remove();
    }

    return configureVoiceButton(title) && Boolean(pilot);
  }

  return false;
}

if (!updateExplanation()) {
  const observer = new MutationObserver(() => {
    if (updateExplanation()) {
      observer.disconnect();
    }
  });
  observer.observe(document.getElementById("root"), { childList: true, subtree: true });
}
