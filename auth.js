// auth.js - VERSIÓN SUPABASE (FUNCIONES GLOBALES)
// Ya no usa localStorage, ahora usa Supabase Auth

// 🔹 REGISTRO (global) - AHORA ES ASYNC
window.registrarUsuario = async function(nombre, email, password) {
    try {
        // 1. Crear usuario en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    nombre: nombre
                }
            }
        });

        if (error) {
            if (error.message.includes('already registered')) {
                return { ok: false, msg: '❌ Este correo ya está registrado.' };
            }
            return { ok: false, msg: '❌ ' + error.message };
        }

        // 2. Guardar perfil en la tabla 'usuarios'
        if (data.user) {
            const { error: errorPerfil } = await supabase
                .from('usuarios')
                .insert([
                    { 
                        id: data.user.id, 
                        nombre: nombre, 
                        email: email,
                        puntos: 0
                    }
                ]);

            if (errorPerfil) {
                console.error('Error guardando perfil:', errorPerfil);
            }
        }

        return { ok: true, msg: '✅ Cuenta creada. ¡Ahora inicia sesión!' };

    } catch (err) {
        console.error('Error:', err);
        return { ok: false, msg: '❌ Error al registrar' };
    }
}

// 🔹 LOGIN (global) - AHORA ES ASYNC
window.iniciarSesion = async function(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            return { ok: false, msg: '❌ Correo o contraseña incorrectos.' };
        }

        // Obtener datos del usuario desde la tabla
        const { data: userData } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', data.user.id)
            .single();

        return { 
            ok: true, 
            msg: `👋 ¡Bienvenido, ${userData?.nombre || email.split('@')[0]}!`,
            usuario: userData || { id: data.user.id, email: email }
        };

    } catch (err) {
        console.error('Error:', err);
        return { ok: false, msg: '❌ Error al iniciar sesión' };
    }
}

// 🔹 CERRAR SESIÓN (global) - AHORA ES ASYNC
window.cerrarSesion = async function() {
    try {
        await supabase.auth.signOut();
        window.location.href = 'index.html';
    } catch (err) {
        console.error('Error:', err);
        alert('❌ Error al cerrar sesión');
    }
}

// 🔹 OBTENER SESIÓN (global) - AHORA ES ASYNC
window.obtenerSesion = async function() {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) return null;

        // Obtener datos completos del usuario
        const { data: userData } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
            .single();

        return userData || {
            id: session.user.id,
            email: session.user.email,
            nombre: session.user.user_metadata?.nombre || 'Usuario'
        };
    } catch (err) {
        console.error('Error:', err);
        return null;
    }
}