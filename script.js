// script.js - VERSIÓN SUPABASE (TODO INTEGRADO)

document.addEventListener('DOMContentLoaded', async () => {
    
    // ============================================
    // 📱 MENÚ MÓVIL
    // ============================================
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
    // 🎠 CARRUSEL
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
    // 🎪 SERVICIOS
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
    // 🔐 AUTH / LOGIN / REGISTRO (AHORA CON SUPABASE)
    // ============================================
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');
    const panelUsuario = document.getElementById('panel-usuario');

    // REGISTRO
    if (formRegistro && typeof window.registrarUsuario === 'function') {
        formRegistro.addEventListener('submit', async (e) => {  // ← async
            e.preventDefault();
            
            const nombre = document.getElementById('reg-nombre')?.value.trim() || '';
            const email = document.getElementById('reg-email')?.value.trim().toLowerCase() || '';
            const password = document.getElementById('reg-pass')?.value || '';
            const confirmar = document.getElementById('reg-confirmar')?.value || '';
            
            if (password !== confirmar) {
                alert('❌ Las contraseñas no coinciden');
                return;
            }
            
            if (password.length < 6) {
                alert('❌ La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            // ← await aquí
            const res = await window.registrarUsuario(nombre, email, password);
            alert(res.msg);
            
            if (res.ok) {
                formRegistro.reset();
                window.location.href = 'login.html';
            }
        });
    }

    // LOGIN
    if (formLogin && typeof window.iniciarSesion === 'function') {
        formLogin.addEventListener('submit', async (e) => {  // ← async
            e.preventDefault();
            
            const email = document.getElementById('login-email')?.value.trim().toLowerCase() || '';
            const password = document.getElementById('login-pass')?.value || '';
            
            // ← await aquí
            const res = await window.iniciarSesion(email, password);
            alert(res.msg);
            
            if (res.ok) {
                formLogin.reset();
                
                // Si estamos en login.html y hay panel de usuario
                if (panelUsuario) {
                    formLogin.style.display = 'none';
                    panelUsuario.style.display = 'block';
                    const nombreEl = document.getElementById('nombre-usuario');
                    const emailEl = document.getElementById('email-usuario');
                    if (nombreEl) nombreEl.textContent = res.usuario?.nombre || email.split('@')[0];
                    if (emailEl) emailEl.textContent = res.usuario?.email || email;
                } else {
                    // Redirigir al perfil
                    window.location.href = 'perfil-usuario.html';
                }
            }
        });
    }

    // CERRAR SESIÓN
    const btnCerrar = document.getElementById('btn-cerrar-sesion');
    if (btnCerrar && typeof window.cerrarSesion === 'function') {
        btnCerrar.addEventListener('click', async (e) => {  // ← async
            e.preventDefault();
            if (confirm('¿Cerrar sesión?')) {
                await window.cerrarSesion();
            }
        });
    }

    // ============================================
    // 👤 PERFIL (VERIFICAR SESIÓN CON SUPABASE)
    // ============================================
    const seccionInvitado = document.getElementById('seccion-invitado');
    const seccionUsuario = document.getElementById('seccion-usuario');
    
    if ((seccionInvitado || seccionUsuario) && typeof window.obtenerSesion === 'function') {
        // ← await aquí porque ahora es async
        const sesion = await window.obtenerSesion();
        
        if (sesion) {
            if (seccionInvitado) seccionInvitado.style.display = 'none';
            if (seccionUsuario) seccionUsuario.style.display = 'block';
            
            const nombreEl = document.getElementById('perfil-nombre');
            const nombreCompletoEl = document.getElementById('perfil-nombre-completo');
            const emailEl = document.getElementById('perfil-email');
            const puntosEl = document.getElementById('perfil-puntos');
            
            if (nombreEl) nombreEl.textContent = (sesion.nombre || 'Usuario').split(' ')[0];
            if (nombreCompletoEl) nombreCompletoEl.textContent = sesion.nombre || 'Usuario';
            if (emailEl) emailEl.textContent = sesion.email || '';
            if (puntosEl) puntosEl.textContent = sesion.puntos || 0;
        } else {
            if (seccionUsuario) seccionUsuario.style.display = 'none';
            if (seccionInvitado) seccionInvitado.style.display = 'block';
        }
    }

    // ============================================
    // 🎉 RESERVAS (AHORA CON SUPABASE)
    // ============================================
    const formReserva = document.getElementById('form-reserva');
    
    if (formReserva) {
        const mensajeReserva = document.getElementById('reserva-mensaje');
        const btnEnviar = document.getElementById('btn-enviar-reserva');
        const fechaEl = document.getElementById('reserva-fecha');
        
        // Fecha mínima = hoy
        if (fechaEl && !fechaEl.min) {
            fechaEl.min = new Date().toISOString().split('T')[0];
        }
        
        // Pre-llenar si hay sesión
        if (typeof window.obtenerSesion === 'function') {
            const sesion = await window.obtenerSesion();
            if (sesion) {
                const nombreInput = document.getElementById('reserva-nombre');
                const correoInput = document.getElementById('reserva-correo');
                if (nombreInput && !nombreInput.value) nombreInput.value = sesion.nombre || '';
                if (correoInput && !correoInput.value) correoInput.value = sesion.email || '';
            }
        }
        
        formReserva.addEventListener('submit', async (e) => {  // ← async
            e.preventDefault();
            
            const servicios = document.querySelectorAll('input[name="servicios[]"]:checked');
            if (servicios.length === 0) {
                mostrarMensaje('⚠️ Selecciona al menos un servicio.', 'error');
                return;
            }
            
            if (btnEnviar) {
                btnEnviar.disabled = true;
                btnEnviar.textContent = 'Enviando...';
            }
            
            const sesion = typeof window.obtenerSesion === 'function' ? await window.obtenerSesion() : null;
            
            const nuevaReserva = {
                usuario_id: sesion?.id || null,
                nombre_cliente: document.getElementById('reserva-nombre')?.value.trim() || '',
                email: document.getElementById('reserva-correo')?.value.trim().toLowerCase() || '',
                telefono: document.getElementById('reserva-telefono')?.value.trim() || '',
                fecha_evento: document.getElementById('reserva-fecha')?.value || '',
                hora_evento: document.getElementById('reserva-hora')?.value || '',
                lugar: document.getElementById('reserva-lugar')?.value.trim() || '',
                tipo_evento: document.getElementById('reserva-tipo')?.value || '',
                servicios: Array.from(servicios).map(cb => cb.value),
                personas: parseInt(document.getElementById('reserva-personas')?.value) || 0,
                comentarios: document.getElementById('reserva-comentarios')?.value.trim() || '',
                estado: 'pendiente'
            };
            
            // ← GUARDAR EN SUPABASE
            const { data, error } = await supabase
                .from('reservas')
                .insert([nuevaReserva])
                .select();
            
            if (error) {
                console.error('Error guardando reserva:', error);
                mostrarMensaje('❌ Error al guardar la reserva: ' + error.message, 'error');
                if (btnEnviar) {
                    btnEnviar.disabled = false;
                    btnEnviar.textContent = 'Enviar reserva';
                }
                return;
            }
            
            // Éxito
            mostrarMensaje('✅ Reserva enviada. Redirigiendo...', 'success');
            
            setTimeout(() => {
                window.location.href = 'reserva-exito.html';
            }, 1500);
        });
        
        function mostrarMensaje(texto, tipo) {
            if (!mensajeReserva) return;
            mensajeReserva.style.display = 'block';
            mensajeReserva.textContent = texto;
            mensajeReserva.style.background = tipo === 'success' ? '#d4edda' : '#f8d7da';
            mensajeReserva.style.borderColor = tipo === 'success' ? '#28a745' : '#dc3545';
            mensajeReserva.style.color = tipo === 'success' ? '#155724' : '#721c24';
            mensajeReserva.style.border = '2px solid';
            mensajeReserva.style.padding = '15px';
            mensajeReserva.style.borderRadius = '10px';
            mensajeReserva.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // ============================================
    // 🛒 CARRITO (SE MANTIENE EN LOCALSTORAGE)
    // ============================================
    const CARRITO_KEY = 'festin_carrito';

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

    function renderizarCarrito() {
        const listaEl = document.getElementById('lista-carrito');
        const vacioEl = document.getElementById('carrito-vacio');
        const conItemsEl = document.getElementById('carrito-con-items');
        const subtotalEl = document.getElementById('subtotal-carrito');
        const totalEl = document.getElementById('total-carrito');
        
        if (!listaEl) return;
        
        const carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');
        
        if (carrito.length === 0) {
            if (vacioEl) vacioEl.style.display = 'block';
            if (conItemsEl) conItemsEl.style.display = 'none';
            return;
        }
        
        if (vacioEl) vacioEl.style.display = 'none';
        if (conItemsEl) conItemsEl.style.display = 'block';
        
        listaEl.innerHTML = carrito.map(item => {
            const subtotal = item.precio * item.cantidad;
            return `
                <div class="carrito-item">
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <div class="carrito-item-info">
                        <h4>${item.nombre}</h4>
                        <p>$${item.precio.toFixed(2)} c/u</p>
                    </div>
                    <div class="carrito-cantidad">
                        <button onclick="actualizarCantidad(${item.id}, ${item.cantidad - 1})">−</button>
                        <span>${item.cantidad}</span>
                        <button onclick="actualizarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                    </div>
                    <div class="carrito-item-subtotal">
                        <strong>$${subtotal.toFixed(2)}</strong>
                    </div>
                    <button class="carrito-item-eliminar" onclick="eliminarDelCarrito(${item.id})">×</button>
                </div>
            `;
        }).join('');
        
        const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        
        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
    }

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

    // Botón proceder a reservar
    const btnProceder = document.getElementById('btn-proceder');
    if (btnProceder) {
        btnProceder.addEventListener('click', () => {
            const carrito = JSON.parse(localStorage.getItem(CARRITO_KEY) || '[]');
            if (carrito.length === 0) {
                alert('Tu carrito está vacío. Agrega productos primero.');
                return;
            }
            sessionStorage.setItem('festin_carrito_temp', JSON.stringify(carrito));
            window.location.href = 'reserva.html?desde=carrito';
        });
    }

    // Botón vaciar carrito
    const btnVaciar = document.getElementById('btn-vaciar-carrito');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => window.vaciarCarrito());
    }

    // Inicializar carrito si estamos en carrito.html
    if (document.getElementById('lista-carrito')) {
        renderizarCarrito();
    }

    // Actualizar contador en todas las páginas
    actualizarContadorCarrito();
});