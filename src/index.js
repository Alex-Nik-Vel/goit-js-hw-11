import './sass/main.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './js/refs';
import  fetchImages from './js/fetchImages';
import { imagesListMarkup } from './js/markup';



const { searchForm, gallery, loadMoreBtn, endImagesText } = refs;

const simpleLightBox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
  captionSelector: 'img',
});

searchForm.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onloadMoreBtnClick);

let searchData = '';
let page = 1;
// let currentHits = 0;

async function onFormSubmit(evt) {
  evt.preventDefault();

  searchData = evt.target.searchQuery.value;

  if (searchData.trim() === '') {
    Notify.info('Please, enter your query.');
    return;
  }
  loadMoreBtn.classList.add('is-hidden');
  endImagesText.classList.add('is-hidden');
  gallery.innerHTML = '';
  resetPage();

  try {
    console.log('searchData-index onForm', searchData);
    console.log('page-index onForm', page)
    
    const response = await fetchImages(searchData, page);
    const data = response.data;

    if (data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (page * 40 < data.totalHits) {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      imagesListMarkup(data.hits);
      simpleLightBox.refresh();
      loadMoreBtn.classList.remove('is-hidden');
      endImagesText.classList.add('is-hidden');
    } else if (page * 40 > data.totalHits) {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      imagesListMarkup(data.hits);
      simpleLightBox.refresh();
      onNotifyInfo();
    }
  } catch (error) {
    console.log(error);
  }
}

async function onloadMoreBtnClick() { loadMoreBtn.classList.add('is-hidden');
  increment();

  try {
    const response = await fetchImages(searchData, page);
    const data = response.data;

    imagesListMarkup(data.hits);
    simpleLightBox.refresh();
    scrollGallery();

    if (page * 40 > data.totalHits) {
      onNotifyInfo();   
  
    } else {
      loadMoreBtn.classList.remove('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}
 
function increment() {
  page += 1;
}

function resetPage() {
  page = 1;
}

// Notify
function onNotifyInfo() {
  loadMoreBtn.classList.add('is-hidden');
  endImagesText.classList.remove('is-hidden');
  Notify.info("We're sorry, but you've reached the end of search results.");
}


async function scrollGallery() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}






