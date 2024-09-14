document.addEventListener('DOMContentLoaded', () => {
    const formReserva = document.getElementById('form-reserva');
    const modal = document.getElementById('modal-reserva');
    const closeModal = document.querySelector('.close');
    const reservarBtns = document.querySelectorAll('.reservar-btn');

    // Abre el modal al hacer clic en un botón de reserva
    reservarBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const canchaId = btn.closest('.cancha').dataset.id;
            formReserva.dataset.canchaId = canchaId; // Guarda el ID de la cancha en el formulario
            modal.classList.add('show'); // Usa la clase 'show' para mostrar el modal
        });
    });

    // Cierra el modal al hacer clic en el botón de cerrar
    closeModal.addEventListener('click', () => {
        modal.classList.remove('show'); // Usa la clase 'show' para ocultar el modal
    });

    // Cierra el modal al hacer clic fuera del contenido del modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show'); // Usa la clase 'show' para ocultar el modal
        }
    });

    formReserva.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Recoge los datos del formulario
        const formData = new FormData(formReserva);
        const data = {
            nombre: formData.get('nombre'),
            email: formData.get('email'),
            telefono: formData.get('telefono'),
            fecha: formData.get('fecha'),
            hora: formData.get('hora'),
            cancha: formReserva.dataset.canchaId, // Usa el ID de la cancha almacenado
            precio: 1000 // Ajusta el precio según sea necesario
        };

        try {
            // Envía los datos al backend
            const response = await fetch('/crear_preferencia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.id) {
                // Redirige a Mercado Pago
                window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${result.id}`;
                // Cierra el modal después de redirigir
                modal.classList.remove('show');
            } else {
                console.error('Error al crear la preferencia de pago');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
