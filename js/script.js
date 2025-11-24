/*  =========================================================================
//        script.js  —  Código global para todo el sitio (header, forms, carrito)
//    ========================================================================== */

/*    Qué contiene (solo responsabilidades globales):
        - scrollToKits() (hero)
        - viewProduct()  -> redirige a la página de producto con el ID correcto
        - openWhatsApp() + mostrarMensajeContacto() (feedback visual)
        - Newsletter (form_newsletter) handling
        - Contact form handling (formulario_contacto)
        - Loader (hide si existe)
        - Sistema global de carrito:
            obtenerCarrito(), guardarCarrito(), agregarAlCarrito(), actualizarContadorCarrito()
        - Funciones auxiliares para rutas relativas (detecta si estamos en /pages/)
    
    ------------------------------------------------------------------------- 
*/

/*  -------------------------  
        UTIL: calcular base para rutas de /data/ (compatible con /pages/)
    ------------------------- */
function dataBasePath() {
    // Si la ruta contiene /pages/ asumimos que estamos en una subcarpeta y necesitamos ../data/
    return window.location.pathname.includes("/pages/")
        ? "../data/"
        : "./data/";
}

/*  -------------------------
        HERO
    ------------------------- */
function scrollToKits() {
    const seccionKits = document.getElementById("kits");
    if (seccionKits) seccionKits.scrollIntoView({ behavior: "smooth" });
}

/*  -------------------------
        VIEW PRODUCT
    - Busca en kits_bizitzal.json por el atributo data-name de la tarjeta
    - Redirige a descripcion_producto.html?id=<ID del JSON>
    ------------------------- */

/* Reemplaza la función viewProduct antigua por esta: */

function viewProduct(btnOrEl) {
    // 1. Encontrar la tarjeta padre
    const tarjeta = btnOrEl.closest("article");
    
    if (!tarjeta) {
        console.warn("No se encontró la tarjeta.");
        return;
    }

    // 2. Obtener el ID directamente del HTML (data-id)
    const idProducto = tarjeta.dataset.id;
    
    if (!idProducto) {
        console.error("La tarjeta no tiene un data-id.");
        return;
    }

    // 3. Definir la ruta correcta dependiendo de dónde estemos
    const estoyEnPages = window.location.pathname.includes("/pages/");
    const baseRoute = estoyEnPages ? "./descripcion_producto.html" : "./pages/descripcion_producto.html";

    // 4. Redirigir CON el ID
    window.location.href = `${baseRoute}?id=${encodeURIComponent(idProducto)}`;
}

// Exponer globalmente para que los onclick inline funcionen
window.viewProduct = viewProduct;

/*  -------------------------
        WHATSAPP / MENSAJES DE CONTACTO (pequeño toast visual)
    ------------------------- */
function openWhatsApp(origen) {
    mostrarMensajeContacto(
        "Opción de contacto por WhatsApp: próximamente disponible.",
        false,
        origen
    );
}

/*
    * mostrarMensajeContacto(texto, esError=false, origenElement=null)
    * - Crea un mensaje temporal (párrafo) bajo el elemento "origen" o en el formulario.
*/
function mostrarMensajeContacto(texto, esError = false, origen = null) {
    const mensaje = document.createElement("p");
    mensaje.innerHTML = `<span class="icono_mensaje">💬</span> ${texto
        .replace("💬", "")
        .trim()}`;
    mensaje.className = "mensaje_contacto";
    mensaje.style.color = esError ? "#ff6b6b" : "var(--color-acento)";

    if (origen && origen.insertAdjacentElement) {
        origen.insertAdjacentElement("afterend", mensaje);
    } else {
        const form = document.getElementById("formulario_contacto");
        if (form) form.appendChild(mensaje);
        else document.body.appendChild(mensaje);
    }

    // Animación y destrucción
    setTimeout(() => mensaje.classList.add("visible"), 50);
    setTimeout(() => {
        mensaje.classList.remove("visible");
        setTimeout(() => mensaje.remove(), 800);
    }, 4000);
}

/*  -------------------------
        FORMULARIO DE CONTACTO (index & página de producto)
    - Usa Formspree (tu action); valida y muestra feedback
    ------------------------- */
(function initContactoForm() {
    const form = document.getElementById("formulario_contacto");
    if (!form) return;

    const nombreContacto = document.getElementById("entrada_nombre");
    const correoContacto = document.getElementById("entrada_correo");
    const mensajeContacto = document.getElementById("entrada_mensaje");

    // Mensaje dinámico
    const mensajeEstado = document.createElement("p");
    mensajeEstado.id = "mensaje_contacto";
    mensajeEstado.style.textAlign = "center";
    mensajeEstado.style.marginTop = "10px";
    mensajeEstado.style.opacity = "0";
    mensajeEstado.style.transition = "opacity 0.8s ease";
    form.appendChild(mensajeEstado);

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nombre = nombreContacto.value.trim();
        const correo = correoContacto.value.trim();
        const mensaje = mensajeContacto.value.trim();
        const boton = form.querySelector('button[type="submit"]');

        if (!nombre || !correo.includes("@") || !mensaje) {
            mostrarMensajeContacto(
                "Por favor completa todos los campos correctamente.",
                true,
                form
            );
            return;
        }

        boton.disabled = true;
        const textoOriginal = boton.innerHTML;
        boton.innerHTML = `<span class="spinner"></span> Enviando...`;

        const data = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { Accept: "application/json" },
            });

            if (response.ok) {
                mostrarMensajeContacto(
                    "✅ ¡Gracias por contactarnos! Te responderemos pronto."
                );
                form.reset();
            } else {
                const errorData = await response.json();
                console.error("Error Formspree:", errorData);
                mostrarMensajeContacto(
                    "❌ Error al enviar: intenta nuevamente.",
                    true,
                    form
                );
            }
        } catch (error) {
            console.error("Contacto fetch error:", error);
            mostrarMensajeContacto(
                "⚠️ Error de conexión. Revisa tu internet.",
                true,
                form
            );
        } finally {
            boton.disabled = false;
            boton.innerHTML = textoOriginal;
        }
    });
})();

