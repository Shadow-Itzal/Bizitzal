
//  --- Seccion Heroe --- 

// --- Seccion Heroe --- 

function scrollToKits() {
    const seccionKits = document.getElementById('kits');
    if (seccionKits) {
        seccionKits.scrollIntoView({ behavior: "smooth" });
    }
}

// función compartida para los botones de contacto por WhatsApp (héroe y formulario)
function openWhatsApp(origen) {
    mostrarMensajeContacto(
        "Opción de contacto por WhatsApp: próximamente disponible.",
        false,
        origen
    );
}


















// --- Funciones de Contacto de formulario ---


const formContacto = document.getElementById("formulario_contacto");
const nombreContacto = document.getElementById("entrada_nombre");
const correoContacto = document.getElementById("entrada_correo");
const mensajeContacto = document.getElementById("entrada_mensaje");

// Crear un elemento dinámico para mostrar mensajes (exito/error)
const mensajeEstado = document.createElement("p");
mensajeEstado.id = "mensaje_contacto";
mensajeEstado.style.textAlign = "center";
mensajeEstado.style.marginTop = "10px";
mensajeEstado.style.opacity = "0";
mensajeEstado.style.transition = "opacity 0.8s ease";
formContacto.appendChild(mensajeEstado);

// Escucha el envío del formulario
formContacto.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nombre = nombreContacto.value.trim();
    const correo = correoContacto.value.trim();
    const mensaje = mensajeContacto.value.trim();
    const boton = formContacto.querySelector('button[type="submit"]');

    if (!nombre || !correo.includes("@") || !mensaje) {
        mostrarMensajeContacto("Por favor completa todos los campos correctamente.", true);
        return;
    }

    // 🔄 Mostrar animación de “enviando…”
    boton.disabled = true;
    const textoOriginal = boton.innerHTML;
    boton.innerHTML = `<span class="spinner"></span> Enviando...`;

    const data = new FormData(formContacto);

    try {
        const response = await fetch(formContacto.action, {
            method: formContacto.method,
            body: data,
            headers: { Accept: "application/json" },
        });

        if (response.ok) {
            mostrarMensajeContacto("✅ ¡Gracias por contactarnos! Te responderemos pronto.");
            formContacto.reset();
        } else {
            const errorData = await response.json();
            console.error("Error de Formspree:", errorData);
            mostrarMensajeContacto("❌ Error al enviar: " + (errorData.error || "Intenta nuevamente."), true);
        }
    } catch (error) {
        mostrarMensajeContacto("⚠️ Error de conexión. Revisa tu internet.", true);
    } finally {
        // 🔁 Restaurar botón original
        boton.disabled = false;
        boton.innerHTML = textoOriginal;
    }
});


// Función para mostrar mensaje
// function mostrarMensajeContacto(texto, esError = false) {
//    mensajeEstado.textContent = texto;
//    mensajeEstado.style.color = esError ? "#ff6b6b" : "var(--color-acento)";
//    mensajeEstado.style.opacity = "1";
//
//    setTimeout(() => {
//        mensajeEstado.style.opacity = "0";
//    }, 4000);
//} 

/* // cuando aprieta boton whatsapp y da el mensaje
function openWhatsApp() {
    mostrarMensajeContacto("💬 Opción de contacto por WhatsApp: próximamente disponible.");
} */

/* function mostrarMensajeContacto(texto, esError = false) {
    mensajeEstado.textContent = texto;
    mensajeEstado.style.color = esError ? "#ff6b6b" : "var(--color-acento)";
    
    // Aplica la clase para la animación visual
    mensajeEstado.classList.add("mostrar");

    // Asegura que se vea
    mensajeEstado.style.opacity = "1";

    // Desaparece suavemente después de 4 segundos
    setTimeout(() => {
        mensajeEstado.classList.remove("mostrar");
        mensajeEstado.style.opacity = "0";
    }, 4000);
} */


function mostrarMensajeContacto(texto, esError = false, origen = null) {
    // Crear el mensaje dinámico
    const mensaje = document.createElement("p");
    /* mensaje.textContent = texto; */
mensaje.innerHTML = `<span class="icono_mensaje">💬</span> ${texto.replace("💬", "").trim()}`;

    mensaje.className = "mensaje_contacto";
    mensaje.style.color = esError ? "#ff6b6b" : "var(--color-acento)";
    
    // Insertar debajo del botón presionado
    if (origen) {
        origen.insertAdjacentElement("afterend", mensaje);
    } else {
        // Si no hay origen, como respaldo se agrega al formulario
        formContacto.appendChild(mensaje);
    }

    // Mostrar animación
    setTimeout(() => mensaje.classList.add("visible"), 50);

    // Eliminar después de unos segundos
    setTimeout(() => {
        mensaje.classList.remove("visible");
        setTimeout(() => mensaje.remove(), 800);
    }, 4000);
}












// ---   FIN DE CONTACTO (formulario) ---






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