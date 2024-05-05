
const itemsList = document.getElementById('itemsList');
const pagination = document.querySelector('.pagination');



 function fetchData(pageNumber) {
    const url = `https://appmusicwebapinet8.azurewebsites.net/api/csMusicGroups/Read?flat=true&pageNr=${pageNumber}&pageSize=10`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            jsonData = data;
            displayItems(jsonData);
            setupPagination(jsonData);     
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function displayItems(data) {
    itemsList.innerHTML = '';
    data.pageItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('col-md-12', 'themed-grid-col');
        div.innerHTML = `
        <a href="view-details-of-music.html?groupId=${item.name}&genre=${item.strGenre}&establishedYear=${item.establishedYear}">${item.name}
            Established Year: ${item.establishedYear}
            Genre: ${item.strGenre}</a>
            
        `;
        
        itemsList.appendChild(div);
        
    });
    
}



function setupPagination(data) {
    pagination.innerHTML = '';
    const pageCount = data.pageCount;
    const maxPagesToShow = 10; 
    const currentPage = data.pageNr;
    const startPage = Math.max(currentPage - Math.floor(maxPagesToShow), 1);
    const endPage = Math.min(startPage + maxPagesToShow -1, pageCount);

    // den skapar en knap för föregående sida
    if (currentPage > 1) {
        pagination.appendChild(createPageLink('«', currentPage - 1));
    }

    
    for (let i = startPage; i <= endPage; i++) {
        pagination.appendChild(createPageLink(i, i));
    }

    // den skapar en knapp för nästa sida
    if (currentPage < pageCount) {
        pagination.appendChild(createPageLink('»', currentPage + 1));
    }
}

function createPageLink(text, pageNumber) {
    const link = document.createElement('a');
    link.classList.add('page-link');
    link.href = '#';
    link.textContent = text;
    link.addEventListener('click', () => {
        fetchData(pageNumber);
    });
    const listItem = document.createElement('li');
    listItem.classList.add('page-item');
    listItem.appendChild(link);
    return listItem;
}


     document.addEventListener('DOMContentLoaded', function() {
    
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('groupId');

    
    const musicDetailsDiv = document.getElementById('musicDetails');
    const h3 = document.createElement('h3');
    const pEstablishedYear = document.createElement('p');
    const pGenre = document.createElement('p');

   
    h3.textContent = `Group Name: ${groupId}`; 
    pEstablishedYear.textContent = `Established Year: ${urlParams.get('establishedYear')}`;
    pGenre.textContent = `Genre: ${urlParams.get('genre')}`;

    
    musicDetailsDiv.appendChild(h3);
    musicDetailsDiv.appendChild(pEstablishedYear);
    musicDetailsDiv.appendChild(pGenre);
});


fetchData(1);
