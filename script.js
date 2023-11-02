const imagesContainer = document.querySelector('.gallery');
const modal = document.querySelector('.modal');
const form = document.querySelector('form');
const searchInput = document.querySelector('.search');
const loadMoreBtn = document.querySelector('.load-more');
let currentPage = 1;
const APIKEY = 'BG4YID4S5cqAl5olIIXVh44pmPwAk0r4kJdaiw5QXiCBb3SpWcM7KHzF';
const APIURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=15`;
// const SEARCHURL = 'https://api.pexels.com/v1/search?query=nature&per_page=15'
let searchValue = null;
fetchAPI(APIURL);

loadMoreBtn.addEventListener('click', () => {
    currentPage++;
    let APIURL = null;
    if(searchValue) {
        APIURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=${currentPage}&per_page=15`;
    } else {
        APIURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=15`;
    }
    fetchAPI(APIURL, false);
});

function fetchAPI(url,empty=true) {
    if(empty === true) {
        imagesContainer.innerHTML = '';
    }

    loadMoreBtn.innerHTML = '';
    const timer = setInterval(setLoading, 500);
    loadMoreBtn.disabled = true;
    fetch(url, {
        headers: {Authorization: APIKEY}
    }).then(res => res.json())
    .then(resData => {
        console.log(resData);
        fetchPhotos(resData.photos);
        clearInterval(timer);
        loadMoreBtn.innerHTML = 'load more';
        loadMoreBtn.disabled = false;
    }).catch(err => {
        alert(err);
        clearInterval(timer);
        loadMoreBtn.innerHTML = 'load more';
        loadMoreBtn.disabled = false;
        fetchAPI(APIURL);
    });
}


form.addEventListener('submit', (e) => {
    e.preventDefault();

    if(searchInput.value.trim() != '') {
        fetchAPI(`https://api.pexels.com/v1/search?query=${searchInput.value}&page=${currentPage}&per_page=15`)
        searchValue = searchInput.value;
        searchInput.value = '';
        console.log(searchValue);
    }

});


function fetchPhotos(photos) {
    photos.forEach(photo => {
        const {photographer, src} = photo;
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.innerHTML = `
            <img src="${src.portrait}">
            <div class="details">
                <div class="photographer">
                    <div><i class="fas fa-camera"></i></div>
                    <p>${photographer}</p>
                </div>
                <button class="download icon">
                    <i class="fas fa-cloud-download"></i>
                </button>
            </div>
        `

        const cardDownloadEl = cardEl.querySelector('.download');
        const cardimage = cardEl.querySelector('img').src;

        cardDownloadEl.addEventListener('click', () => {
            downloadImage(cardimage);
        });

        imagesContainer.appendChild(cardEl);

        cardEl.querySelector('img').addEventListener('click', () => {
            modal.classList.add('active');
            modal.innerHTML = `
                <div class="modal-close-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="photographer">
                            <div><i class="fas fa-camera"></i></div>
                            <p>${[photographer]}</p>
                        </div>
                        <div class="download-close">
                            <button class="download icon">
                                <i class="fas fa-cloud-download"></i>
                            </button>
                            <button class="modal-close icon">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <img src="${src.portrait}">
                </div>
            `
            modal.querySelector('.modal-close-overlay').addEventListener('click', closeModal);
            modal.querySelector('.modal-close').addEventListener('click', closeModal);
            const downloadEl = modal.querySelector('.download');
            const image = modal.querySelector('img').src;

            downloadEl.addEventListener('click', () => {
                downloadImage(image);
            })
            
            function closeModal() {
                modal.classList.remove('active');
            }
        })

    })
}


function setLoading() {
    loadMoreBtn.innerHTML += '.';
    if(loadMoreBtn.innerHTML.length > 3) {
        loadMoreBtn.innerHTML = '.';
    }
}

function downloadImage(image) {
    fetch(image)
    .then(res => res.blob())
    .then(file => {
        console.log(file);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = `image.${file.type.slice(file.type.indexOf('/') + 1)}`;
        a.click();
        console.log(a);
    })
}