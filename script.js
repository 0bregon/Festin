const boton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

if (boton && menu) {

    // Toggle con botón
    boton.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("active");
    });

    // Cerrar al hacer clic fuera
    document.addEventListener("click", (e) => {
        if (!menu.contains(e.target) && !boton.contains(e.target)) {
            menu.classList.remove("active");
        }
    });

    // Detectar swipe
    let startX = 0;
    let endX = 0;

    document.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    document.addEventListener("touchend", (e) => {
        endX = e.changedTouches[0].clientX;

        // swipe izquierda para cerrar
        if (menu.classList.contains("active") && (startX - endX > 50)) {
            menu.classList.remove("active");
        }
    });
}