const databaseURL = "https://landing-42c92-default-rtdb.firebaseio.com/.json";
const getData = async () => {
  try {
    // Realiza la solicitud GET al servidor
    const response = await fetch(databaseURL, { method: "GET" });

    if (!response.ok) {
      throw new Error("Error al obtener los datos.");
    }

    const data = await response.json();

    if (data) {
      const countSubscribers = new Map();

      for (const key in data) {
        const { email, saved } = data[key];
        const date = saved.split(",")[0];

        const count = countSubscribers.get(date) || 0;
        countSubscribers.set(date, count + 1);
      }

      if (countSubscribers.size > 0) {
        const subscribersTable = document.getElementById("subscribers");
        subscribersTable.innerHTML = ""; // Limpia la tabla

        let index = 1;
        for (const [date, count] of countSubscribers) {
          const rowTemplate = `
              <tr>
                <th>${index}</th>
                <td>${date}</td>
                <td>${count}</td>
              </tr>`;
          subscribersTable.innerHTML += rowTemplate;
          index++;
        }
      }
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    alert(
      "Hemos experimentado un error al obtener los datos. ¡Intenta de nuevo!"
    );
  }
};
const sendData = (form) => {
  // Obtén los datos del formulario
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries()); // Convierte FormData a un objeto
  data["saved"] = new Date().toLocaleString("es-CO", {
    timeZone: "America/Guayaquil",
  });

  // Envía los datos al servidor
  fetch(databaseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
      return response.json();
    })
    .then((result) => {
      console.log("Datos enviados correctamente:", result);
      alert(
        "Gracias por registrarte. Nos mantenemos enfocados en atenderte como mereces."
      );
      form.reset(); // Limpia el formulario
      getData(); // Actualiza los datos mostrados
    })
    .catch((error) => {
      console.error("Error al enviar los datos:", error);
      alert(
        "Hemos experimentado un error al enviar tus datos. ¡Intenta de nuevo!"
      );
    });
};

const loaded = () => {
  const myform = document.getElementById("form");
  const emailElement = document.getElementById("correo");

  myform.addEventListener("submit", (event) => {
    event.preventDefault(); // Evita el comportamiento por defecto

    const emailText = emailElement.value;

    if (emailText.trim() === "") {
      emailElement.focus();
      emailElement.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(50px)" },
          { transform: "translateX(-50px)" },
          { transform: "translateX(0)" },
        ],
        { duration: 400, easing: "linear" }
      );
      return;
    }

    sendData(myform); // Envía los datos
  });

  getData(); // Obtiene los datos al cargar la página
};

window.addEventListener("DOMContentLoaded", loaded);
