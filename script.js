const boton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const menuPanel = document.querySelector(".menu ul");

if (boton && menu && menuPanel) {

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

    // SWIPE DENTRO DEL MENÚ
    let startX = 0;

    menuPanel.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    menuPanel.addEventListener("touchend", (e) => {
        let endX = e.changedTouches[0].clientX;

        // si desliza a la izquierda suficiente
        if (startX - endX > 50) {
            menu.classList.remove("active");
        }
    });
}