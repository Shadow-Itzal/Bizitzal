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

/* =========================================================================
//        SCRIPT.JS  —  Lógica Global (Header, Carrito Global, Utilidades)
//    ========================================================================== */

/* 1. CONFIGURACIÓN DE RUTAS
    Detecta si estamos en una subcarpeta (/pages/) para arreglar rutas relativas.
*/
function dataBasePath() {
    return window.location.pathname.includes("/pages/") ? "../data/" : "./data/";
}

/* 2. NAVEGACIÓN (heroe)
    Scroll suave a la sección de kits desde el Hero.
*/
function scrollToKits() {
    const seccionKits = document.getElementById("kits");
    if (seccionKits) seccionKits.scrollIntoView({ behavior: "smooth" });
}


/* 3. VER PRODUCTO (Redirección Inteligente)
   Toma el ID de la tarjeta HTML y redirige a descripcion_producto.html
   sin importar si estamos en el index o en otra página.
*/
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
        "Contacto por WhatsApp: próximamente disponible.",
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
    - Usa Formspree (en action); valida y muestra feedback
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

        const nombre = nombreContacto.value.trim(); // siempre va a estar
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
                    "❌ Hubo un error al enviar. Intenta de nuevo.",
                    true
                );
            }
        } catch (error) {
            mostrarMensaje("⚠️ Error de conexión. Revisa tu internet.", true);
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


/* 4. NOTIFICACIONES (Toast Premium)
   Crea una notificación flotante elegante cuando se agrega algo al carrito.
*/
function showMiniToast(texto) {
    // Evitar acumulación de toasts
    const existente = document.querySelector('.toast-premium');
    if (existente) existente.remove();

    const msg = document.createElement("div");
    msg.className = "toast-premium"; // Usa la clase CSS nueva
    msg.innerHTML = `<span>🛒</span> ${texto}`; 
    
    document.body.appendChild(msg);

    // Pequeño delay para permitir que la animación CSS ocurra
    setTimeout(() => msg.classList.add("mostrar"), 10);

    // Desaparecer después de 2.5 segundos
    setTimeout(() => {
        msg.classList.remove("mostrar");
        setTimeout(() => msg.remove(), 400); // Esperar a que termine la animación de salida
    }, 2500);
}
// Exponemos globalmente
window.showMiniToast = showMiniToast;


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

// funcion principal para agregar items
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

/* funcion puente para los botones del HTML (data-id) */

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






document.addEventListener("DOMContentLoaded", () => {
    // Buscar el botón del carrito
    const botonCarrito = document.getElementById("boton_carrito");

    if (botonCarrito) {
        botonCarrito.addEventListener("click", () => {
            // Detectar si estamos dentro de la carpeta /pages/
            const estoyEnPages = window.location.pathname.includes("/pages/");
            
            // Si estamos en pages, el carrito está al lado ("./carrito.html")
            // Si estamos en inicio, hay que entrar a pages ("./pages/carrito.html")
            const rutaCarrito = estoyEnPages ? "./carrito.html" : "./pages/carrito.html";

            // Navegar
            window.location.href = rutaCarrito;
        });
    }
    
    // Asegurarnos de actualizar el número al cargar la página
    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    }
});



/* =========================================
   SISTEMA DE MODALES LEGALES
   ========================================= */

const overlay = document.getElementById("modal_overlay");

// Abrir un modal específico por su ID
function abrirModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal && overlay) {
        // Quitamos la clase 'hidden' para asegurar que existan en el DOM
        overlay.classList.remove("hidden"); 
        modal.classList.remove("hidden");
        
        // Pequeño delay para permitir que la animación CSS (opacity/transform) funcione
        setTimeout(() => {
            overlay.classList.add("activo");
            modal.classList.add("activo");
        }, 10);
    }
}

// Cerrar un modal específico
function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal && overlay) {
        modal.classList.remove("activo");
        overlay.classList.remove("activo");

        // Esperar a que termine la animación (0.3s) antes de ocultar con display:none
        setTimeout(() => {
            modal.classList.add("hidden");
            overlay.classList.add("hidden");
        }, 300);
    }
}

// Cerrar cualquier modal abierto (al hacer click afuera)
function cerrarTodosModales() {
    const modales = document.querySelectorAll(".modal-legal.activo");
    modales.forEach(m => {
        m.classList.remove("activo");
        setTimeout(() => m.classList.add("hidden"), 300);
    });
    
    if (overlay) {
        overlay.classList.remove("activo");
        setTimeout(() => overlay.classList.add("hidden"), 300);
    }
}

// Exponer funciones al HTML
window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;
window.cerrarTodosModales = cerrarTodosModales;


