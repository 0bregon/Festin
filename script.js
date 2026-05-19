// script.js - SIN IMPORTS, COMPATIBLE CON <script src="...">

// ============================================
// 📱 MENÚ MÓVIL (CÓDIGO ORIGINAL)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const boton = document.querySelector(".menu-toggle");
    const menu = document.querySelector(".menu");
    const menuPanel = document.querySelector(".menu ul");

    if (boton && menu && menuPanel) {
        boton.addEventListener("click", (e) => {
            e.stopPropagation();
            menu.classList.toggle("active");
        });

        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && !boton.contains(e.target)) {
                menu.classList.remove("active");
            }
        });

        let startX = 0;
        menuPanel.addEventListener("touchstart", (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        menuPanel.addEventListener("touchend", (e) => {
            let endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) {
                menu.classList.remove("active");
            }
        }, { passive: true });
    }

    // ============================================
    // 🎠 CARRUSEL (CÓDIGO ORIGINAL)
    // ============================================
    const slides = document.querySelectorAll('.slide');
    const botonAnterior = document.querySelector('.anterior');
    const botonSiguiente = document.querySelector('.siguiente');
    
    if (slides.length && botonAnterior && botonSiguiente) {
        let indiceActual = 0;

        function mostrarImagen(indice) {
            slides.forEach(slide => slide.classList.remove('activa'));
            if (slides[indice]) slides[indice].classList.add('activa');
        }

        botonSiguiente.addEventListener('click', () => {
            indiceActual = (indiceActual + 1) % slides.length;
            mostrarImagen(indiceActual);
        });

        botonAnterior.addEventListener('click', () => {
            indiceActual = (indiceActual - 1 + slides.length) % slides.length;
            mostrarImagen(indiceActual);
        });
    }

    // ============================================
    // 🎪 SERVICIOS (cambiarServicio global)
    // ============================================
    window.cambiarServicio = function(imagen, titulo) {
        const imgEl = document.getElementById("imagen-servicio");
        const titleEl = document.getElementById("titulo-servicio");
        if (imgEl) {
            imgEl.src = imagen;
            imgEl.alt = titulo;
        }
        if (titleEl) {
            titleEl.textContent = titulo;
        }
    }

    // ============================================
    // 🔐 AUTH / LOGIN / REGISTRO (solo si existen elementos)
    // ============================================
    const toggleLink = document.getElementById('toggle-link');
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');
    const panelUsuario = document.getElementById('panel-usuario');

    if (toggleLink && typeof window.iniciarSesion === 'function') {
        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            const irA = toggleLink.dataset.ir;
            const toggleText = document.getElementById('toggle-text');
            if (irA === 'registro') {
                if (formLogin) formLogin.style.display = 'none';
                if (formRegistro) formRegistro.style.display = 'block';
                toggleLink.textContent = 'Iniciar sesión';
                toggleLink.dataset.ir = 'login';
                if (toggleText) toggleText.textContent = '¿Ya tienes cuenta?';
            } else {
                if (formRegistro) formRegistro.style.display = 'none';
                if (formLogin) formLogin.style.display = 'block';
                toggleLink.textContent = 'Crear una cuenta';
                toggleLink.dataset.ir = 'registro';
                if (toggleText) toggleText.textContent = '¿No tienes cuenta?';
            }
        });
    }

    if (formRegistro && typeof window.registrarUsuario === 'function') {
        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();
            const res = window.registrarUsuario(
                document.getElementById('reg-nombre')?.value.trim() || '',
                document.getElementById('reg-email')?.value.trim().toLowerCase() || '',
                document.getElementById('reg-pass')?.value || ''
            );
            alert(res.msg);
            if (res.ok) {
                formRegistro.reset();
                if (toggleLink && toggleLink.dataset.ir === 'login') toggleLink.click();
            }
        });
    }

    if (formLogin && typeof window.iniciarSesion === 'function') {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const res = window.iniciarSesion(
                document.getElementById('login-email')?.value.trim().toLowerCase() || '',
                document.getElementById('login-pass')?.value || ''
            );
            alert(res.msg);
            if (res.ok) {
                formLogin.reset();
                if (panelUsuario && window.obtenerSesion) {
                    const sesion = window.obtenerSesion();
                    if (sesion) {
                        if (formLogin) formLogin.style.display = 'none';
                        if (formRegistro) formRegistro.style.display = 'none';
                        if (toggleLink) toggleLink.style.display = 'none';
                        panelUsuario.style.display = 'block';
                        const nombreEl = document.getElementById('nombre-usuario');
                        const emailEl = document.getElementById('email-usuario');
                        if (nombreEl) nombreEl.textContent = sesion.nombre;
                        if (emailEl) emailEl.textContent = sesion.email;
                    }
                }
            }
        });
    }

    // Cerrar sesión (login o perfil)
    const btnCerrar = document.getElementById('btn-cerrar-sesion');
    if (btnCerrar && typeof window.cerrarSesion === 'function') {
        btnCerrar.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Cerrar sesión?')) window.cerrarSesion();
        });
    }

    // ============================================
    // 👤 PERFIL (solo si es perfil.html)
    // ============================================
    const seccionInvitado = document.getElementById('seccion-invitado');
    const seccionUsuario = document.getElementById('seccion-usuario');
    
    if ((seccionInvitado || seccionUsuario) && typeof window.obtenerSesion === 'function') {
        const sesion = window.obtenerSesion();
        if (sesion) {
            if (seccionInvitado) seccionInvitado.style.display = 'none';
            if (seccionUsuario) seccionUsuario.style.display = 'block';
            
            const nombreEl = document.getElementById('perfil-nombre');
            const nombreCompletoEl = document.getElementById('perfil-nombre-completo');
            const emailEl = document.getElementById('perfil-email');
            
            if (nombreEl) nombreEl.textContent = sesion.nombre.split(' ')[0];
            if (nombreCompletoEl) nombreCompletoEl.textContent = sesion.nombre;
            if (emailEl) emailEl.textContent = sesion.email;
            
            const puntosEl = document.getElementById('perfil-puntos');
            if (puntosEl && !puntosEl.dataset?.loaded) {
                puntosEl.textContent = Math.floor(Math.random() * 300) + 50;
                puntosEl.dataset.loaded = 'true';
            }
        } else {
            if (seccionUsuario) seccionUsuario.style.display = 'none';
            if (seccionInvitado) seccionInvitado.style.display = 'block';
        }
    }

    // ============================================
    // 🎉 RESERVAS (solo si es reserva.html)
    // ============================================
    const formReserva = document.getElementById('form-reserva');
    if (formReserva) {
        const mensajeReserva = document.getElementById('mensaje-reserva');
        const btnEnviar = document.getElementById('btn-enviar-reserva');
        
        // Pre-llenar si hay sesión
        if (typeof window.obtenerSesion === 'function') {
            const sesion = window.obtenerSesion();
            if (sesion) {
                const nombreEl = document.getElementById('reserva-nombre');
                const correoEl = document.getElementById('reserva-correo');
                if (nombreEl && !nombreEl.value) nombreEl.value = sesion.nombre;
                if (correoEl && !correoEl.value) correoEl.value = sesion.email;
            }
        }
        
        // Fecha mínima = hoy
        const fechaEl = document.getElementById('reserva-fecha');
        if (fechaEl && !fechaEl.min) {
            fechaEl.min = new Date().toISOString().split('T')[0];
        }
        
        formReserva.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const servicios = document.querySelectorAll('input[name="servicios[]"]:checked');
            if (servicios.length === 0) {
                alert('⚠️ Selecciona al menos un servicio.');
                return;
            }
            
            if (btnEnviar) {
                btnEnviar.disabled = true;
                btnEnviar.textContent = 'Enviando...';
            }
            
            const sesion = typeof window.obtenerSesion === 'function' ? window.obtenerSesion() : null;
            
            const reserva = {
                id: Date.now(),
                usuario: sesion?.email || 'invitado',
                fechaEnvio: new Date().toISOString(),
                datos: {
                    nombre: document.getElementById('reserva-nombre')?.value.trim() || '',
                    correo: document.getElementById('reserva-correo')?.value.trim().toLowerCase() || '',
                    telefono: document.getElementById('reserva-telefono')?.value.trim() || '',
                    fechaEvento: document.getElementById('reserva-fecha')?.value || '',
                    horaEvento: document.getElementById('reserva-hora')?.value || '',
                    lugar: document.getElementById('reserva-lugar')?.value.trim() || '',
                    tipoEvento: document.getElementById('reserva-tipo')?.value || '',
                    servicios: Array.from(servicios).map(cb => cb.value),
                    personas: document.getElementById('reserva-personas')?.value || '',
                    comentarios: document.getElementById('reserva-comentarios')?.value.trim() || ''
                }
            };
            
            // Guardar en localStorage
            const reservas = JSON.parse(localStorage.getItem('festin_reservas') || '[]');
            reservas.push(reserva);
            localStorage.setItem('festin_reservas', JSON.stringify(reservas));
            
            // Feedback
            if (mensajeReserva) {
                mensajeReserva.style.display = 'block';
                mensajeReserva.scrollIntoView({ behavior: 'smooth' });
            }
            
            formReserva.reset();
            
            setTimeout(() => {
                if (btnEnviar) {
                    btnEnviar.disabled = false;
                    btnEnviar.textContent = 'Enviar reserva';
                }
            }, 3000);
        });
    }
});

