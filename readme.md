<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:32cd32,100:006400&height=200&section=header&text=⚡💻Front-End%20JS%202025%20💻⚡&fontSize=40&fontColor=ffffff&animation=fadeIn" alt="banner" />
</p>

---

# 💻 Proyecto Final 🎓✨

# 🌿 Bizitzal – Kits Creativos & DIY

**Bizitzal** es un e-commerce conceptual que celebra la creatividad y el trabajo manual 🌸✨.  
Este proyecto ha evolucionado de una vitrina estática a una **aplicación web dinámica**, ofreciendo una experiencia de usuario fluida, moderna y funcional.

El sitio permite a los usuarios explorar **kits artesanales**, ver detalles dinámicos de cada producto y gestionar un **carrito de compras** funcional, todo construido con tecnologías web estándar y buenas prácticas de desarrollo.
 
---

## ✨ Características Principales

El proyecto incorpora lógica de programación para brindar interactividad real:

* 🛒 **Sistema de Carrito de Compras:** Gestión de estado global mediante `localStorage`. Permite agregar, eliminar y modificar cantidades de productos persistiendo la información entre recargas.
* 📄 **Carga Dinámica de Datos:** Los productos y sus detalles se renderizan consumiendo archivos **JSON** (simulando una API), evitando el contenido *hardcodeado* en las páginas de detalle.
* 📱 **Diseño Responsive & UI Moderna:**
    * Menú hamburguesa con animación SVG personalizada.
    * Notificaciones tipo *Toast* para feedback visual al usuario.
    * Modales interactivos para información legal.
    * Efectos de *Fade-in* y Loader de carga.
* 🔗 **Navegación Inteligente:** Detección de rutas relativas para gestionar la navegación entre el `index` y las sub-páginas (`/pages/`).

---

## 🧭 Estructura del repositorio

El proyecto mantiene una arquitectura organizada separando estructura, estilos y lógica:

```text
Bizitzal/
│
├── asset/
│   └── img/           # Recursos gráficos (logos, productos, banners)
│
├── css/
│   └── styles.css     # Hoja de estilos global (Variables CSS, Flexbox, Grid)
│
├── data/              # Simulación de Base de Datos
│   ├── kits_bizitzal.json
│   ├── proximos_kits.json
│   └── relacionados_bizitzal.json
│
├── js/                # Lógica del Frontend
│   ├── script.js              # Lógica global (Nav, Modales, Toast, Utils)
│   ├── carrito.js             # Lógica específica de la página del carrito
│   └── descripcion_producto.js # Lógica de renderizado de producto (URL params)
│
├── pages/             # Páginas internas
│   ├── carrito.html
│   └── descripcion_producto.html
│
├── index.html         # Landing Page principal
├── favicon.ico
├── README.md
└── .gitignore
```

---

## 💻 Tecnologías utilizadas

El proyecto está construido utilizando estándares modernos de desarrollo web:

| Tecnología | Uso en el proyecto |
|------------|--------------|
| 🧱 HTML5	| Estructura semántica y accesible.
| 🎨 CSS3	| Diseño visual, animaciones, CSS Variables, Flexbox y Grid Layout.
| ⚡ JavaScript (ES6+)	| Lógica de negocio, manipulación del DOM, Async/Await para fetch de datos y manejo de localStorage.
| 🅱️ Bootstrap 5	| Utilizado puntualmente en páginas internas (producto y carrito) para acelerar el maquetado de componentes complejos (Carruseles, Cards).
| 📄 JSON	| Almacenamiento de datos estructurados para productos y relaciones.


---

## 🚀 Cómo visualizar el proyecto

Para asegurar el correcto funcionamiento de las peticiones fetch a los archivos JSON, es necesario ejecutar el proyecto en un servidor local.

1. **Clonar el repositorio:**

   ```bash
    git clone [https://github.com/Shadow-Itzal/Bizitzal.git](https://github.com/Shadow-Itzal/Bizitzal.git)
    cd Bizitzal
    ```

2. **Ejecutar:**

* Si usas VS Code, instala la extensión Live Server.

* Haz clic derecho en index.html y selecciona "Open with Live Server".

---

## 🌱 Próximos Pasos
Aunque el sitio ya es funcional, el camino de Bizitzal continúa:

* 💳 Pasarela de Pagos: Integración real con APIs de pago (Stripe/MercadoPago).

* 🔐 Backend: Migración de archivos JSON a una base de datos real (Node.js/MongoDB o Firebase).

* 🔎 Filtros Avanzados: Buscador y filtrado por categorías en tiempo real.

* 📧 Automatización: Conexión del newsletter con servicios de email marketing.

---

## 🪶 Créditos

- Diseño y Desarrollo: [Shadow-Itzal](https://github.com/Shadow-Itzal)  
- Concepto: Inspirado en la belleza de crear algo propio desde cero. 🌸

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:32cd32,100:006400&height=160&section=footer&desc=Semicolons%20are%20life;%20missing%20semicolons%20are%20pain.%20😅&fontSize=40" />
</p>

<p align="center">
  <span style="color:#555555; font-size:14px; font-style:italic;">
    *Los punto y coma son vida; los punto y coma que faltan son dolor*
  </span>
</p>