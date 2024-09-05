document.addEventListener('DOMContentLoaded', function () {
    var dateInput = document.querySelector('input[name="date_order"]');
    dateInput.setAttribute('max', today);
});
$(document).ready(function () {
    let isValid = true;
    $('input[name="date_order"]').on('change',function(){
        var $dateInputOrder = $('input[name="date_order"]');
        var dateSelectedStr = $dateInputOrder.val();
        var $errorMsm = $dateInputOrder.siblings('.invalid-feedback');

        if(dateSelectedStr > today){
            
            $dateInputOrder.addClass('is-invalid');
            $errorMsm.text('Fecha no valida');
            
            isValid=false
            
        }else{
            $dateInputOrder.removeClass('is-invalid');
            $errorMsm.text('Seleccione una fecha.');
        }
    });


    $('#formOrder').on('submit', function (e) {
        e.preventDefault();

        $('.form-control').removeClass('is-invalid');
        $('.form-control').removeClass('is-valid');

        var requiredFields = $('#formOrder').find('[required]');
        
        //revisar 
        

        requiredFields.each(function () {
            var fieldValue = $(this).val();
            if (fieldValue === '') {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });

        if (isValid) {

            $.ajax({
                type: 'POST',
                //url:'{% url "create_order" %}',
                data: $(this).serialize(),
                success: function (response) {
                    console.log(`Status ${response.errors}`)
                    if (response.success) {

                        $('#tableNewOrders tbody').append(`
                        <tr>
                    <th scope="row">${response.order.id}</th>
                    <td>${response.order.name_product}</th>
                    <td>${response.order.quantity}</td>
                    <td>${response.order.buy_price}</td>
                    <td>${response.order.sale_price}</td>
                    <td>${response.order.name_provider}</td>
                    <td>
                        <button type="button" class="btn btn-success" onclick="">Editar</button>
                        <button type="button" class="btn btn-danger" onclick="">Eliminar</button>

                        </form>
                    </td>
                </tr>
                        `);
                    }
                },
                error: function (xhr) {
                    const response = xhr.responseJSON;
                    if (response && response.error) {
                        $.each(response.error, function (field, messages) {
                            messages.forEach(function (msg) {
                                var $input = $('[name="' + field + '"]');
                                if ($input) {
                                    $input.addClass('is-invalid');
                                }
                            });
                        });
                    } else {
                        console.error('Error en la solicitud:', xhr.responseText);
                    }

                }
            });
        }
    });
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