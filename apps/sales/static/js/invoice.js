
let products = [];
let rowSelected = null;


document.addEventListener('DOMContentLoaded', function () {
    const modalContainer = document.getElementById('modalContainer');

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
        input.focus(); // Da foco al input
      });

    modalContainer.addEventListener('keydown', (e) => {
        if (e.target.id === 'name_product' && e.key === 'Enter') {
            e.preventDefault();
            searchNameCategoryProduct(e.target.value);
        }

        const tablaBody = document.querySelector('#table_products tbody');
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            const filas = Array.from(tablaBody.rows); // Convertir las filas en un array
            let indiceSeleccionado = filas.indexOf(rowSelected);

            // Moverse hacia abajo
            if (e.key === 'ArrowDown') {
                indiceSeleccionado = Math.min(filas.length - 1, indiceSeleccionado + 1);
            }
            // Moverse hacia arriba
            if (e.key === 'ArrowUp') {
                indiceSeleccionado = Math.max(0, indiceSeleccionado - 1);
            }

            // Seleccionar la fila correspondiente
            selectRow(filas[indiceSeleccionado]);
        }

    
        if (e.key === 'Enter' && rowSelected) {
            // Obtener el data-id de la fila seleccionada
            const code_product = rowSelected.dataset.product_id.trim();
            searchProductByCode(code_product);
            rowSelected = null;
            closeModal();
        }
    });

    document.querySelector('input[name="code_product"]').addEventListener('keypress', (it) => {
        if (it.key === 'Enter') {
            it.preventDefault();
            searchProductByCode(it.target.value)
        }
    });

    document.getElementById('btnSearchProduct').addEventListener('click', () => {
        var codeProductInput = document.querySelector('input[name="code_product"]');
        var code_product = codeProductInput.value.trim();
        searchProductByCode(code_product)
    })

    function validExistsList(data) {
        const product = products.find(p => p.id === data.id);
        if (product) {
            product.quantity += 1;
        } else {
            products.push({
                'id': data.id,
                'name_product': data.name_product,
                'quantity': 1,
                'unit_sale_price': data.unit_sale_price
            });
        }
        updateTable(products);
    }

    function updateTable(products_up) {

        const tbody = document.querySelector('#tableProducts tbody');
        tbody.innerHTML = '';
        let totals = 0.0;

        products_up.forEach(product => {
            const tr = document.createElement('tr');

            const th_id = document.createElement('th');
            th_id.textContent = product.id;

            const td_name_product = document.createElement('td');
            td_name_product.textContent = product.name_product;

            const td_quantity = document.createElement('td');
            td_quantity.textContent = product.quantity;

            const td_unit_sale_price = document.createElement('td');
            td_unit_sale_price.textContent = formatNumber(product.unit_sale_price);

            const td_total = document.createElement('td');
            const totalSale = parseFloat(product.unit_sale_price) * parseFloat(product.quantity);
            totals += totalSale
            document.getElementById('span_subtotal').innerHTML = formatNumber(totals);
            td_total.textContent = formatNumber(totalSale);

            const td_iva = document.createElement('td');
            td_iva.textContent = '19%';


            const td_options = document.createElement('td');

            const btn_edit = document.createElement('button');
            btn_edit.textContent = 'Editar';
            btn_edit.className = 'btn btn-primary';
            //btn_edit.addEventListener('click', () => editOrder(product.id));
            td_options.appendChild(btn_edit);

            const btn_delete = document.createElement('button');
            btn_delete.textContent = 'Eliminar';
            btn_delete.className = 'btn btn-danger';
            //btn_delete.addEventListener('click', () => deleteOrder(product.id));
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

    }

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
        //validar funcion para buscar producto
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