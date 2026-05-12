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

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const botonAnterior = document.querySelector('.anterior');
  const botonSiguiente = document.querySelector('.siguiente');
  let indiceActual = 0;

  function mostrarImagen(indice) {
    // Quitar la clase activa a todas las imágenes
    slides.forEach(slide => slide.classList.remove('activa'));
    
    // Asignar la clase activa a la nueva imagen
    slides[indice].classList.add('activa');
  }

  botonSiguiente.addEventListener('click', () => {
    // Avanzar de índice, si llega al final regresa al 0
    indiceActual = (indiceActual + 1) % slides.length;
    mostrarImagen(indiceActual);
  });

  botonAnterior.addEventListener('click', () => {
    // Retroceder de índice, si es menor a 0 va al último
    indiceActual = (indiceActual - 1 + slides.length) % slides.length;
    mostrarImagen(indiceActual);
  });
});

function cambiarServicio(imagen, titulo) {

    document.getElementById("imagen-servicio").src = imagen;

    document.getElementById("imagen-servicio").alt = titulo;

    document.getElementById("titulo-servicio").textContent = titulo;

}