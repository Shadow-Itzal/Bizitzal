// --- Funciones de Newsletter ---

/* obtiene del HTML el formulario completo por su ID */
const formNewsletter = document.getElementById("form_newsletter");
/* obtiene el campo donde el usuario escribe su correo */
const entradaNewsletter = document.getElementById("entrada_newsletter");
/* obtiene el elemento donde se mostrara el mensaje ("¡Felicidades! o error") */
const mensajeNewsletter = document.getElementById("mensaje_newsletter");

/* Escucha el evento "submit" del formulario (cuando se hace clic en suscribirse) */
formNewsletter.addEventListener("submit", async function (event) {
    /* Evita que el formulario se envie de forma tradicional (para que no recargue la pagina) */
    event.preventDefault();

    /* obtiene el valor del correo ingresado y elimina espacios al inicio o final */
    const email = entradaNewsletter.value.trim();

    /* verifica que el texto contenga un "@" para comprobar que parece un correo valido */
    if (!email.includes("@")) {
        /* si el correo no es valdo, muestra mesaje de error (segundo parametro = true) */
        mostrarMensaje("Por favor, ingresa un correo válido.", true);
        return; /* detiene el codigo aqui */
    }

    /* crea un objeto con todos los datos del formulario (email) */
    const data = new FormData(formNewsletter);

    try {
        /* envia los datos a Formspree usando fech (sin salir del sitio) */
        const response = await fetch(formNewsletter.action, {
            method: formNewsletter.method, /* usa el metodo definido en el <form> (POST) */
            body: data, /* envia los datos del formulario */
            headers: { Accept: "application/json" }, /* pide respuestas en formato json */
        });

        /* si la respuesta del servidor fue exitosa (status 200) */
        if (response.ok) {
            /* muestra mensaje de exito en verde */
            mostrarMensaje("¡Felicidades! Gracias por suscribirte 🎉");
            entradaNewsletter.value = "";
        } else {
            /* si formspree responde con error (por ejemplo, formulario mal configurado) */
            mostrarMensaje("Hubo un error al enviar. Intenta de nuevo.", true);
        }
    } catch (error) {
        /* si hay un problema de conexion o el fetch falla*/
        mostrarMensaje("Error de conexión. Revisa tu internet.", true);
    }
});

/* funcion que muestra un mensaje en pantalla (verde o rojo) */
function mostrarMensaje(texto, esError = false) {
    /* cambia el texto dentro del parrafo donde se muestra mensaje */
    mensajeNewsletter.textContent = texto;
    /* si es error, el color sera rojo, si no sera verde */
    mensajeNewsletter.style.color = esError ? "#ff6b6b" : "var(--color-acento)";
    /* hace visible el mensaje (opacity = 1) */
    mensajeNewsletter.style.opacity = "1";

    // Desaparece suavemente después de 4 segundos, el mensaje lo hace lentamente
    setTimeout(() => {
        mensajeNewsletter.style.opacity = "0";
    }, 4000);
}

/* ----------------- FIN NEWSLETTER  ---------------------- */