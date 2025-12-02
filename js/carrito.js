/*  =========================================================================
//        carrito.js  —  Sistema del carrito (solo para carrito.html)
//    ==========================================================================

//    Responsabilidades:
//        - Cargar carrito desde localStorage
//        - Mostrar productos (con datos desde kits_bizitzal.json)
//        - Aumentar / disminuir cantidades
//        - Eliminar producto
//        - Calcular total y actualizar contador global (usa actualizarContadorCarrito del script global)
//    ------------------------------------------------------------------------- */

(function () {
    // Determina la ruta correcta a data (carrito.html está en /pages/, por lo general)
    const base = window.location.pathname.includes("/pages/")
        ? "../data/"
        : "./data/";
    const RUTA_KITS = base + "kits_bizitzal.json";

    // UTIL: funciones locales que reutilizan las globales en script.js
    function obtenerCarritoLocal() {
        return JSON.parse(localStorage.getItem("carritoBizitzal")) || [];
    }
    function guardarCarritoLocal(carrito) {
        localStorage.setItem("carritoBizitzal", JSON.stringify(carrito));
    }

    // DOM
    const contenedor = document.getElementById("carrito_contenido");
    const totalSpan = document.getElementById("carrito_total");
    const btnCheckout = document.getElementById("btn_checkout");

    // Render principal
    async function mostrarCarrito() {
        if (!contenedor || !totalSpan) return;

        const carrito = obtenerCarritoLocal();
        const kits = await fetch(RUTA_KITS).then((r) => r.json());

        contenedor.innerHTML = "";

        if (!carrito.length) {
            contenedor.innerHTML = `
                <div class="text-center py-5">
                    <h4>Tu carrito está vacío 🛒</h4>
                    <a href="../index.html" class="btn_primario mt-3">Volver a la tienda</a>
                </div>
            `;
            totalSpan.textContent = "0";
            if (typeof window.actualizarContadorCarrito === "function")
                window.actualizarContadorCarrito();
            return;
        }

        let totalGeneral = 0;

        carrito.forEach((item) => {
            // buscar producto en JSON por id
            const producto = kits.find((k) => k.id === item.id);

            // Si no existe producto en JSON (data inconsistente), lo omitimos
            if (!producto) return;

            // --- INICIO CORRECCIÓN DE IMAGEN ---
            let rutaImagen = producto.imagenes_banner[0] || "../asset/img/placeholder.jpg";
            
            // Si la ruta viene del JSON como "./asset/...", le quitamos el punto 
            // y le agregamos "../" para salir de la carpeta pages.
            if (rutaImagen.startsWith("./")) {
                rutaImagen = "." + rutaImagen; // Convierte ./asset en ../asset
            }
            // --- FIN CORRECCIÓN ---

            const subtotal = producto.precio * item.cantidad;
            totalGeneral += subtotal;

            // Card HTML
            const card = document.createElement("div");
            card.className = "card mb-3 p-3 shadow-sm";
            card.innerHTML = `
                <div class="row g-3 align-items-center">
                    <div class="col-md-2">
                        <img src="${rutaImagen}" class="img-fluid rounded" style="max-height: 80px; object-fit: cover;">
                    </div>
                    <div class="col-md-4">
                        <h5 class="mb-1">${producto.nombre}</h5>
                        <p class="text-muted small mb-0">${producto.categoria} - ${producto.nivel}</p>
                    </div>
                    <div class="col-md-3">
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary" data-action="dec" data-id="${item.id}">-</button>
                            <span class="mx-3 fw-bold">${item.cantidad}</span>
                            <button class="btn btn-sm btn-outline-secondary" data-action="inc" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 text-end">
                        <strong>$${subtotal}</strong>
                    </div>
                    <div class="col-md-1 text-end">
                        <button class="btn btn-danger btn-sm" data-action="remove" data-id="${item.id}">X</button>
                    </div>
                </div>
            `;
            contenedor.appendChild(card);
        });

        totalSpan.textContent = totalGeneral;
        // actualizar contador global si está disponible
        if (typeof window.actualizarContadorCarrito === "function")
            window.actualizarContadorCarrito();
    }

    // Cambiar cantidad (inc/dec)
    function cambiarCantidad(id, cambio) {
        let carrito = obtenerCarritoLocal();
        const item = carrito.find((p) => p.id === id);
        if (!item) return;

        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            carrito = carrito.filter((p) => p.id !== id);
        }
        guardarCarritoLocal(carrito);
        mostrarCarrito();
    }

    // Eliminar producto
    function eliminarProducto(id) {
        let carrito = obtenerCarritoLocal();
        carrito = carrito.filter((p) => p.id !== id);
        guardarCarritoLocal(carrito);
        mostrarCarrito();
    }

    // Delegación de eventos para botones de +/-/X
    function delegarClicks(event) {
        const btn = event.target.closest("button");
        if (!btn) return;
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        if (!action || !id) return;

        if (action === "inc") cambiarCantidad(id, 1);
        if (action === "dec") cambiarCantidad(id, -1);
        if (action === "remove") eliminarProducto(id);
    }

    // Checkout simulado
    function checkoutSimulado() {
        alert("¡Gracias por tu compra! 🧡 (Simulación)");
        // Vaciar carrito 
        guardarCarritoLocal([]);
        mostrarCarrito();
    }

    // Inicializar
    document.addEventListener("DOMContentLoaded", () => {
        // Mostrar inicialmente
        mostrarCarrito();

        // Delegación
        if (contenedor) contenedor.addEventListener("click", delegarClicks);

        // Checkout
        if (btnCheckout)
            btnCheckout.addEventListener("click", checkoutSimulado);
    });
})();
