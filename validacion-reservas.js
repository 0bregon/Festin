// validacion-reservas.js - Sistema de evaluación de reservas

/**
 * Verifica si hay disponibilidad para una nueva reserva
 * @param {string} fechaEvento - Fecha del evento (YYYY-MM-DD)
 * @param {string} horaInicio - Hora de inicio (HH:MM)
 * @param {number} duracionHoras - Duración en horas
 * @returns {Promise<Object>} - { disponible: boolean, mensaje: string, reservasExistentes: array }
 */
async function verificarDisponibilidad(fechaEvento, horaInicio, duracionHoras) {
    try {
        // 1. Calcular hora de fin
        const horaInicioMinutos = convertirAHoraMinutos(horaInicio);
        const horaFinMinutos = horaInicioMinutos + (duracionHoras * 60);
        const horaFin = convertirMinutosAHora(horaFinMinutos);

        // 2. Validar horario (7 AM a 3 AM = 7:00 a 27:00)
        if (horaInicioMinutos < 420) { // Antes de 7 AM
            return {
                disponible: false,
                mensaje: '❌ El horario mínimo es 7:00 AM',
                reservasExistentes: []
            };
        }
        if (horaFinMinutos > 1620) { // Después de 3 AM (27:00)
            return {
                disponible: false,
                mensaje: '❌ El evento no puede terminar después de las 3:00 AM',
                reservasExistentes: []
            };
        }

        // 3. Consultar reservas existentes para esa fecha
        const { data: reservasExistentes, error } = await supabase
            .from('reservas')
            .select('*')
            .eq('fecha_evento', fechaEvento)
            .in('estado', ['pendiente', 'confirmada']); // Solo contar activas

        if (error) {
            console.error('Error consultando reservas:', error);
            return {
                disponible: false,
                mensaje: '❌ Error al verificar disponibilidad',
                reservasExistentes: []
            };
        }

        // 4. Verificar límite de 2 eventos por día
        if (reservasExistentes.length >= 2) {
            return {
                disponible: false,
                mensaje: '❌ Ya hay 2 eventos programados para esa fecha. No podemos aceptar más.',
                reservasExistentes: reservasExistentes
            };
        }

        // 5. Verificar choques de horario con eventos existentes
        for (const reserva of reservasExistentes) {
            const reservaInicioMinutos = convertirAHoraMinutos(reserva.hora_evento);
            
            // Asumimos duración de 4 horas si no está especificada
            const reservaDuracion = reserva.duracion_horas || 4;
            const reservaFinMinutos = reservaInicioMinutos + (reservaDuracion * 60);

            // Verificar si hay choque
            if (hayChoque(horaInicioMinutos, horaFinMinutos, reservaInicioMinutos, reservaFinMinutos)) {
                return {
                    disponible: false,
                    mensaje: `❌ Hay un choque de horario con otro evento ese día. 
                    Por favor elige otra hora o fecha.`,
                    reservasExistentes: reservasExistentes
                };
            }
        }

        // 6. Todo OK
        return {
            disponible: true,
            mensaje: '✅ Horario disponible',
            reservasExistentes: reservasExistentes
        };

    } catch (err) {
        console.error('Error en verificarDisponibilidad:', err);
        return {
            disponible: false,
            mensaje: '❌ Error al verificar disponibilidad',
            reservasExistentes: []
        };
    }
}

/**
 * Verifica si hay stock suficiente para los productos solicitados
 * @param {Array} productos - Array de {producto_id, cantidad}
 * @param {string} fechaEvento - Fecha del evento
 * @returns {Promise<Object>} - { hayStock: boolean, mensaje: string, faltantes: array }
 */