/*  -------------------------
        NEWSLETTER (form_newsletter)
    ------------------------- */
(function initNewsletter() {
    const form = document.getElementById("form_newsletter");
    if (!form) return;

    const entradaNewsletter = document.getElementById("entrada_newsletter");
    const mensajeNewsletter = document.getElementById("mensaje_newsletter");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = entradaNewsletter.value.trim();
        if (!email.includes("@")) {
            mostrarMensaje("Por favor, ingresa un correo válido.", true);
            return;
        }

        const data = new FormData(form);

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { Accept: "application/json" },
            });

            if (response.ok) {
                mostrarMensaje("¡Felicidades! Gracias por suscribirte 🎉");
                entradaNewsletter.value = "";
            } else {
                mostrarMensaje(
                    "Hubo un error al enviar. Intenta de nuevo.",
                    true
                );
            }
        } catch (error) {
            mostrarMensaje("Error de conexión. Revisa tu internet.", true);
        }
    });

    function mostrarMensaje(texto, esError = false) {
        if (!mensajeNewsletter) return;
        mensajeNewsletter.textContent = texto;
        mensajeNewsletter.style.color = esError
            ? "#ff6b6b"
            : "var(--color-acento)";
        mensajeNewsletter.style.opacity = "1";
        setTimeout(() => {
            mensajeNewsletter.style.opacity = "0";
        }, 4000);
    }
})();

/*  -------------------------
        LOADER (ocultar si existe)
    ------------------------- */
(function hideLoaderIfExists() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
})();

/*  -------------------------
        SISTEMA GLOBAL DE CARRITO
    - Estas funciones son simples y globales para que otros scripts las usen
    ------------------------- */
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carritoBizitzal")) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem("carritoBizitzal", JSON.stringify(carrito));
}

function agregarAlCarrito(id, cantidad = 1) {
    let carrito = obtenerCarrito();
    const existente = carrito.find((p) => p.id === id);
    if (existente) {
        existente.cantidad = (existente.cantidad || 0) + cantidad;
    } else {
        carrito.push({ id, cantidad });
    }
    guardarCarrito(carrito);
    actualizarContadorCarrito();
}

// Actualiza el contador visual (el badge del header)
function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const total = carrito.reduce((acc, p) => acc + (p.cantidad || 0), 0);
    const contador = document.getElementById("contador_carrito");
    if (contador) contador.textContent = total;
}


/* ----------------------------------------------
    addToCartFromBtn(elemento)
    - Se usa en las tarjetas del index.html
    - Obtiene el ID desde el <article class="tarjeta">
    - Llama a agregarAlCarrito()
---------------------------------------------- */
function addToCartFromBtn(btn) {
    try {
        // Encontrar tarjeta padre
        const card = btn.closest("article");
        if (!card) {
            console.warn("No se encontró la tarjeta del producto.");
            return;
        }

        // ID del producto
        const id = card.dataset.id;
        if (!id) {
            console.warn("La tarjeta no tiene data-id.");
            return;
        }

        // Agregar al carrito
        agregarAlCarrito(id, 1);

        // Mostrar mensaje temporal
        showMiniToast("Producto agregado al carrito 🛒✨");

    } catch (err) {
        console.error("addToCartFromBtn error:", err);
    }
}

/* ----------------------------------------------
    Pequeño toast visual (fallback simple)
---------------------------------------------- */
function showMiniToast(texto) {
    const msg = document.createElement("div");
    msg.textContent = texto;
    msg.style.position = "fixed";
    msg.style.bottom = "20px";
    msg.style.right = "20px";
    msg.style.background = "var(--color-acento)";
    msg.style.color = "#042204";
    msg.style.padding = "10px 14px";
    msg.style.borderRadius = "10px";
    msg.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
    msg.style.zIndex = "9999";
    msg.style.opacity = "0";
    msg.style.transition = "opacity .3s";

    document.body.appendChild(msg);

    setTimeout(() => msg.style.opacity = "1", 30);
    setTimeout(() => {
        msg.style.opacity = "0";
        setTimeout(() => msg.remove(), 300);
    }, 1800);
}

// Exponer globalmente
window.addToCartFromBtn = addToCartFromBtn;








// Exponer funciones globales que podrían usarse inline
window.agregarAlCarrito = agregarAlCarrito;

// Inicializar contador en carga
document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);
