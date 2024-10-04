
function editOrder(id) {
    fetch(`/inventory/order/${id}/`) // Asegúrate de que esta ruta sirve el archivo modal.html
        .then(response => response.text())
        .then(data => {
            document.getElementById('modalContainer').innerHTML = data;

            const modal = document.getElementById('modalOrder');

            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
            modal.addEventListener('hidden.bs.modal', function () {
                document.getElementById('modalContainer').innerHTML = ''; // Limpiar contenido al cerrarlo
              });

        })
        .catch(error => console.error('Error:', error));

}
function closeModal() {
    const modal = document.getElementById('myModal');
    const bootstrapModal = bootstrap.Modal.getInstance(modal);
    if (bootstrapModal) {
      bootstrapModal.hide();
    }
  }

document.addEventListener('DOMContentLoaded', () => {

    //delegacion de eventos para los botones de las demas paginas
    document.querySelector('tbody').addEventListener('click', function(event) {
        if (event.target.classList.contains('open-modal')) {
          const id = event.target.getAttribute('data-order-id');
          const action = event.target.classList.contains('edit') ? 'edit' : 'delete';
          editOrder(id);
        }
      });
    
});