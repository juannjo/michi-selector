const api = axios.create({
    baseURL: 'https://api.thecatapi.com/v1/',
});
api.defaults.headers.common['X-API-KEY'] = 'a89e49b0-f2b2-42bf-9f14-caa2341b7d1a';

const API_KEY = 'a89e49b0-f2b2-42bf-9f14-caa2341b7d1a';
const API_URL_RANDOM = `https://api.thecatapi.com/v1/images/search?limit=3`;
const API_URL_FAVOURITES = `https://api.thecatapi.com/v1/favourites`;
const API_URL_DELETE = (favourite_id) => `https://api.thecatapi.com/v1/favourites/${favourite_id}`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

let showedId = [];

const loadRandomMichis = async() => {
    showedId = []; 
    const res = await fetch(API_URL_RANDOM);    
    const data = await res.json();
    const spanError = document.getElementById('spanError');
    showedId.push(data[0].id)
    showedId.push(data[1].id)
    showedId.push(data[2].id)

    if(res.status !== 200) {
        spanError.textContent= `Hubo un error ${res.status}`;
    }
    else {
        const img = document.querySelector('#img1');
        const img2 = document.querySelector('#img2');
        const img3 = document.querySelector('#img3');
        img.src =  data[0].url
        img2.src =  data[1].url
        img3.src =  data[2].url
    }
}   
const loadFavouriteMichis = async() => {
    const res = await fetch(API_URL_FAVOURITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': API_KEY
        },
    });
    const data = await res.json();
    const spanError = document.getElementById('spanError');
    const favImage = document.getElementById('favorites');
    favImage.innerHTML = "";
    
    if(res.status !== 200) {
        spanError.textContent= `Hubo un error code: ${res.status}`;
    } 
    data.forEach(michi => {
        const article = document.createElement('article');
        article.innerHTML = `
                            <img src=${michi.image.url} class="rounded mx-auto d-block" alt="Fav Michi">
                            <button class="btn btn-outline-dark" onclick="deleteMichis(${michi.id})">Remove Michi from favourites</button>
                        `;
        article.setAttribute("id", `${michi.id}`);
        favImage.appendChild(article);
    });
}

const saveFavouriteMichis = async(id) => {
    const { data, status } = await api.post('/favourites', {
        image_id: id,
    });
    console.log(data)

    if(status !== 200) {
        console.log(`error: ${status} ${data.message}`)
    } else {
        console.log(data)
        loadFavouriteMichis(data.id);
    }
};

const deleteMichis = async(id) => {
    const res = await fetch(API_URL_DELETE(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': API_KEY
        },
    });
    const data = await res.json();
    const favorito = document.getElementById('favorites');

    if(res.status !== 200) {
        console.log(`Error ${res.status}`)
    } else {
        favorito.removeChild(document.getElementById(id));
        loadFavouriteMichis();
    }
    
};


const uploadMichiPhoto = async() => {
    const form = document.getElementById('uploadingForm');
    const formData = new FormData(form);
    console.log(formData.get('file'));

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'X-API-KEY': API_KEY,
        },
        body: formData,
    })
    const data = await res.json();

    if(res.status !== 201) {
        console.log(res.status)
    }
    else {
        saveFavouriteMichis(data.id);
        console.log("Foto Subida");
        console.log(data);
        console.log(res);
    }
};

const photoPreview = () => {
    const form = document.getElementById('uploadingForm');
    const reader = new FileReader();
    const file = document.getElementById('imageInput').files[0];
    const previewImg = document.createElement('img');

    reader.onloadend = () => previewImg.src = reader.result;
    
    file ? reader.readAsDataURL(file) : previewImg.src ="";
    
    form.appendChild(previewImg);
    console.log(imageInput.files[0]);
}
loadRandomMichis();
loadFavouriteMichis();





