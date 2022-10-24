// функция fetchImages -- делает HTTP - запрос 
// на ресурс name и возвращает промис с массивом картинок - результатом запроса

import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '30755314-0b51072df48ae455376dac9e9';
// const PER_PAGE = 40;



async function fetchImages(searchData, page) {
  console.log('searchData===', searchData)

  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchData}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40}`,
  );
  return response;
}

export default fetchImages;
