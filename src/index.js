import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let lightbox;
import Notiflix from 'notiflix';
const apiKey = '41083655-82ce4b08f1604d0cb0165a8b6';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;

searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const searchQuery = event.target.searchQuery.value.trim();

  if (searchQuery !== '') {
    clearGallery();
    page = 1;

    const images = await fetchImages(searchQuery, page);

    if (images.length > 0) {
      displayImages(images);
      showLoadMoreButton();
      showNotification(`Hooray! We found ${images.length} images.`);
    } else {
      showNotification(
        'Sorry, there are no images matching your search query. Please try again.',
        true
      );
    }
  }
});

loadMoreBtn.addEventListener('click', async function () {
  page++;
  const searchQuery = searchForm.searchQuery.value.trim();
  const images = await fetchImages(searchQuery, page);

  if (images.length > 0) {
    displayImages(images);
  } else {
    hideLoadMoreButton();
    showNotification(
      "We're sorry, but you've reached the end of search results.",
      true
    );
  }
});

async function fetchImages(query, page) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

function displayImages(images) {
  const fragment = document.createDocumentFragment();

  images.forEach(image => {
    const card = createImageCard(image);
    fragment.appendChild(card);
  });

  gallery.appendChild(fragment);
  refreshLightbox();
}

function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const a = document.createElement('a');
  a.href = image.largeImageURL;
  a.setAttribute('data-lightbox', 'photos');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  a.appendChild(img);
  const info = document.createElement('div');
  info.classList.add('info');

  const infoItems = ['Likes', 'Views', 'Comments', 'Downloads'];

  infoItems.forEach(item => {
    const p = document.createElement('p');
    p.classList.add('info-item');
    p.innerHTML = `<b>${item}</b>${image[item.toLowerCase()]}`;
    info.appendChild(p);
  });

  card.appendChild(a);
  card.appendChild(info);

  return card;
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
}

function showNotification(message, failure) {
  if (failure == true) {
    Notiflix.Notify.failure(message);
  } else {
    Notiflix.Notify.success(message);
  }
}

function refreshLightbox() {
  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.photo-card a');
  }
}
