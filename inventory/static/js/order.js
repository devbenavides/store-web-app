var isValid = true;


document.addEventListener('DOMContentLoaded', function () {
    var dateInput = document.querySelector('input[name="date_order"]');
    dateInput.setAttribute('max', today);
});

$(document).ready(function () {

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

    function clearInputsProduct() {
        $('#formOrder').find(
            `input[name="code_product"],
            input[name="quantity"],
            input[name="buy_price"],
            input[name="sale_price"],
            input[name="expiration_date"]`
        ).val('');

        $('#formOrder').find('select[name="product"]').prop('selectedIndex', 0);
    }


    $('#formOrder').on('submit', function (e) {
        e.preventDefault();
        isValid = true;

        $(this).find('.form-control').removeClass('is-invalid is-valid');

        var requiredFields = $('#formOrder').find('[required]');

        requiredFields.each(function () {
            var fieldValue = $(this).val();
            if (fieldValue === '') {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid is-valid');
            }
        });

        if (isValid) {
            $.ajax({
                type: 'POST',
                url: create_order,
                data: $(this).serialize(),
                success: function (response) {
                    clearInputsProduct();

                    if (response.success) {

                        $('#tableNewOrders tbody').append(
                            `
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
                        $('#tableNewOrders').removeAttr('hidden');

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
            requiredFields = $();
        }
    });


    $('input[name="date_order"]').on('change', function () {
        var $dateInputOrder = $('input[name="date_order"]');
        var dateSelectedStr = $dateInputOrder.val();
        var $errorMsm = $dateInputOrder.siblings('.invalid-feedback');

        if (dateSelectedStr > today) {

            $dateInputOrder.addClass('is-invalid');
            $errorMsm.text('Fecha no valida');

            isValid = false

        } else {
            $dateInputOrder.removeClass('is-invalid');
            $errorMsm.text('Seleccione una fecha.');
        }
    });


    function searchProductByCode() {
        var $codeProductInput = $('input[name="code_product"]');
        var code_product = $codeProductInput.val().trim();

        $.ajax({
            url: searchCodeProduct,
            dataType: 'json',
            data: { code_product: code_product },
            success: function (data) {
                console.log(`Resultado ${data}`)
                if (data.error) {
                    console.error('Error de producto')
                } else {
                    $('select[name="product"').val(data.id)
                    $('select[name="product"').addClass('is-valid')
                }
            },
            error: function (xhr) {
                console.error(`${xhr.error}`)
            }
        });
    }

    $('input[name="code_product"]').on('keypress', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            searchProductByCode();
        }
    });

    $('#btnSearchProduct').on('click', function () {
        searchProductByCode();
    });



});
