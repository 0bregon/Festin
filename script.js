// ============================================
// IMPORTS (SIEMPRE AL INICIO EN MÓDULOS)
// ============================================
import { registrarUsuario, iniciarSesion, cerrarSesion, obtenerSesion } from './auth.js';

// ============================================
// MENÚ MÓVIL (SIN CAMBIOS - CÓDIGO ORIGINAL)
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
    });
    menuPanel.addEventListener("touchend", (e) => {
        let endX = e.changedTouches[0].clientX;
        if (startX - endX > 50) {
            menu.classList.remove("active");
        }
    });
}

// ============================================
// CARRUSEL (SIN CAMBIOS - CÓDIGO ORIGINAL)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const botonAnterior = document.querySelector('.anterior');
    const botonSiguiente = document.querySelector('.siguiente');
    
    // Si no hay carrusel en esta página, salimos
    if (!slides.length || !botonAnterior || !botonSiguiente) return;
    
    let indiceActual = 0;

    function mostrarImagen(indice) {
        slides.forEach(slide => slide.classList.remove('activa'));
        slides[indice].classList.add('activa');
    }

    botonSiguiente.addEventListener('click', () => {
        indiceActual = (indiceActual + 1) % slides.length;
        mostrarImagen(indiceActual);
    });

    botonAnterior.addEventListener('click', () => {
        indiceActual = (indiceActual - 1 + slides.length) % slides.length;
        mostrarImagen(indiceActual);
    });
});

// ============================================
// SERVICIOS - cambiarServicio (SIN CAMBIOS)
// ============================================
function cambiarServicio(imagen, titulo) {
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
// 👤 USUARIO / SESIÓN / PERFIL (CORREGIDO)
// ============================================

// Elementos de Login/Registro (SignIn.html / SignUp.html)
const toggleLink = document.getElementById('toggle-link');
const toggleText = document.getElementById('toggle-text');
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');
const panelUsuario = document.getElementById('panel-usuario');

// Elementos de Perfil (perfil.html)
const seccionInvitado = document.getElementById('seccion-invitado');
const seccionUsuario = document.getElementById('seccion-usuario');
const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');

// 🔹 Toggle Login/Registro
if (toggleLink) {
    toggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        const irA = toggleLink.dataset.ir;
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

// 🔹 Manejar Registro
if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();
        const res = registrarUsuario(
            document.getElementById('reg-nombre').value.trim(),
            document.getElementById('reg-email').value.trim().toLowerCase(),
            document.getElementById('reg-pass').value
        );
        alert(res.msg);
        if (res.ok) {
            formRegistro.reset();
            if (toggleLink && toggleLink.dataset.ir === 'login') toggleLink.click();
        }
    });
}

// 🔹 Manejar Login
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const res = iniciarSesion(
            document.getElementById('login-email').value.trim().toLowerCase(),
            document.getElementById('login-pass').value
        );
        alert(res.msg);
        if (res.ok) {
            formLogin.reset();
            actualizarInterfazLogin();
        }
    });
}

// 🔹 Cerrar sesión (funciona en login Y perfil)
if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('¿Cerrar sesión?')) {
            cerrarSesion();
        }
    });
}

// 🔹 Actualizar interfaz en página de LOGIN
function actualizarInterfazLogin() {
    if (!formLogin && !formRegistro && !panelUsuario) return; // No es página de login
    
    const sesion = obtenerSesion();
    if (sesion && panelUsuario) {
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

// 🔹 Cargar perfil en página de PERFIL
function cargarPerfil() {
    if (!seccionInvitado && !seccionUsuario) return; // No es página de perfil
    
    const sesion = obtenerSesion();
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
        if (puntosEl && !puntosEl.dataset.loaded) {
            puntosEl.textContent = Math.floor(Math.random() * 300) + 50;
            puntosEl.dataset.loaded = 'true';
        }
    } else {
        if (seccionUsuario) seccionUsuario.style.display = 'none';
        if (seccionInvitado) seccionInvitado.style.display = 'block';
    }
}

// 🔹 Ejecutar al cargar (una sola vez, seguro)
document.addEventListener('DOMContentLoaded', () => {
    actualizarInterfazLogin();
    cargarPerfil();
});

// Hacer cerrarSesion accesible globalmente por si se usa en HTML
window.cerrarSesion = cerrarSesion;