// ============================================
// 🎉 RESERVAS - Lógica completa (compatible con tu script.js actual)
// ============================================

function initReservas() {
    const form = document.getElementById('form-reserva');
    if (!form) return; // No es página de reserva

    const mensaje = document.getElementById('reserva-mensaje');
    const btnEnviar = document.getElementById('btn-enviar-reserva');
    const fechaInput = document.getElementById('reserva-fecha');

    // Fecha mínima = hoy
    if (fechaInput && !fechaInput.min) {
        fechaInput.min = new Date().toISOString().split('T')[0];
    }

    // Pre-llenar si hay sesión
    if (typeof window.obtenerSesion === 'function') {
        const sesion = window.obtenerSesion();
        if (sesion) {
            const nombre = document.getElementById('reserva-nombre');
            const correo = document.getElementById('reserva-correo');
            if (nombre && !nombre.value) nombre.value = sesion.nombre;
            if (correo && !correo.value) correo.value = sesion.email;
        }
    }

    // Restaurar datos si viene de error page
    const params = new URLSearchParams(window.location.search);
    if (params.get('restaurar') === '1') {
        const temp = sessionStorage.getItem('festin_reserva_temp');
        if (temp) {
            const datos = JSON.parse(temp);
            document.getElementById('reserva-nombre')?.setValue(datos.nombre);
            document.getElementById('reserva-correo')?.setValue(datos.correo);
            document.getElementById('reserva-fecha')?.setValue(datos.fecha);
            // ... agregar más campos si es necesario
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validar servicios
        const servicios = document.querySelectorAll('input[name="servicios[]"]:checked');
        if (servicios.length === 0) {
            mostrarMensaje('⚠️ Selecciona al menos un servicio.', 'error');
            return;
        }

        // Validar fecha/hora no duplicada
        const fecha = document.getElementById('reserva-fecha').value;
        const hora = document.getElementById('reserva-hora').value;
        const reservas = JSON.parse(localStorage.getItem('festin_reservas') || '[]');
        const conflicto = reservas.find(r => r.datos.fechaEvento === fecha && r.datos.horaEvento === hora);

        if (conflicto) {
            // Guardar datos temporales para restaurar
            sessionStorage.setItem('festin_reserva_temp', JSON.stringify({
                nombre: document.getElementById('reserva-nombre').value,
                correo: document.getElementById('reserva-correo').value,
                fecha: fecha
            }));
            window.location.href = 'reserva-error.html';
            return;
        }

        // Deshabilitar botón
        if (btnEnviar) {
            btnEnviar.disabled = true;
            btnEnviar.textContent = 'Enviando...';
        }

        // Crear reserva
        const sesion = typeof window.obtenerSesion === 'function' ? window.obtenerSesion() : null;
        const nuevaReserva = {
            id: Date.now(),
            usuario: sesion?.email || 'invitado',
            fechaEnvio: new Date().toISOString(),
            estado: 'pendiente',
            datos: {
                nombre: document.getElementById('reserva-nombre').value.trim(),
                correo: document.getElementById('reserva-correo').value.trim().toLowerCase(),
                telefono: document.getElementById('reserva-telefono').value.trim(),
                fechaEvento: document.getElementById('reserva-fecha').value,
                horaEvento: document.getElementById('reserva-hora').value,
                lugar: document.getElementById('reserva-lugar').value.trim(),
                tipoEvento: document.getElementById('reserva-tipo').value,
                servicios: Array.from(servicios).map(cb => cb.value),
                personas: document.getElementById('reserva-personas').value,
                comentarios: document.getElementById('reserva-comentarios').value.trim()
            }
        };

        // Guardar
        reservas.push(nuevaReserva);
        localStorage.setItem('festin_reservas', JSON.stringify(reservas));

        // Éxito
        mostrarMensaje('✅ Reserva enviada. Redirigiendo...', 'success');
        setTimeout(() => {
            window.location.href = 'reserva-exito.html';
        }, 1500);
    });

    function mostrarMensaje(texto, tipo) {
        if (!mensaje) return;
        mensaje.style.display = 'block';
        mensaje.textContent = texto;
        mensaje.style.background = tipo === 'success' ? '#d4edda' : '#f8d7da';
        mensaje.style.borderColor = tipo === 'success' ? '#28a745' : '#dc3545';
        mensaje.style.color = tipo === 'success' ? '#155724' : '#721c24';
        mensaje.style.border = '2px solid';
        mensaje.scrollIntoView({ behavior: 'smooth' });
    }
}

