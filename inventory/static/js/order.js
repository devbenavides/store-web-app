
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

document.addEventListener('change', (event) => {
  var dateInput = document.querySelector('input[name="date_order"]');
  dateInput.setAttribute('max', today);

  if (event.target.matches('input[name="date_order"]')) {
    var dateInputOrder = event.target;
    var dateSelectedStr = dateInputOrder.value;
    var errorMsm = dateInputOrder.nextElementSibling;

    if (new Date(dateSelectedStr) > new Date()) { // Cambia `today` por `new Date()`
      dateInputOrder.classList.add('is-invalid');
      errorMsm.textContent = 'Fecha no válida';
    } else {
      dateInputOrder.classList.remove('is-invalid');
      errorMsm.textContent = 'Seleccione una fecha.';
    }
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const modalContainer = document.getElementById('modalContainer');

  //delegacion de eventos para los botones de las demas paginas
  document.querySelector('tbody').addEventListener('click', function (event) {
    if (event.target.classList.contains('open-modal')) {
      const id = event.target.getAttribute('data-order-id');
      const action = event.target.classList.contains('edit') ? 'edit' : 'delete';
      if (action === 'edit') {
        editOrder(id);
      } else if (action == 'delete') {
        console.log('Eliminar id ' + id);
      }
    }
  });

  modalContainer.addEventListener('submit', async (e) => {
    if (e.target.matches('#formOrder')) {
      e.preventDefault();
      const url = e.target.getAttribute('action');
      const method = e.target.getAttribute('method');
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      console.log('form order', formData);
      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
          },
          body: JSON.stringify(data) //utilizar cuando solo es texto si utilizar 'Content-Type':...
          //body: formData //utilizar cuando se requiera enviar texto y archivos no utilizar 'Content-Type':...
        });

        const responseData = await response.json();
        if (responseData.success) {

        } else {
          const errors = responseData.errors;          

          // Recorrer y imprimir en consola
          /* for (const field in errors) {
            if (errors.hasOwnProperty(field)) {
              const fieldErrors = errors[field];
              fieldErrors.forEach(error => {
                console.log(`${field}: ${error}`);
              });
            }
          }
 */
         
          Object.keys(errors).forEach(field => {
            const fieldErrors = errors[field];
            fieldErrors.forEach(error_msm => {
              const input = document.querySelector('[name="'+field+'"]');
              if(input){
                input.classList.add('is-invalid');
              }
            });
          });
        }

      } catch (error) {

      }
    }
  });

  function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

});