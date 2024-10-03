function cambiarPorPagina() {
    const perPage = document.getElementById('per_page').value;
    window.location.href = '?per_page=' + perPage + '&page=1';
}
document.addEventListener('DOMContentLoaded', function() {
    const updatePaginationLinks = () => {
        const paginationLinks = document.querySelectorAll('.pagination a');
        paginationLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();

                const page = new URL(this.href).searchParams.get('page');
                const recordsPerPage = document.getElementById('records-per-page').value;
                fetch(`?page=${page}&records_per_page=${recordsPerPage}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(data => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(data, 'text/html');
                        //actualiza los datos
                        document.getElementById('table-body').innerHTML = doc.getElementById('table-body').innerHTML;
                        //actualiza la paginacion
                        document.getElementById('pagination').innerHTML = doc.getElementById('pagination').innerHTML;
                        document.getElementById('pagination-info').innerHTML = doc.getElementById('pagination-info').innerHTML;
                        document.getElementById('records-info').innerHTML = doc.getElementById('records-info').innerHTML;
                        updatePaginationLinks();
                    })
                    .catch(error => console.error('Error:', error));
            });
        });
    };

    const recordsPerPageSelect = document.getElementById('records-per-page');
    recordsPerPageSelect.addEventListener('change', function() {
        const recordsPerPage = this.value;
        const currentPage = document.querySelector('.pagination .active a').textContent;

        fetch(`?page=${currentPage}&records_per_page=${recordsPerPage}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');

                document.getElementById('table-body').innerHTML = doc.getElementById('table-body').innerHTML;
                document.getElementById('pagination').innerHTML = doc.getElementById('pagination').innerHTML;
                document.getElementById('pagination-info').innerHTML = doc.getElementById('pagination-info').innerHTML;
                document.getElementById('records-info').innerHTML = doc.getElementById('records-info').innerHTML;
                updatePaginationLinks();
            })
            .catch(error => console.error('Error:', error));
    });

    updatePaginationLinks();
});