// Iniciar reservas cuando el DOM esté listo (se integra con tu existing DOMContentLoaded)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReservas);
} else {
    initReservas();
}

// ============================================
// 🛒 CARRITO DE COMPRAS - Funcionalidad completa
// ============================================

const CARRITO_KEY = 'festin_carrito';

// 🔹 Funciones globales para usar desde HTML (onclick)
window.agregarAlCarrito = function(id, nombre, precio, imagen, cantidad = 1) {
    const carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');
    const existente = carrito.find(item => item.id === id);
    
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({ id, nombre, precio, imagen, cantidad });
    }
    
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    actualizarContadorCarrito();
    
    // Feedback visual
    alert(`✅ ${nombre} agregado al carrito`);
};

window.eliminarDelCarrito = function(id) {
    let carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContadorCarrito();
};

window.actualizarCantidad = function(id, nuevaCantidad) {
    if (nuevaCantidad < 1) return;
    let carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');
    const item = carrito.find(i => i.id === id);
    if (item) {
        item.cantidad = parseInt(nuevaCantidad);
        localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
        renderizarCarrito();
    }
};

window.vaciarCarrito = function() {
    if (confirm('¿Seguro que deseas vaciar el carrito?')) {
        localStorage.removeItem(CARRITO_KEY);
        renderizarCarrito();
        actualizarContadorCarrito();
    }
};

