// script.js - VERSIÓN SUPABASE (TODO INTEGRADO) CON VALIDACIÓN DE RESERVAS

document.addEventListener('DOMContentLoaded', async () => {
    
    console.log('🚀 DOMContentLoaded ejecutándose');
    
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

    console.log('🔍 Verificando elementos de autenticación...');
    console.log('🔍 formLogin:', formLogin);
    console.log('🔍 formRegistro:', formRegistro);
    console.log('🔍 registrarUsuario:', typeof window.registrarUsuario);
    console.log('🔍 iniciarSesion:', typeof window.iniciarSesion);
    console.log('🔍 supabase:', typeof supabase);

    // REGISTRO
    if (formRegistro && typeof window.registrarUsuario === 'function') {
        console.log('✅ Event listener de REGISTRO registrado correctamente');
        
        formRegistro.addEventListener('submit', async (e) => {
            console.log('🚀 Formulario de REGISTRO enviado, interceptando...');
            e.preventDefault();
            
            const nombre = document.getElementById('reg-nombre')?.value.trim() || '';
            const email = document.getElementById('reg-email')?.value.trim().toLowerCase() || '';
            const password = document.getElementById('reg-pass')?.value || '';
            const confirmar = document.getElementById('reg-confirmar')?.value || '';
            
            console.log('📝 Datos del formulario:', { nombre, email, password: '***', confirmar: '***' });
            
            if (password !== confirmar) {
                alert('❌ Las contraseñas no coinciden');
                return;
            }
            
            if (password.length < 6) {
                alert('❌ La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            console.log('🔄 Llamando a registrarUsuario...');
            
            const res = await window.registrarUsuario(nombre, email, password);
            
            console.log('📬 Respuesta de registrarUsuario:', res);
            
            alert(res.msg);
            
            if (res.ok) {
                formRegistro.reset();
                window.location.href = 'login.html';
            }
        });
    } else {
        console.warn('⚠️ NO se pudo registrar el event listener de REGISTRO');
        console.warn('⚠️ formRegistro:', formRegistro);
        console.warn('⚠️ typeof window.registrarUsuario:', typeof window.registrarUsuario);
    }

    // LOGIN
    if (formLogin && typeof window.iniciarSesion === 'function') {
        console.log('✅ Event listener de LOGIN registrado correctamente');
        
        formLogin.addEventListener('submit', async (e) => {
            console.log('🚀 Formulario de LOGIN enviado, interceptando...');
            e.preventDefault();
            
            const email = document.getElementById('login-email')?.value.trim().toLowerCase() || '';
            const password = document.getElementById('login-pass')?.value || '';
            
            console.log('📝 Datos del login:', { email, password: '***' });
            
            console.log('🔄 Llamando a iniciarSesion...');
            
            const res = await window.iniciarSesion(email, password);
            
            console.log('📬 Respuesta de iniciarSesion:', res);
            
            alert(res.msg);
            
            if (res.ok) {
                formLogin.reset();
                
                if (panelUsuario) {
                    formLogin.style.display = 'none';
                    panelUsuario.style.display = 'block';
                    const nombreEl = document.getElementById('nombre-usuario');
                    const emailEl = document.getElementById('email-usuario');
                    if (nombreEl) nombreEl.textContent = res.usuario?.nombre || email.split('@')[0];
                    if (emailEl) emailEl.textContent = res.usuario?.email || email;
                } else {
                    window.location.href = 'perfil-usuario.html';
                }
            }
        });
    } else {
        console.warn('⚠️ NO se pudo registrar el event listener de LOGIN');
        console.warn('⚠️ formLogin:', formLogin);
        console.warn('⚠️ typeof window.iniciarSesion:', typeof window.iniciarSesion);
    }

    // CERRAR SESIÓN
    const btnCerrar = document.getElementById('btn-cerrar-sesion');
    if (btnCerrar && typeof window.cerrarSesion === 'function') {
        btnCerrar.addEventListener('click', async (e) => {
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
    // 🎉 RESERVAS (CON VALIDACIÓN DE DISPONIBILIDAD Y STOCK)
    // ============================================
    const formReserva = document.getElementById('form-reserva');
    
    if (formReserva) {
        console.log('✅ Formulario de reserva encontrado - Validaciones activas');
        
        const mensajeReserva = document.getElementById('reserva-mensaje');
        const btnEnviar = document.getElementById('btn-enviar-reserva');
        const fechaEl = document.getElementById('reserva-fecha');
        const horaEl = document.getElementById('reserva-hora');
        const duracionEl = document.getElementById('reserva-duracion');
        
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
        
        // Cargar carrito si viene de carrito.html
        const carritoTemp = sessionStorage.getItem('festin_carrito_temp');
        let productosCarrito = [];
        let paquetesCarrito = [];
        let serviciosCarrito = [];
        
        if (carritoTemp) {
            const carrito = JSON.parse(carritoTemp);
            console.log('🛒 Carrito cargado desde sessionStorage:', carrito);
            
            // Separar productos, servicios y paquetes por ID
            carrito.forEach(item => {
                if (item.id >= 100 && item.id < 150) {
                    // IDs 100-149 son servicios
                    serviciosCarrito.push({
                        producto_id: item.id,
                        nombre: item.nombre,
                        cantidad: item.cantidad,
                        precio: item.precio
                    });
                } else if (item.id >= 150 && item.id < 200) {
                    // IDs 150-199 son paquetes (ajusta según tus IDs reales)
                    paquetesCarrito.push({
                        producto_id: item.id,
                        nombre: item.nombre,
                        cantidad: item.cantidad,
                        precio: item.precio
                    });
                } else {
                    // IDs menores son productos
                    productosCarrito.push({
                        producto_id: item.id,
                        nombre: item.nombre,
                        cantidad: item.cantidad,
                        precio: item.precio
                    });
                }
            });
            
            console.log('📦 Productos:', productosCarrito);
            console.log('🎁 Paquetes:', paquetesCarrito);
            console.log('🎭 Servicios:', serviciosCarrito);
        }
        
        // Función para calcular total
        function calcularTotal() {
            const totalProductos = productosCarrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
            const totalPaquetes = paquetesCarrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
            const totalServicios = serviciosCarrito.reduce((sum, s) => sum + (s.precio * s.cantidad), 0);
            
            // Servicios seleccionados del formulario (checkboxes)
            const serviciosForm = Array.from(document.querySelectorAll('input[name="servicios[]"]:checked'))
                .map(cb => parseFloat(cb.dataset.precio || 0));
            const totalServiciosForm = serviciosForm.reduce((sum, p) => sum + p, 0);
            
            return totalProductos + totalPaquetes + totalServicios + totalServiciosForm;
        }
        
        // Mostrar resumen del carrito si existe
        if (carritoTemp && document.getElementById('resumen-carrito')) {
            const resumenEl = document.getElementById('resumen-carrito');
            const total = calcularTotal();
            resumenEl.innerHTML = `
                <h4>🛒 Resumen de tu carrito</h4>
                ${productosCarrito.length > 0 ? `<p><strong>Productos:</strong> ${productosCarrito.map(p => `${p.cantidad}x ${p.nombre}`).join(', ')}</p>` : ''}
                ${paquetesCarrito.length > 0 ? `<p><strong>Paquetes:</strong> ${paquetesCarrito.map(p => `${p.cantidad}x ${p.nombre}`).join(', ')}</p>` : ''}
                ${serviciosCarrito.length > 0 ? `<p><strong>Servicios:</strong> ${serviciosCarrito.map(s => `${s.cantidad}x ${s.nombre}`).join(', ')}</p>` : ''}
                <p><strong>Total estimado:</strong> B/.${total.toFixed(2)}</p>
            `;
        }
        
        formReserva.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            console.log('🚀 Iniciando validación de reserva...');
            
            // ===== VALIDACIONES BÁSICAS =====
            const fechaEvento = document.getElementById('reserva-fecha')?.value;
            const horaEvento = document.getElementById('reserva-hora')?.value;
            const duracionHoras = parseInt(document.getElementById('reserva-duracion')?.value) || 4;
            
            if (!fechaEvento || !horaEvento) {
                mostrarMensaje('⚠️ Debes seleccionar fecha y hora del evento.', 'error');
                return;
            }
            
            // Verificar que haya algo que reservar
            const serviciosSeleccionados = document.querySelectorAll('input[name="servicios[]"]:checked');
            const tieneAlgo = productosCarrito.length > 0 || 
                             paquetesCarrito.length > 0 || 
                             serviciosCarrito.length > 0 || 
                             serviciosSeleccionados.length > 0;
            
            if (!tieneAlgo) {
                mostrarMensaje('⚠️ Debes seleccionar al menos un producto, servicio o paquete.', 'error');
                return;
            }
            
            if (btnEnviar) {
                btnEnviar.disabled = true;
                btnEnviar.textContent = 'Validando disponibilidad...';
            }
            
            // ===== VALIDACIÓN 1: DISPONIBILIDAD DE HORARIO =====
            console.log('🔍 Validando disponibilidad de horario...');
            const validacionHorario = await verificarDisponibilidad(fechaEvento, horaEvento, duracionHoras);
            
            if (!validacionHorario.disponible) {
                console.warn('❌ Horario no disponible:', validacionHorario.mensaje);
                mostrarMensaje(validacionHorario.mensaje, 'error');
                if (btnEnviar) {
                    btnEnviar.disabled = false;
                    btnEnviar.textContent = 'Enviar reserva';
                }
                return;
            }
            
            console.log('✅ Horario disponible');
            
            // ===== VALIDACIÓN 2: STOCK DE PRODUCTOS =====
            let estadoFinal = 'pendiente'; // Por defecto
            let mensajeStock = '';
            
            if (productosCarrito.length > 0) {
                console.log('🔍 Validando stock de productos...');
                const validacionStock = await verificarStock(productosCarrito, fechaEvento);
                
                if (!validacionStock.hayStock) {
                    console.warn('❌ Stock insuficiente:', validacionStock.mensaje);
                    estadoFinal = 'pendiente_stock';
                    mensajeStock = validacionStock.mensaje;
                } else {
                    console.log('✅ Stock de productos disponible');
                }
            }
            
            // ===== VALIDACIÓN 3: STOCK DE PAQUETES =====
            if (paquetesCarrito.length > 0 && estadoFinal !== 'pendiente_stock') {
                console.log('🔍 Validando stock de paquetes...');
                
                for (const paquete of paquetesCarrito) {
                    const validacionPaquete = await verificarStockPaquete(
                        paquete.producto_id, 
                        paquete.cantidad, 
                        fechaEvento
                    );
                    
                    if (!validacionPaquete.hayStock) {
                        console.warn(`❌ Stock insuficiente para paquete ${paquete.nombre}:`, validacionPaquete.mensaje);
                        estadoFinal = 'pendiente_stock';
                        mensajeStock += `\n\n${paquete.nombre}: ${validacionPaquete.mensaje}`;
                        break;
                    }
                }
                
                if (estadoFinal !== 'pendiente_stock') {
                    console.log('✅ Stock de paquetes disponible');
                }
            }
            
            // ===== CREAR LA RESERVA =====
            console.log('📝 Creando reserva...');
            
            const sesion = typeof window.obtenerSesion === 'function' ? await window.obtenerSesion() : null;
            
            const nuevaReserva = {
                usuario_id: sesion?.id || null,
                nombre_cliente: document.getElementById('reserva-nombre')?.value.trim() || '',
                email: document.getElementById('reserva-correo')?.value.trim().toLowerCase() || '',
                celular: document.getElementById('reserva-telefono')?.value.trim() || '',
                fecha_evento: fechaEvento,
                hora_evento: horaEvento,
                duracion_horas: duracionHoras,
                lugar: document.getElementById('reserva-lugar')?.value.trim() || '',
                tipo_evento: document.getElementById('reserva-tipo')?.value || '',
                servicios: serviciosSeleccionados.length > 0 
                    ? Array.from(serviciosSeleccionados).map(cb => cb.value) 
                    : (serviciosCarrito.length > 0 ? serviciosCarrito.map(s => s.nombre) : []),
                personas: parseInt(document.getElementById('reserva-personas')?.value) || 0,
                comentarios: document.getElementById('reserva-comentarios')?.value.trim() || '',
                productos: productosCarrito.length > 0 ? productosCarrito : null,
                paquetes: paquetesCarrito.length > 0 ? paquetesCarrito : null,
                total: calcularTotal(),
                estado: estadoFinal
            };
            
            console.log('📦 Datos de la reserva:', nuevaReserva);
            
            const { data, error } = await supabase
                .from('reservas')
                .insert([nuevaReserva])
                .select();
            
            if (error) {
                console.error('❌ Error guardando reserva:', error);
                mostrarMensaje('❌ Error al guardar la reserva: ' + error.message, 'error');
                if (btnEnviar) {
                    btnEnviar.disabled = false;
                    btnEnviar.textContent = 'Enviar reserva';
                }
                return;
            }
            
            console.log('✅ Reserva guardada exitosamente:', data);
            
            // Limpiar carrito de sessionStorage
            if (carritoTemp) {
                sessionStorage.removeItem('festin_carrito_temp');
                localStorage.removeItem('festin_carrito');
                console.log('🧹 Carrito limpiado');
            }
            
            // Mensaje final según el estado
            if (estadoFinal === 'pendiente_stock') {
                mostrarMensaje(
                    `⚠️ Reserva recibida pero en estado PENDIENTE por falta de stock:\n${mensajeStock}\n\nNos pondremos en contacto contigo para ofrecerte alternativas.`,
                    'warning'
                );
            } else {
                mostrarMensaje('✅ Reserva enviada correctamente. Redirigiendo...', 'success');
            }
            
            setTimeout(() => {
                window.location.href = 'reserva-exito.html';
            }, 3000);
        });
        
        function mostrarMensaje(texto, tipo) {
            if (!mensajeReserva) {
                alert(texto);
                return;
            }
            mensajeReserva.style.display = 'block';
            mensajeReserva.textContent = texto;
            mensajeReserva.style.whiteSpace = 'pre-line'; // Para saltos de línea
            
            const colores = {
                'success': { bg: '#d4edda', border: '#28a745', color: '#155724' },
                'error': { bg: '#f8d7da', border: '#dc3545', color: '#721c24' },
                'warning': { bg: '#fff3cd', border: '#ffc107', color: '#856404' }
            };
            
            const c = colores[tipo] || colores.error;
            mensajeReserva.style.background = c.bg;
            mensajeReserva.style.borderColor = c.border;
            mensajeReserva.style.color = c.color;
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
                        <p>B/.${item.precio.toFixed(2)} c/u</p>
                    </div>
                    <div class="carrito-cantidad">
                        <button onclick="actualizarCantidad(${item.id}, ${item.cantidad - 1})">−</button>
                        <span>${item.cantidad}</span>
                        <button onclick="actualizarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                    </div>
                    <div class="carrito-item-subtotal">
                        <strong>B/.${subtotal.toFixed(2)}</strong>
                    </div>
                    <button class="carrito-item-eliminar" onclick="eliminarDelCarrito(${item.id})">×</button>
                </div>
            `;
        }).join('');
        
        const subtotal = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        
        if (subtotalEl) subtotalEl.textContent = `B/.${subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `B/.${subtotal.toFixed(2)}`;
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

    const btnVaciar = document.getElementById('btn-vaciar-carrito');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => window.vaciarCarrito());
    }

    if (document.getElementById('lista-carrito')) {
        renderizarCarrito();
    }

    actualizarContadorCarrito();
    
    console.log('✅ DOMContentLoaded completado');
});