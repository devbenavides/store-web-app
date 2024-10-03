var isValid = true;
let products = [];
let form;
let btn_add_list;
let btn_save_changes;
let btn_cancel;
let btn_save;


document.addEventListener('DOMContentLoaded', function () {
    var dateInput = document.querySelector('input[name="date_order"]');
    dateInput.setAttribute('max', today);

    form = document.getElementById('formOrder');
    btn_add_list = document.getElementById('btn_add_list');
    btn_save_changes = document.getElementById('btn_save_changes');
    btn_cancel = document.getElementById('btn_cancel');
    btn_save = document.getElementById('btn_save');
    btn_clear_table = document.getElementById('btn_clear_table');


    const btnEdit = document.getElementById('btnEdit');
    /* btnEdit.addEventListener('click', function () {
        const order_id = boton.getAttribute('data-order_id');
        editOrder(order_id);
    }); */



    async function saveOrders() {
        try {
            const response = await fetch(
                create_order,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({
                        products
                    })
                }

            );

            const data = await response.json();
            console.log('Data: ', data);
            if (!data.success) {
                products.splice(0,products.length)
                data.error_item.forEach(item=>{
                    products.push(item['order_item']);
                    console.log('Error descrip: ',item['errors']);
                    console.log('Item: ',item['order_item']);
                });
                console.log('List item error: ', products);
                updateTable(products); 

            } else {
                products.splice(0,products.length);
                updateTable(products);
                document.querySelector('#tableNewOrders').setAttribute('hidden','true');
                btn_save.setAttribute('hidden','true');s
                console.log('save orders ', response.save_item);
            }
        } catch (error) {
            console.log('Error ', error.error)
        }
    }

    function removeClass() {
        form.querySelectorAll('.form-control').forEach(
            control => {
                control.classList.remove('is-invalid', 'is-valid');
            }
        );
    }

    function validInputs() {
        let isValid = true;
        form.querySelectorAll('[required]').forEach(it => {
            if (!it.value.trim()) {
                it.classList.add('is-invalid');
                isValid = false;
            } else {
                it.classList.remove('is-invalid', 'is-valid')
            }
        });
        return isValid;
    }
    function clearInputsProduct() {
        form.querySelectorAll(
            'input[name="code_product"],' +
            'input[name="quantity"],' +
            'input[name="buy_price"],' +
            'input[name="sale_price"],' +
            'input[name="expiration_date"]'
        ).forEach(input => {
            input.value = '';
        });

        form.querySelectorAll('select[name="product"').forEach(select => {
            select.selectedIndex = 0;
        });

    }

    function editOrder(id) {
        const product_ = products.find(p => p.id === id);
        console.log(`Id Edit ${id}`);
        console.log(`${product_}`);
        document.getElementById('id-edit').value = product_.id;
        document.querySelector('[name="number_invoice"]').value = product_.number_invoice;
        document.querySelector('[name="quantity"]').value = product_.quantity;
        document.querySelector('[name="buy_price"]').value = product_.buy_price;
        document.querySelector('[name="sale_price"]').value = product_.sale_price;
        document.querySelector('[name="expiration_date"]').value = product_.expiration_date;
        document.querySelector('[name="date_order"]').value = product_.date_order;
        document.querySelector('[name="product"]').value = product_.product;
        document.querySelector('[name="provider"]').value = product_.provider;

        btn_save_changes.removeAttribute('hidden');
        btn_cancel.removeAttribute('hidden');
        btn_add_list.setAttribute('hidden', 'true');
    }

    function deleteOrder(id) {
        const idx = products.findIndex(p => p.id === id);

        const btn_confirm = document.getElementById('confirmButton');
        const modal_confirm = new bootstrap.Modal(document.getElementById('modalConfirm'));

        const midiv = document.getElementById('miDiv');
        midiv.innerHTML = '<h3>Está seguro que desea eliminar el registro?</h3>'
        modal_confirm.show();

        btn_confirm.addEventListener('click', () => {
            console.log(`products 1 ${products.name_product}`);
            console.log(`idx ${idx} id ${id}`);

            if (idx !== -1) {
                products.splice(idx, 1);
                products.forEach((p, index) => {
                    p.id = index + 1;
                });
                updateTable(products);
            }
            modal_confirm.hide();
        }, { once: true });

    }

    function updateTable(products_up) {
        const tbody = document.querySelector('#tableNewOrders tbody');
        tbody.innerHTML = '';

        products_up.forEach(product => {
            const tr = document.createElement('tr');
            const th_id = document.createElement('th');
            th_id.textContent = product.id;
            const td_name_product = document.createElement('td');
            td_name_product.textContent = product.name_product;
            const td_quantity = document.createElement('td');
            td_quantity.textContent = product.quantity;
            const td_buy_price = document.createElement('td');
            td_buy_price.textContent = product.buy_price;
            const td_sale_price = document.createElement('td');
            td_sale_price.textContent = product.sale_price;
            const td_name_provider = document.createElement('td');
            td_name_provider.textContent = product.name_provider;
            const td_options = document.createElement('td');

            const btn_edit = document.createElement('button');
            btn_edit.textContent = 'Editar';
            btn_edit.className = 'btn btn-primary';
            btn_edit.addEventListener('click', () => editOrder(product.id));
            td_options.appendChild(btn_edit);

            const btn_delete = document.createElement('button');
            btn_delete.textContent = 'Eliminar';
            btn_delete.className = 'btn btn-danger';
            btn_delete.addEventListener('click', () => deleteOrder(product.id));
            td_options.appendChild(btn_delete);

            tr.appendChild(th_id);
            tr.appendChild(td_name_product);
            tr.appendChild(td_quantity);
            tr.appendChild(td_buy_price);
            tr.appendChild(td_sale_price);
            tr.appendChild(td_name_provider);
            tr.appendChild(td_options);

            tbody.appendChild(tr);
        });
        document.querySelector('#tableNewOrders').removeAttribute('hidden');
        btn_save.removeAttribute('hidden');
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validInputs()) {
            const number_invoice = document.querySelector('[name="number_invoice"]').value;
            const quantity = document.querySelector('[name="quantity"]').value;
            const buy_price = document.querySelector('[name="buy_price"]').value;
            const sale_price = document.querySelector('[name="sale_price"]').value;
            const expiration_date = document.querySelector('[name="expiration_date"]').value;
            const date_order = document.querySelector('[name="date_order"]').value;

            const selectProduct = document.querySelector('[name="product"]');
            const product = selectProduct.options[selectProduct.selectedIndex].value;
            const name_product = selectProduct.options[selectProduct.selectedIndex].text;

            const selectProvider = document.querySelector('[name="provider"]');
            const provider = selectProvider.options[selectProvider.selectedIndex].value;
            const name_provider = selectProvider.options[selectProvider.selectedIndex].text;


            const order = {
                id: products.length + 1,
                number_invoice,
                quantity,
                buy_price,
                sale_price,
                expiration_date,
                date_order,
                product,
                name_product,
                provider,
                name_provider
            };
            products.push(order);

            updateTable(products);
            clearInputsProduct();
        }
    });

    btn_save_changes.addEventListener('click', () => {
        const id = parseInt(document.getElementById('id-edit').value, 10);
        const number_invoice = document.querySelector('[name="number_invoice"]').value;
        const quantity = parseFloat(document.querySelector('[name="quantity"]').value);
        const buy_price = parseFloat(document.querySelector('[name="buy_price"]').value);
        const sale_price = parseFloat(document.querySelector('[name="sale_price"]').value)||0;
        const expiration_date = document.querySelector('[name="expiration_date"]').value;
        const date_order = document.querySelector('[name="date_order"]').value;

        const selectProduct = document.querySelector('[name="product"]');
        const product = parseInt(selectProduct.options[selectProduct.selectedIndex].value);
        const name_product = selectProduct.options[selectProduct.selectedIndex].text;

        const selectProvider = document.querySelector('[name="provider"]');
        const provider = parseInt(selectProvider.options[selectProvider.selectedIndex].value);
        const name_provider = selectProvider.options[selectProvider.selectedIndex].text;

        const idx = products.findIndex(p => p.id === id);
        if (idx !== -1) {
            products[idx] = {
                id,
                number_invoice,
                quantity,
                buy_price,
                sale_price,
                expiration_date,
                date_order,
                product,
                name_product,
                provider,
                name_provider
            };
            updateTable(products);
            clearInputsProduct();
            btn_cancel.click();
        }

    });

    btn_cancel.addEventListener('click', () => {
        clearInputsProduct();
        btn_add_list.removeAttribute('hidden');
        btn_cancel.setAttribute('hidden', 'true');
        btn_save_changes.setAttribute('hidden', 'true');
    });

    btn_save.addEventListener('click', () => {
        saveOrders();
    });

    document.querySelector('input[name="date_order"]').addEventListener('change', (it) => {
        var dateInputOrder = it.target;
        var dateSelectedStr = dateInputOrder.value;
        var errorMsm = dateInputOrder.nextElementSibling;

        if (dateSelectedStr > today) {
            dateInputOrder.classList.add('is-invalid');
            errorMsm.textContent = 'Fecha no valida';
            isValid = false
        } else {
            dateInputOrder.classList.remove('is-invalid');
            errorMsm.textContent = 'Seleccione una fecha.';
        }
    });

    async function searchProductByCode() {
        var codeProductInput = document.querySelector('input[name="code_product"]');
        var code_product = codeProductInput.value.trim();

        try {
            const response = await fetch(`${searchCodeProduct}?code_product=${encodeURIComponent(code_product)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                }                
            });

            if (!response.ok) {
                throw new Error(`Http Error Status ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                console.log(`Resultado ${data}`)
            } else {
                document.querySelector('select[name="product"').value = data.id;
                document.querySelector('select[name="product"').classList.add('is-valid');
            }


        } catch (error) {
            console.error(`Fetch error: ${error}`);
        }


    }

    document.querySelector('input[name="code_product"]').addEventListener('keypress', (it) => {
        if (it.key === 'Enter') {
            it.preventDefault();
            searchProductByCode()
        }
    });

    document.getElementById('btnSearchProduct').addEventListener('click', () => {
        searchProductByCode()
    })



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
