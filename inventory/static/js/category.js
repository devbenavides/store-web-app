
function createCategory() {
    $('#modalCreateCategory').modal('hide');
    $.ajax({
        url: '/inventory/category/create/',
        type: 'GET',
        success: function (response) {
            $('#modalContainer').empty();
            $('#modalContainer').html(response);
            $("#modalCreateCategory").modal("show");
        }
    });
}

function editCategory(id) {
    $('#modalEditCategory').modal('hide');
    $.ajax({
        url: `/inventory/category/${id}/`,
        type: 'GET',
        success: function (response) {
            $('#modalContainer').empty();
            $('#modalContainer').html(response);
            $("#modalEditCategory").modal("show");
        }
    });
}
function categoryDelete(id) {
    var btnConfirm = document.getElementById("confirmButton")
    $("#modalConfirm").modal('show');
    var miDiv = document.getElementById("miDiv");
    miDiv.innerHTML = "<h3>Está seguro que desea eliminar el registro?</h3>";

    btnConfirm.onclick = function () {
        fetch(`/inventory/category/delete/${id}/`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ category_id: id })
            }
        )
            .then(response => {
                if (!response.ok) {
                    var error = 'Error al eliminar la categoria';
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
                    localStorage.setItem('msm', 'Categoria eliminada ' + data['category']);
                    localStorage.setItem('type', 'success');
                    window.location.href = '/inventory/category';
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

/* ejecutar el codigo al terminar de cargar la pagina $ jquery*/
/* $(document).ready(function () {
    var isReload = localStorage.getItem('reload');
    var message = localStorage.getItem('msm');
    var type = localStorage.getItem('type');
    if (isReload) {
        showAlert(message, type);
        localStorage.removeItem('reload');
        localStorage.removeItem('msm');
        localStorage.removeItem('type');
    }
}); */

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


$(document).on('submit', '#miFormulario', function (e) {
    //obtenemos una respuesta para ver si el formulario es valido o no
    e.preventDefault();
    $.ajax({
        url: $(this).attr('action'),
        type: $(this).attr('method'),
        data: $(this).serialize(),
        success: function (response) {
            $('#modalCreateCategory').modal('hide');
            $('#modalContainer').empty();
            if (response.success) {
                localStorage.setItem('reload', true);
                localStorage.setItem('msm', response.msm);
                localStorage.setItem('type', 'success');
                window.location.href = '/inventory/category/';
            } else {
                $('#modalContainer').html(response);
                $("#modalCreateCategory").modal("show");
            }
        }
    });
});

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
