let products = [];
let id_client = 0;
let rowSelected = null;
let subTotal = 0.0;
let discount = 0.0;
let valDiscount = 0.1;
let subTotalBase = 0.0;
let totalIva = 0.0;
let valIva = 0.0;
let total = 0.0;
let cash_received = 0.0;
let cash_change = 0.0;
let payment_method = '';


document.addEventListener('DOMContentLoaded', function () {
    const modalContainer = document.getElementById('modalContainer');
    const inputCode = document.querySelector('input[name="code_product"]');
    inputCode.focus();

    const date_now = new Date();
    const format_date = date_now.toLocaleDateString('en-CA');
    document.getElementById('span_date').textContent = format_date;
    document.getElementById('span_number_invoice').textContent = numberInvoice;

    /* document.getElementById('formSales').addEventListener('submit',(event)=>{
        event.preventDefault();
    });
    document.getElementById('tableProducts').addEventListener('contextmenu',(event)=>{
        event.preventDefault();
    }); */

    async function searchProductByCode(code_product) {
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
                validExistsList(data);
            }

        } catch (error) {
            console.error(`Fetch error: ${error}`);
        }
    }


    modalContainer.addEventListener('click', async (e) => {
        var nameProduct = document.getElementById('name_product');
        if (e.target && e.target.id === 'btnSearchName') {
            e.preventDefault();
            const nameProductCategory = nameProduct.value
            searchNameCategoryProduct(nameProductCategory);
        }
    });

    modalContainer.addEventListener('shown.bs.modal', function () {
        const input = document.getElementById('name_product');
        input.focus();
    });

    modalContainer.addEventListener('keydown', (e) => {
        if (e.target.id === 'name_product' && e.key === 'Enter') {
            e.preventDefault();
            searchNameCategoryProduct(e.target.value);
        }

        const bodyTableProducts = document.querySelector('#table_products tbody');
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const filas = Array.from(bodyTableProducts.rows);
            let indiceSeleccionado = filas.indexOf(rowSelected);

            if (e.key === 'ArrowDown') {
                indiceSeleccionado = Math.min(filas.length - 1, indiceSeleccionado + 1);
            }
            if (e.key === 'ArrowUp') {
                indiceSeleccionado = Math.max(0, indiceSeleccionado - 1);
            }
            selectRow(filas[indiceSeleccionado]);
        }

        /**
         * Obtener el data-id de la fila seleccionada
         * */
        if (e.key === 'Enter' && rowSelected) {
            const code_product = rowSelected.dataset.product_id.trim();
            searchProductByCode(code_product);
            rowSelected = null;
            closeModal();
        }
    });

    /**
     *  función para editar información en la tabla donde se listan los productos agregados
     * */
    document.getElementById('tableProducts').addEventListener('click', (event) => {
        const target = event.target;

        if (target.tagName === 'TD' && target.classList.contains('editable')) {
            const originalText = target.textContent || target.innerText;
            const valueClean = originalText.replace(/[.]/g, '').replace(',', '.');

            const input_new = document.createElement('input');
            input_new.type = 'number';
            input_new.value = parseFloat(valueClean);
            input_new.className = 'form-control';
            input_new.select();

            target.innerHTML = '';
            target.appendChild(input_new);


            input_new.addEventListener('blur', () => {
                saveData(target, input_new.value);
            });

            input_new.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveData(target, input_new.value);
                }
            });
            input_new.focus();
        }
    });
    /**
     * función para guardar la información nueva en el array 
     */
    function saveData(cell, new_value) {
        const row = cell.closest('tr');
        const id = row.dataset.id_product;
        const input = cell.dataset.field;
        const product = products.find(p => p.id == id);

        if (input === 'quantity') {
            if (parseFloat(new_value) > parseFloat(product.stock_product)) {
                const swalCustomButton = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger"
                    },
                    buttonsStyling: false
                });
                swalCustomButton.fire({
                    title: '¡Advertencia!',
                    html: '<ul style="padding-left: 20px; list-style-position: inside; margin: 0;"> Stock insuficiente</ul>',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar',
                    allowOutsideClick: true,
                    allowScapeKey: true
                });
            } else {
                if (product) {
                    product[input] = new_value;
                    updateTable(products);
                }
            }

        } else {
            if (product) {
                product[input] = new_value;
                updateTable(products);
            }
        }


    }
    /**
     * buscar poducto por código al presionar la tecla enter
     */
    document.querySelector('input[name="code_product"]').addEventListener('keypress', (it) => {
        if (it.key === 'Enter') {
            it.preventDefault();
            searchProductByCode(it.target.value)
        }
    });
    /**
     * buscar poducto por código al presionar el boton
     */
    document.getElementById('btnSearchProduct').addEventListener('click', () => {
        var codeProductInput = document.querySelector('input[name="code_product"]');
        var code_product = codeProductInput.value.trim();
        searchProductByCode(code_product)
    });

    /**
     * validar el stock antes de agregarlo
     * validar si el producto ya existe en el array
     * si existe sumar 1 a la cantidad
     * no existe agregarlo con cantidad 1
     */
    function validExistsList(data) {
        if (validStockProduct(data)) {
            const product = products.find(p => p.id === data.id);
            if (product) {
                product.quantity += 1;
            } else {

                products.push({
                    'id': data.id,
                    'name_product': data.name_product,
                    'quantity': 1,
                    'stock_product': data.stock_product,
                    'unit_sale_price': data.unit_sale_price
                });
            }
            updateTable(products);
            document.querySelector('[name="code_product"]').value = '';
        }

    }

    function updateTable(products_up) {
        console.log('Products ', products_up);
        const tbody = document.querySelector('#tableProducts tbody');
        tbody.innerHTML = '';

        subTotal = 0.0;
        discount = 0.0;
        valDiscount = 0.0;
        subTotalBase = 0.0;
        totalIva = 0.0;
        valIva = 0.0;
        total = 0.0;

        products_up.forEach(product => {
            const tr = document.createElement('tr');
            tr.dataset.id_product = product.id;

            const th_id = document.createElement('th');
            th_id.textContent = product.id;

            const td_name_product = document.createElement('td');
            td_name_product.textContent = product.name_product;

            const td_quantity = document.createElement('td');
            td_quantity.classList.add('editable');
            td_quantity.textContent = product.quantity;
            td_quantity.dataset.field = 'quantity';



            const td_unit_sale_price = document.createElement('td');
            td_unit_sale_price.classList.add('editable');
            td_unit_sale_price.textContent = formatNumber(product.unit_sale_price);
            td_unit_sale_price.dataset.field = 'unit_sale_price';

            const td_total = document.createElement('td');
            const totalSale = parseFloat(product.unit_sale_price) * parseFloat(product.quantity);
            td_total.textContent = formatNumber(totalSale);

            if (totalSale <= 0) {
                tr.classList.add('table-active');
            }

            subTotal += totalSale
            discount = subTotal * valDiscount;
            subTotalBase = subTotal - discount;
            totalIva = subTotalBase * valIva;
            total = subTotal + totalIva;

            document.getElementById('span_subtotal').innerHTML = formatNumber(subTotal);
            document.getElementById('span_discount').textContent = formatNumber(discount);
            document.getElementById('span_subtotal_base').innerHTML = formatNumber(subTotalBase);
            document.getElementById('span_total_iva').innerHTML = formatNumber(totalIva);
            document.getElementById('span_total').innerHTML = formatNumber(total);

            const td_iva = document.createElement('td');
            td_iva.textContent = '19%';


            const td_options = document.createElement('td');

            const btn_delete = document.createElement('button');
            btn_delete.textContent = 'Eliminar';
            btn_delete.className = 'btn btn-danger';
            btn_delete.type = 'button';
            btn_delete.addEventListener('click', () => deleteProduct(product.id));
            td_options.appendChild(btn_delete);


            tr.appendChild(th_id);
            tr.appendChild(td_name_product);
            tr.appendChild(td_quantity);
            tr.appendChild(td_unit_sale_price);
            tr.appendChild(td_total);
            tr.appendChild(td_iva);
            tr.appendChild(td_options);

            tbody.appendChild(tr);
        });

        document.getElementById('btn_save').removeAttribute('hidden');
    }

    document.querySelector('[name="cash_received"]').addEventListener('keypress', (it) => {
        if (it.key === 'Enter') {
            it.preventDefault();
            cash_received = parseFloat(it.target.value);
            const cashChange = document.getElementById('cash_change');
            if (cash_received > 0) {
                cash_change = cash_received - total;
                cashChange.textContent = cash_change;
            }

        }
    });

    document.querySelector('[name="cash_received"]').addEventListener('input', (it) => {

        it.preventDefault();
        cash_received = parseFloat(it.target.value);
        const cashChange = document.getElementById('cash_change');
        if (cash_received > 0) {
            cash_change = cash_received - total;
            cashChange.textContent = cash_change;
        } else {
            cashChange.textContent = 0;
        }

    });

    /**
     * guardar la venta
     */
    document.getElementById('btn_save').addEventListener('click', () => {

        const swalCustomButton = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });
        
        removeClassInvalid();

        const input_cash_received = document.querySelector('[name="cash_received"]');
        cash_received = input_cash_received.value.trim();
        const cashChange = document.getElementById('cash_change');
        cash_change = parseFloat(cash_received) - total;
        cashChange.textContent = cash_change;
        payment_method = document.querySelector('[name="payment_method"]').value;


        let msm = '';

        if (!validListProducts()) {
            msm += '<li>Ingrese y valide los productos del listado</li>';
        }
        if (products.length > 0 && cash_received === '' || cash_received < total) {
            msm += '<li>Dinero insuficiente.</li>';
            document.querySelector('[name="cash_received"]').classList.add('is-invalid');

        }
        if (id_client === 0) {
            msm += '<li>Debe buscar el cliente.</li>'
            document.querySelector('[name="id_client"]').classList.add('is-invalid');
            document.getElementById('e_id_client').style.display = 'block';
        }


        if (msm === '') {
            swalCustomButton.fire({
                title: '¿Estás seguro de guardar la venta?',
                text: '',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Si, guardar',
                cancelButtonText: 'No, cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    saveSales();
                }
            }); 
            
        } else {
            
            swalCustomButton.fire({
                title: '¡Advertencia!',
                html: '<ul style="padding-left: 20px; list-style-position: inside; margin: 0;">' + msm + '</ul>',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: true,
                allowScapeKey: true
            });

        }
    });

    async function saveSales() {
        
        try {           

            const response = await fetch(
                'create/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({
                        products,
                        total,
                        cash_received,
                        cash_change,
                        id_client,
                        payment_method
                    })
                }
            );

            const data = await response.json();

            if (!data.success) {
                console.log('Error al guardar', data.errors);
                const swalCustomButton = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger"
                    },
                    buttonsStyling: false
                });
                swalCustomButton.fire({
                    title: '¡Advertencia!',
                    html: '<ul style="padding-left: 20px; list-style-position: inside; margin: 0;">Error al guardar la venta</ul>',
                    icon: 'error',
                    timer: 1500
                });

            } else {
                const swalCustomButton = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger"
                    },
                    buttonsStyling: false
                });
                swalCustomButton.fire({
                    title: '¡Advertencia!',
                    html: '<ul style="padding-left: 20px; list-style-position: inside; margin: 0;">Venta guardada</ul>',
                    icon: 'success',
                    timer: 1500
                });
                resetAll();
            }
        } catch (error) {
            console.log('Error ', error.error);
        }
    }

    function removeClassInvalid() {
        const inputs = document.querySelectorAll('input');
        inputs.forEach(it => {
            it.classList.remove('is-invalid');
        });

        document.getElementById('e_id_client').style.display = 'none';
    }

    /**
     * buscar productos por categoria o nombre del mismo
     */
    document.getElementById('btnSearchProductName').addEventListener('click', function () {
        fetch(`/sales/search-name-product/`)
            .then(response => response.text())
            .then(data => {
                document.getElementById('modalContainer').innerHTML = data;

                const modal = document.getElementById('modalSearchNameProduct');

                const bootstrapModal = new bootstrap.Modal(modal);
                bootstrapModal.show();
                modal.addEventListener('hidden.bs.modal', function () {
                    document.getElementById('modalContainer').innerHTML = '';
                });

            })
            .catch(error => console.error('Error:', error));
    });

    async function searchNameCategoryProduct(name_category_product) {
        try {
            const response = await fetch(`${searchNameCategory}?name_category_product=${encodeURIComponent(name_category_product)}`, {
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
                console.log(`Resultado error ${data}`)
            } else {
                loadDataSearch(data);
            }
        } catch (error) {

        }
    }

    /**
     * validar el stock antes de agregar al listado
     */
    function validStockProduct(data) {
        console.log('validando stock ', data);

        let isValid = true;
        if (data.stock_product === null || data.stock_product <= 0) {
            isValid = false;
            const swalCustomButton = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalCustomButton.fire({
                title: '¡Advertencia!',
                html: '<ul style="padding-left: 20px; list-style-position: inside; margin: 0;"> Stock insuficiente</ul>',
                icon: 'warning',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: true,
                allowScapeKey: true
            });
        }

        return isValid;
    }

    function loadDataSearch(data) {
        const tbody = document.querySelector('#table_products tbody');
        tbody.innerHTML = '';

        data.product_list.forEach(product => {
            const tr = document.createElement('tr');
            tr.dataset.product_id = product.code_product

            const th_id = document.createElement('th');
            th_id.textContent = product.id;

            const td_code_product = document.createElement('td')
            td_code_product.textContent = product.code_product

            const td_name_product = document.createElement('td');
            td_name_product.textContent = product.name_product;

            const td_name_category = document.createElement('td');
            td_name_category.textContent = product.name_category;

            const td_unit_sale_price = document.createElement('td');
            td_unit_sale_price.textContent = product.unit_sale_price;


            tr.appendChild(th_id);
            tr.appendChild(td_code_product);
            tr.appendChild(td_name_product);
            tr.appendChild(td_name_category);
            tr.appendChild(td_unit_sale_price);

            tbody.appendChild(tr);
        });

        tbody.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            if (row) {
                selectRow(row);
            }
        });
    }


    function selectRow(row) {
        if (rowSelected) {
            rowSelected.classList.remove('table-active')
        }

        row.classList.add('table-active');
        rowSelected = row;
    }

    /**
     * buscar un cliente
     */
    async function searchClient(numberId) {
        try {
            const response = await fetch(`${searchClientNumberId}?number_identification=${encodeURIComponent(numberId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                }
            });



            const data = await response.json();
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(data.message);
                }
                throw new Error('Error del servidor')
            } else {
                const divInfo = document.getElementById('info-client');
                id_client = data.id;
                divInfo.innerHTML = `
                            <div class="card mt-4">
                                <div class="card-body">
                                    <p class="card-text"><strong>Nombre:</strong> ${data.first_name} ${data.last_name}</p>
                                    <p class="card-text"><strong>Identificación:</strong> ${data.type_identification} ${data.number_identification}</p>
                                    <p class="card-text"><strong>Telefono:</strong> ${data.phone_number} - ${data.phone_number_aux}</p>
                                    <p class="card-text"><strong>Email:</strong> ${data.email_address} </p>
                                </div>
                            </div>`;
            }
        } catch (error) {
            console.log(`Fetch error: ${error.message}`);
            const swalCustomButton = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalCustomButton.fire({
                title: '¡Advertencia!',
                html: '<ul style="padding-left: 20px; list-style-position: inside; margin: 0;">' + error.message + '</ul>',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: true,
                allowScapeKey: true,
                timer: 1500
            });
        }
    }

    document.querySelector('input[name="id_client"]').addEventListener('keypress', (it) => {
        if (it.key === 'Enter') {
            it.preventDefault();
            searchClient(it.target.value)
        }
    });
    document.getElementById('btn_searchClient').addEventListener('click', () => {
        const numberID = document.querySelector('input[name="id_client"]').value;
        searchClient(numberID.trim());
    });

    function validInputs(form) {
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

    document.getElementById('btn_addClient').addEventListener('click', () => {
        addClient();
    });

    function deleteProduct(id) {
        const idx = products.findIndex(p => p.id === id);
        console.log(idx);

        const swalCustomButton = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        });
        swalCustomButton.fire({
            title: '¿Estás seguro?',
            text: 'Está operación es irreversible',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                if (idx !== -1) {
                    products.splice(idx, 1);
                    swalCustomButton.fire({
                        title: 'El producto fue eliminado.',
                        icon: 'success',
                        timer: 1500
                    });
                    updateTable(products);
                    if (products.length === 0) {
                        document.getElementById('btn_save').setAttribute('hidden', 'true');
                    }
                }

            }
        });
    }

    function validListProducts() {
        let isValid = true;
        if (!products.length > 0) {
            isValid = false;
        } else {

            products.forEach(it => {
                if (!it.id > 0) { isValid = false }
                if (it.name_product.trim() === '') { isValid = false }
                if (parseFloat(it.quantity) <= 0) { isValid = false }
                if (parseFloat(it.unit_sale_price) <= 0) { isValid = false }

            });
        }
        return isValid;
    }

    async function addClient() {
        const response = await fetch('/clients/create-client/');
        const modalContent = await response.text();

        document.getElementById('modalContainer').innerHTML = modalContent;

        const modal = new bootstrap.Modal(document.getElementById('modalClient'));
        modal.show()
    }
    document.getElementById('modalContainer').addEventListener('submit', async (e) => {
        if (e.target && e.target.id === 'formClient') {
            e.preventDefault();

            const form = e.target;
            const formData = new FormData(form);
            //const data_ = Object.fromEntries(formData.entries());

            let isValid = true;
            form.querySelectorAll('[required]').forEach(it => {
                if (!it.value.trim()) {
                    it.classList.add('is-invalid');
                    isValid = false;
                } else {
                    it.classList.remove('is-invalid', 'is-valid')
                }
            });

            try {
                if (isValid) {
                    const action = form.action;
                    const method = form.method;
                    const response = await fetch(action, {
                        method,
                        headers: {
                            //'Content-Type': 'application/json',
                            'X-CSRFToken': getCookie('csrftoken')
                        },
                        //body:JSON.stringify(data_)
                        body: formData
                    });

                    const data = await response.json();
                    if (data.success) {
                        const modal = document.getElementById('modalClient');
                        const bootstrapModal = bootstrap.Modal.getInstance(modal);
                        if (bootstrapModal) {
                            bootstrapModal.hide();
                        }

                        searchClient(data.number_id);

                        const swalCustomButton = Swal.mixin({
                            customClass: {
                                confirmButton: "btn btn-success",
                                cancelButton: "btn btn-danger"
                            },
                            buttonsStyling: false
                        });
                        swalCustomButton.fire({
                            html: '<ul style="padding-left: 20px; list-style-position: inside; margin: 0;">Cliente agregado</ul>',
                            icon: 'success',
                            timer: 1500
                        });
                    } else {
                        const errors = data.errors
                        Object.keys(errors).forEach(field => {
                            const fieldErrors = errors[field];
                            fieldErrors.forEach(_ => {
                                const input = document.querySelector('[name="' + field + '"]');
                                if (input) {
                                    input.classList.add('is-invalid');
                                }
                            });
                        });

                    }
                }

            } catch (error) {

            }



        }
    });

    function resetAll() {
        products = [];
        id_client = 0;
        rowSelected = null;
        subTotal = 0.0;
        discount = 0.0;
        valDiscount = 0.1;
        subTotalBase = 0.0;
        totalIva = 0.0;
        valIva = 0.0;
        total = 0.0;
        cash_received = 0.0;
        cash_change = 0.0;

        document.querySelector('input[name="id_client"]').value = '';
        document.querySelector('[name="cash_received"]').value = '';
        document.querySelector('[name="code_product"]').value = '';
        document.getElementById('span_subtotal').innerHTML = subTotal;
        document.getElementById('span_discount').textContent = discount;
        document.getElementById('span_subtotal_base').innerHTML = subTotalBase;
        document.getElementById('span_total_iva').innerHTML = totalIva;
        document.getElementById('span_total').innerHTML = total;
        document.getElementById('cash_change').innerHTML = cash_change;

        document.querySelector('#tableProducts tbody').innerHTML='';
        document.getElementById('info-client').innerHTML='';
    }

    function formatNumber(numero) {
        const partes = numero.toString().split('.');
        partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return partes.join(',');
    }

    function closeModal() {
        const modal = document.getElementById('modalSearchNameProduct');
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
            bootstrapModal.hide();
        }
    }


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