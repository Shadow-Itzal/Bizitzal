/*  =========================================================================
//        descripcion_producto.js  —  Código específico de la página de producto
//    ==========================================================================

//    Responsabilidades:
//        - Leer el parámetro ?id= desde la URL
//        - Cargar ../data/kits_bizitzal.json (ruta calculada)
//        - Buscar el producto por ID
//        - Renderizar título, descripción, precio, lista de incluye, carrusel
//        - Cargar proximos_kits.json y relacionados_bizitzal.json
//        - Manejar botón "Agregar al carrito" (usa agregarAlCarrito global)
//        - Mostrar un toast pequeño al agregar (mensaje temporal)
//    ------------------------------------------------------------------------- */

(function () {
    // Detectar base para JSON (si estamos en /pages/ usamos ../data/)
    const base = window.location.pathname.includes("/pages/") ? "../data/" : "./data/";
    const RUTA_KITS = base + "kits_bizitzal.json";
    const RUTA_PROXIMOS = base + "proximos_kits.json";
    const RUTA_RELACIONADOS = base + "relacionados_bizitzal.json";

    // Leer ID desde la URL
    const params = new URLSearchParams(window.location.search);
    const productoID = params.get("id");

    // Elementos clave del DOM (si no existen, no intentar usarlos)
    const tituloEl = document.getElementById("titulo_producto");
    const descripcionEl = document.getElementById("descripcion_producto");
    const precioEl = document.getElementById("precio_producto");
    const listaContenidoEl = document.getElementById("lista_contenido");
    const carruselEl = document.getElementById("imagenes_carrusel");
    const indicadoresEl = document.getElementById("indicadores_carrusel");
    const proximosCont = document.getElementById("proximos_contenedor");
    const relacionadosCont = document.getElementById("relacionados_contenedor");

    // Función principal
    async function init() {
        try {
            const kits = await fetch(RUTA_KITS).then((r) => r.json());

            // Buscar por ID (primero), o fallback: intentar buscar por nombre
            let producto = kits.find((p) => p.id === productoID);

            if (!producto && productoID) {
                // fallback: match por nombre o por slug parcial
                producto = kits.find((k) => {
                    return (
                        (k.nombre && k.nombre.toLowerCase().includes(productoID.toLowerCase())) ||
                        (k.id && k.id.toLowerCase().includes(productoID.toLowerCase()))
                    );
                });
            }

            if (!producto) {
                if (tituloEl) tituloEl.innerText = "Producto no encontrado";
                return;
            }

            // Render básico seguro
            if (tituloEl) tituloEl.innerText = producto.nombre;
            if (descripcionEl)
                descripcionEl.innerText =
                    producto.descripcion_detallada ||
                    producto.descripcion_breve ||
                    "";
            if (precioEl) precioEl.innerText = `$${producto.precio} ARS`;

            // Lista de incluye
            if (listaContenidoEl) {
                listaContenidoEl.innerHTML = "";
                (producto.incluye || []).forEach((i) => {
                    const li = document.createElement("li");
                    li.style.color = "var(--color-mutado)";
                    li.style.marginBottom = "8px";
                    li.innerHTML = `<i class="bi bi-check-circle-fill me-2" style="color: var(--color-acento);"></i> ${i}`;
                    listaContenidoEl.appendChild(li);
                });
            }

            // Carrusel de imágenes (CORREGIDO)
            if (carruselEl && indicadoresEl) {
                carruselEl.innerHTML = "";
                indicadoresEl.innerHTML = "";
                
                (producto.imagenes_banner || []).forEach((url, idx) => {
                    
                    // --- AQUÍ ESTÁ LA CORRECCIÓN DE LA RUTA ---
                    let rutaImagen = url;
                    // Si la ruta empieza con "./", agregamos un punto extra para salir de /pages/
                    if (rutaImagen.startsWith("./")) {
                        rutaImagen = "." + rutaImagen;
                    }
                    // ------------------------------------------

                    const item = document.createElement("div");
                    item.className = "carousel-item" + (idx === 0 ? " active" : "");
                    // Usamos rutaImagen corregida
                    item.innerHTML = `<img src="${rutaImagen}" class="d-block w-100" style="object-fit: cover; max-height: 350px;">`;
                    carruselEl.appendChild(item);

                    /* crear boton indicador (los guines abajo en carrusel) */
                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.setAttribute("data-bs-target", "#carrusel_producto");
                    btn.setAttribute("data-bs-slide-to", `${idx}`);
                    if (idx === 0) btn.className = "active";
                    btn.setAttribute("aria-label", `Slide ${idx + 1}`);
                    indicadoresEl.appendChild(btn);
                });
            }

            // Próximos y relacionados
            cargarProximos();
            cargarRelacionados(producto.id);

            // Hook para el botón agregar al carrito
            const botonAgregar = document.querySelector(".btn_primario");
            if (botonAgregar) {
                // Limpiamos listeners anteriores clonando el botón (truco rápido) o simplemente asignando onclick
                // Para evitar complicaciones, usaremos onclick directo 

                botonAgregar.onclick = () => {
                    const inputCantidad = document.getElementById("cantidad_producto");
                    const cantidad = inputCantidad ? parseInt(inputCantidad.value || "1") : 1;

                    if (typeof window.agregarAlCarrito === "function") {
                        window.agregarAlCarrito(producto.id, cantidad);
                        showToast("¡Producto agregado al carrito!");
                    } else {
                        console.warn("agregarAlCarrito no disponible.");
                    }
                };
            }
        } catch (err) {
            console.error("Error cargando producto:", err);
            if (tituloEl) tituloEl.innerText = "Error al cargar producto";
        } finally {
            // Ocultar loader si existe
            const loader = document.getElementById("loader");
            if (loader) loader.style.display = "none";
        }
    }

    // Cargar proximos (muestra 2)
    async function cargarProximos() {
        if (!proximosCont) return;
        proximosCont.innerHTML = "";
        try {
            const proximos = await fetch(RUTA_PROXIMOS).then((r) => r.json());
            proximos.slice(0, 2).forEach((item) => {
                const card = document.createElement("div");
                card.className = "card mb-3 p-3 border-0";
                card.style.backgroundColor = "var(--color-tarjeta)";
                card.innerHTML = `
                    <img src="${item.imagen_url}" class="card-img-top" alt="${item.nombre}">
                    <div class="card-body p-3">
                        <h6 class="card-title fw-bold" style="color: var(--color-acento);">${item.nombre}</h6>
                    </div>
                `;
                proximosCont.appendChild(card);
            });
        } catch (err) {
            console.error("Error cargando próximos:", err);
        }
    }

    // Cargar relacionados según JSON
    async function cargarRelacionados(idPrincipal) {
        if (!relacionadosCont) return;
        relacionadosCont.innerHTML = "";
        try {
            const relacionados = await fetch(RUTA_RELACIONADOS).then((r) => r.json());
            const grupo = (relacionados.productos || []).find(
                (p) => p.producto_principal_id === idPrincipal
            );
            if (!grupo) return;

            grupo.sugerencias.forEach((item) => {
                
                // --- CORRECCIÓN DE RUTA DE IMAGEN ---
                // Como estamos en /pages/, necesitamos subir un nivel (../)
                // Si la ruta viene limpia del JSON (ej: ./asset/img...), le agregamos el punto extra.
                let rutaImagen = item.imagen_url;
                if (rutaImagen.startsWith("./")) {
                    rutaImagen = "." + rutaImagen; // Se convierte en ../asset/...
                }
                // ------------------------------------

                const card = document.createElement("div");
                card.className = "card mb-3 p-3 border-0";
                card.style.backgroundColor = "var(--color-tarjeta)";
                card.style.cursor = "pointer";
                
                card.onclick = () => {
                    // Navegación relativa simple
                    window.location.href = `./descripcion_producto.html?id=${encodeURIComponent(item.id)}`;
                };

                card.innerHTML = `
                    <img src="${rutaImagen}" class="card-img-top" alt="${item.nombre}">
                    <div class="card-body p-3">
                        <h6 class="card-title fw-bold" style="color: var(--color-acento);">${item.nombre}</h6>
                    </div>
                `;
                relacionadosCont.appendChild(card);
            });
        } catch (err) {
            console.error("Error cargando relacionados:", err);
        }
    }

    // Toast simple (bootstrap toast optional if usas bootstrap)
    function showToast(text) {
        const toastSelector = document.querySelector("#toast_carrito .toast");
        if (toastSelector && typeof bootstrap !== "undefined") {
            const toast = new bootstrap.Toast(toastSelector);
            // actualizar texto si existe
            const body = document.querySelector(
                "#toast_carrito .toast .toast-body"
            );
            if (body) body.textContent = text;
            toast.show();
            return;
        }

        // Fallback: mensaje temporal
        const msg = document.createElement("div");
        msg.textContent = text;
        msg.style.position = "fixed";
        msg.style.right = "16px";
        msg.style.bottom = "16px";
        msg.style.background = "var(--color-acento)";
        msg.style.color = "#042204";
        msg.style.padding = "10px 14px";
        msg.style.borderRadius = "8px";
        msg.style.boxShadow = "0 6px 18px rgba(0,0,0,0.3)";
        msg.style.zIndex = 4000;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 2200);
    }

    // Iniciar
    document.addEventListener("DOMContentLoaded", init);
})();
