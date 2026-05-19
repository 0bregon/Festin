// auth.js - SIN EXPORTS, FUNCIONES GLOBALES
const DB_KEY = 'festin_db_usuarios';
const SESION_KEY = 'festin_sesion_activa';

function obtenerDB() {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
}

function guardarDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// 🔹 REGISTRO (global)
window.registrarUsuario = function(nombre, email, password) {
    const db = obtenerDB();
    if (db.find(u => u.email === email)) {
        return { ok: false, msg: '❌ Este correo ya está registrado.' };
    }
    const nuevo = { id: Date.now(), nombre, email, password, fecha: new Date().toISOString() };
    db.push(nuevo);
    guardarDB(db);
    return { ok: true, msg: '✅ Cuenta creada. ¡Ahora inicia sesión!' };
}

// 🔹 LOGIN (global)
window.iniciarSesion = function(email, password) {
    const db = obtenerDB();
    const usuario = db.find(u => u.email === email && u.password === password);
    if (!usuario) return { ok: false, msg: '❌ Correo o contraseña incorrectos.' };
    
    localStorage.setItem(SESION_KEY, JSON.stringify({
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
    }));
    return { ok: true, msg: `👋 ¡Bienvenido, ${usuario.nombre}!` };
}

// 🔹 CERRAR SESIÓN (global)
window.cerrarSesion = function() {
    localStorage.removeItem(SESION_KEY);
    window.location.reload();
}

// 🔹 OBTENER SESIÓN (global)
window.obtenerSesion = function() {
    const sesion = localStorage.getItem(SESION_KEY);
    return sesion ? JSON.parse(sesion) : null;
}