async function verificarStock(productos, fechaEvento) {
    try {
        const faltantes = [];

        for (const producto of productos) {
            // 1. Obtener stock total del producto
            const { data: inventarioData, error: errorInventario } = await supabase
                .from('inventario')
                .select('stock_total')
                .eq('id', producto.producto_id)
                .single();

            if (errorInventario || !inventarioData) {
                faltantes.push({
                    producto_id: producto.producto_id,
                    nombre: 'Producto desconocido',
                    solicitado: producto.cantidad,
                    disponible: 0
                });
                continue;
            }

            const stockTotal = inventarioData.stock_total;

            // 2. Calcular stock ya reservado para esa fecha
            const { data: reservasConProducto, error: errorReservas } = await supabase
                .from('reservas')
                .select('productos')
                .eq('fecha_evento', fechaEvento)
                .in('estado', ['pendiente', 'confirmada']);

            let stockReservado = 0;
            if (reservasConProducto) {
                for (const reserva of reservasConProducto) {
                    if (reserva.productos) {
                        const productoEnReserva = reserva.productos.find(p => p.producto_id === producto.producto_id);
                        if (productoEnReserva) {
                            stockReservado += productoEnReserva.cantidad;
                        }
                    }
                }
            }

            const stockDisponible = stockTotal - stockReservado;

            // 3. Verificar si hay suficiente
            if (stockDisponible < producto.cantidad) {
                faltantes.push({
                    producto_id: producto.producto_id,
                    nombre: producto.nombre || 'Producto',
                    solicitado: producto.cantidad,
                    disponible: stockDisponible
                });
            }
        }

        if (faltantes.length > 0) {
            const mensaje = faltantes.map(f => 
                `- ${f.nombre}: Solicitado ${f.solicitado}, disponible ${f.disponible}`
            ).join('\n');

            return {
                hayStock: false,
                mensaje: `❌ No hay stock suficiente para:\n${mensaje}`,
                faltantes: faltantes
            };
        }

        return {
            hayStock: true,
            mensaje: '✅ Stock disponible',
            faltantes: []
        };

    } catch (err) {
        console.error('Error en verificarStock:', err);
        return {
            hayStock: false,
            mensaje: '❌ Error al verificar stock',
            faltantes: []
        };
    }
}

/**
 * Verifica stock de un paquete (desglosando sus componentes)
 * @param {number} paqueteId - ID del paquete
 * @param {number} cantidad - Cantidad de paquetes
 * @param {string} fechaEvento - Fecha del evento
 * @returns {Promise<Object>} - { hayStock: boolean, mensaje: string }
 */
async function verificarStockPaquete(paqueteId, cantidad, fechaEvento) {
    try {
        // 1. Obtener el paquete con su contenido
        const { data: paquete, error } = await supabase
            .from('inventario')
            .select('producto_nombre, contenido')
            .eq('id', paqueteId)
            .eq('tipo', 'paquete')
            .single();

        if (error || !paquete) {
            return {
                hayStock: false,
                mensaje: '❌ Paquete no encontrado'
            };
        }

        if (!paquete.contenido || paquete.contenido.length === 0) {
            return {
                hayStock: true,
                mensaje: '✅ Paquete sin componentes definidos'
            };
        }

        // 2. Convertir contenido del paquete a formato de productos
        const productosDelPaquete = paquete.contenido.map(item => ({
            producto_id: item.producto_id,
            nombre: item.item,
            cantidad: item.cantidad * cantidad // Multiplicar por cantidad de paquetes
        }));

        // 3. Verificar stock de todos los componentes
        return await verificarStock(productosDelPaquete, fechaEvento);

    } catch (err) {
        console.error('Error en verificarStockPaquete:', err);
        return {
            hayStock: false,
            mensaje: '❌ Error al verificar stock del paquete'
        };
    }
}

// ===== FUNCIONES AUXILIARES =====

function convertirAHoraMinutos(hora) {
    const [horas, minutos] = hora.split(':').map(Number);
    return (horas * 60) + minutos;
}

function convertirMinutosAHora(minutos) {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function hayChoque(inicio1, fin1, inicio2, fin2) {
    // Dos intervalos se cruzan si uno empieza antes de que el otro termine
    return inicio1 < fin2 && inicio2 < fin1;
}

// Hacer funciones disponibles globalmente
window.verificarDisponibilidad = verificarDisponibilidad;
window.verificarStock = verificarStock;
window.verificarStockPaquete = verificarStockPaquete;