// 🔹 Renderizar carrito en la página carrito.html
function renderizarCarrito() {
    const listaEl = document.getElementById('lista-carrito');
    const vacioEl = document.getElementById('carrito-vacio');
    const conItemsEl = document.getElementById('carrito-con-items');
    const subtotalEl = document.getElementById('subtotal-carrito');
    const totalEl = document.getElementById('total-carrito');
    
    if (!listaEl) return; // No es página de carrito
    
    const carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');
    
    if (carrito.length === 0) {
        if (vacioEl) vacioEl.style.display = 'block';
        if (conItemsEl) conItemsEl.style.display = 'none';
        return;
    }
    
    if (vacioEl) vacioEl.style.display = 'none';
    if (conItemsEl) conItemsEl.style.display = 'block';
    
    // Generar HTML de cada item
    listaEl.innerHTML = carrito.map(item => {
        const subtotal = item.precio * item.cantidad;
        return `
            <div style="display:flex; gap:15px; padding:15px; background:#fff; border:2px solid #4dd0e1; border-radius:15px; align-items:center;">
                <img src="${item.imagen}" alt="${item.nombre}" style="width:80px; height:80px; object-fit:cover; border-radius:10px;">
                
                <div style="flex:1;">
                    <h4 style="margin:0 0 5px 0; color:#c2185b;">${item.nombre}</h4>
                    <p style="margin:0; color:#666;">$${item.precio.toFixed(2)} c/u</p>
                </div>
                
                <!-- Controles de cantidad -->
                <div style="display:flex; align-items:center; gap:8px;">
                    <button onclick="actualizarCantidad(${item.id}, ${item.cantidad - 1})" 
                            style="width:30px; height:30px; border:2px solid #4dd0e1; background:#fff; border-radius:5px; cursor:pointer; font-weight:bold;">−</button>
                    <span style="min-width:30px; text-align:center; font-weight:500;">${item.cantidad}</span>
                    <button onclick="actualizarCantidad(${item.id}, ${item.cantidad + 1})" 
                            style="width:30px; height:30px; border:2px solid #4dd0e1; background:#fff; border-radius:5px; cursor:pointer; font-weight:bold;">+</button>
                </div>
                
                <!-- Subtotal del item -->
                <div style="text-align:right; min-width:80px;">
                    <strong style="color:#c2185b;">$${subtotal.toFixed(2)}</strong>
                </div>
                
                <!-- Botón eliminar -->
                <button onclick="eliminarDelCarrito(${item.id})" 
                        style="background:#ff6b6b; color:white; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; font-size:18px; line-height:1;">&times;</button>
            </div>
        `;
    }).join('');
    
    // Calcular totales
    const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    const total = subtotal; // Envío gratis para la demo
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// 🔹 Actualizar contador en el header (opcional)
function actualizarContadorCarrito() {
    const contadorEl = document.getElementById('carrito-contador');
    if (!contadorEl) return;
    
    const carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    if (totalItems > 0) {
        contadorEl.style.display = 'flex';
        contadorEl.textContent = totalItems > 9 ? '9+' : totalItems;
    } else {
        contadorEl.style.display = 'none';
    }
}

// 🔹 Proceder a reservar (pasar datos del carrito)
function initProcederReserva() {
    const btn = document.getElementById('btn-proceder');
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        const carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');
        if (carrito.length === 0) {
            alert('Tu carrito está vacío. Agrega productos primero.');
            return;
        }
        
        // Guardar carrito en sessionStorage para usar en reserva.html
        sessionStorage.setItem('festin_carrito_temp', JSON.stringify(carrito));
        
        // Redirigir
        window.location.href = 'reserva.html?desde=carrito';
    });
}

// 🔹 Inicializar carrito al cargar (solo en carrito.html)
function initCarritoPage() {
    if (!document.getElementById('lista-carrito')) return; // No es página de carrito
    
    renderizarCarrito();
    initProcederReserva();
    
    // Botón vaciar
    const btnVaciar = document.getElementById('btn-vaciar-carrito');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => window.vaciarCarrito());
    }
}

// ============================================
// 🔄 INTEGRACIÓN CON TU existing DOMContentLoaded
// ============================================

// Si ya tienes un DOMContentLoaded, agrega esto DENTRO de él:
// initCarritoPage();

// O si prefieres, usa esto para que se ejecute automáticamente:
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initCarritoPage();
        actualizarContadorCarrito(); // Para mostrar contador en todas las páginas
    });
} else {
    initCarritoPage();
    actualizarContadorCarrito();
}