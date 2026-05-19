// auth.js
const DB_KEY = 'festin_db_usuarios';
const SESION_KEY = 'festin_sesion_activa';

function obtenerDB() {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
}

function guardarDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function registrarUsuario(nombre, email, password) {
    const db = obtenerDB();
    if (db.find(u => u.email === email)) {
        return { ok: false, msg: '❌ Este correo ya está registrado.' };
    }
    const nuevo = { id: Date.now(), nombre, email, password, fecha: new Date().toISOString() };
    db.push(nuevo);
    guardarDB(db);
    return { ok: true, msg: '✅ Cuenta creada. ¡Ahora inicia sesión!' };
}

export function iniciarSesion(email, password) {
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

export function cerrarSesion() {
    localStorage.removeItem(SESION_KEY);
    window.location.reload();
}

export function obtenerSesion() {
    const sesion = localStorage.getItem(SESION_KEY);
    return sesion ? JSON.parse(sesion) : null;
}