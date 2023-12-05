import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.getElementById('search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return;
  }

  clearGallery();
  page = 1;

  try {
    const images = await fetchImages(searchQuery, page);
    console.log(images);
    displayImages(images);
    showLoadMoreButton(images.length);
    //  showNotification(`Hooray! We found ${images.length} images.`);
  } catch (error) {
    console.error('Error fetching images:', error);
    showNotification('Oops! Something went wrong. Please try again later.');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page++;

  const searchQuery = searchForm.elements.searchQuery.value.trim();

  try {
    const images = await fetchImages(searchQuery, page);
    displayImages(images);
    showLoadMoreButton(images.length);
    smoothScroll();
  } catch (error) {
    console.error('Error fetching more images:', error);
    showNotification('Oops! Something went wrong. Please try again later.');
  }
});

function fetchImages(query, currentPage) {
  const apiKey = '41083655-82ce4b08f1604d0cb0165a8b6';
  const perPage = 40;

  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${perPage}`;

  return axios
    .get(apiUrl)
    .then(response => response.data.hits)
    .catch(error => {
      throw error;
    });
}

function displayImages(images) {
  const fragment = document.createDocumentFragment();

  images.forEach(image => {
    const card = createImageCard(image);
    fragment.appendChild(card);
  });

  galleryContainer.appendChild(fragment);

  // Initialize SimpleLightbox for new images
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  lightbox.refresh();
}

function createImageCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const infoItems = ['Likes', 'Views', 'Comments', 'Downloads'];

  infoItems.forEach(item => {
    const p = document.createElement('p');
    p.classList.add('info-item');
    p.innerHTML = `<b>${item}</b>${image[item.toLowerCase()] || 0}`;
    info.appendChild(p);
  });

  card.appendChild(img);
  card.appendChild(info);

  return card;
}

function clearGallery() {
  galleryContainer.innerHTML = '';
}

function showLoadMoreButton(imagesCount) {
  loadMoreBtn.style.display = imagesCount === 0 ? 'none' : 'block';
}

function smoothScroll() {
  const { height: cardHeight } =
    galleryContainer.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

//function showNotification(message) {
// notiflix.Notify.success(message);
//}
