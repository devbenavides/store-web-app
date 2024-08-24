function createProduct() {
    $('#modalProduct').modal('hide');
    $.ajax({
        url: '/inventory/product/create/',
        type: 'GET',
        success: function (response) {
            $('#modalContainerProduct').empty();
            $('#modalContainerProduct').html(response);
            $("#modalProduct").modal("show");
        }
    });
}

function editProduct(id) {
    $('#modalProduct').modal('hide');
    $.ajax({
        url: `/inventory/product/${id}/`,
        type: 'GET',
        success: function (response) {
            $('#modalContainerProduct').empty();
            $('#modalContainerProduct').html(response);
            $("#modalProduct").modal("show");
        }
    });
}

function productDelete(id) {
    var btnConfirm = document.getElementById("confirmButton")
    $("#modalConfirm").modal('show');
    var miDiv = document.getElementById("miDiv");
    miDiv.innerHTML = "<h2>Está seguro que desea eliminar el registro?</h2> ";

    btnConfirm.onclick = function () {

        fetch(`/inventory/product/delete/${id}/`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ product_id: id })
            }
        )
            .then(response => {
                if (!response.ok) {
                    var error = 'Error al eliminar el producto';
                    $('#modalConfirm').modal('hide').on('hidden.bs.modal', function () {
                        showAlert(error, 'danger')
                    });
                    throw new Error(error);
                }
                return response.json();
            })
            .then(data => {
                $('#modalConfirm').modal('hide').on('hidden.bs.modal', function () {
                    localStorage.setItem('reload', true);
                    localStorage.setItem('msm', 'Producto eliminado ' + data['product']);
                    localStorage.setItem('type', 'success');
                    window.location.href = '/inventory/product';
                });
            })
            .catch(error => {
                console.error('Error--> ', error)
            });
    }
}

/* ejecutar el codigo al terminar de cargar la pagina javascript*/
document.addEventListener('DOMContentLoaded', function () {
    var isReload = localStorage.getItem('reload');
    var message = localStorage.getItem('msm');
    var type = localStorage.getItem('type');
    if (isReload) {
        showAlert(message, type);
        localStorage.removeItem('reload');
        localStorage.removeItem('msm');
        localStorage.removeItem('type');
    }
});

$(document).on('submit', '#formProduct', function (e) {
    //obtenemos una respuesta para ver si el formulario es valido o no
    e.preventDefault();
    $.ajax({
        url: $(this).attr('action'),
        type: $(this).attr('method'),
        data: $(this).serialize(),
        success: function (response) {
            $('#modalProduct').modal('hide');
            $('#modalContainerProduct').empty();
            if (response.success) {
                localStorage.setItem('reload', true);
                localStorage.setItem('msm', response.msm);
                localStorage.setItem('type', 'success');
                window.location.href = '/inventory/product/';
            } else {
                $('#modalContainerProduct').html(response);
                $("#modalProduct").modal("show");
            }
        }
    });
});

function showAlert(message, type) {
    var alert =
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        <div>${message}</div>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    setTimeout(function () {
        document.getElementById('alerts').innerHTML = alert;
    }, 800);

    setTimeout(function () {
        document.getElementById('alerts').innerHTML = '';
    }, 3000);
}

// obtener valor del CSRF
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