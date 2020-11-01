var map;
const galleryInfo = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php"
let paintings = "https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery="
let paintURL = "https://res.cloudinary.com/funwebdev/image/upload/h_50/art/paintings/";
let sortArt;
let sortTitle;
let sortYear;
function initMap() { }
// Create Map object and display it after loading API data
function createMap(obj) {
    map = new google.maps.Map(document.querySelector('.galleryMap'), {
        center: { lat: +obj.Latitude, lng: +obj.Longitude },
        mapTypeId: 'satellite',
        zoom: 17
    });
    document.querySelector(".galleryMap").firstChild.nodeValue = "";
    document.querySelector(".galleryMap").style.display = "block";
    createMarker(map, obj.Latitude, obj.Longitude, obj.GalleryCity)
}

function createMarker(map, latitude, longitude, city) {
    let imageLatLong = { lat: latitude, lng: longitude };
    let marker = new google.maps.Marker({
        position: imageLatLong,
        title: city,
        map: map
    });
}

document.addEventListener("DOMContentLoaded", function () {
    getData(galleryInfo)
        .then(resolves => {
            // Display gallery list (left div)
            displayGalleryList(resolves);
        }).catch(err => { console.warn(err) });
})

function displayGalleryList(data) {
    //Hides the loader div
    document.querySelector(".loader").style.display = "none";

    let ulGallery = document.querySelector(".galleryList ul");
    document.querySelector(".galleryList").firstChild.nodeValue = "";
    // Display galleries on left div
    data.forEach(gallery => {
        const liElem = document.createElement("li");
        liElem.textContent = `${gallery.GalleryName}`;
        ulGallery.appendChild(liElem);
    });
    // Set main element to display as grid to allow proper inner div positioning. 
    document.querySelector("main").style.display = "grid";
    // Create event listener for gallery list when clicked. 
    document.querySelector('main .galleryList').addEventListener('click', function (e) {
        // Verify user has clicked on the right list element
        if (e.target && e.target.nodeName.toLowerCase() == "li") {
            // Resets all font colors to black when a user click a gallery name
            let resetColor = document.querySelectorAll(".galleryList li");
            for (let r of resetColor) {
                r.style.color = "Black";
            }
            // Change font color of the gallery clicked. 
            e.target.style.color = "white";
            // finds the gallery's information and and fetched the information. 
            const filterGallery = data.find(g => g.GalleryName == `${e.target.textContent}`);
            // displays gallery information and Map location
            displayGalleryInfo(filterGallery)
            document.querySelector(".loader").style.display = "none";

            getPaintData(`${paintings}${filterGallery.GalleryID}`)
                .then(resolve1 => {
                    displayPaintingList(resolve1, filterGallery.GalleryID);
                    sortArt = true;
                    sortTitle = false;
                    sortYear = false;
                }).catch(err => { console.warn(err) });

        }
    });
}

// Fetched gallery data from galleryInfo API
async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return new Promise((resolve, rejected) => {
        const sortedData = data.sort((a, b) => {
            return a.GalleryName < b.GalleryName ? -1 : 1;
        });
        setTimeout(() => resolve(sortedData), 500);
    })
}

// Fetches paint data from painting API + gallery ID
async function getPaintData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return new Promise((resolve, rejected) => {
        const sortedData = data.sort((a, b) => {
            return a.LastName < b.LastName ? -1 : 1;
        });
        setTimeout(() => resolve(sortedData), 0);
    })
}


// Sort paintings by Artist
async function sortPaintArt(obj) {
    const response = await fetch(obj);
    const data = await response.json();
    return new Promise((resolve, rejected) => {
        if (sortArt) {
            sortArt = false;
            sortedArt = data.sort((a, b) => {
                return a.LastName < b.LastName ? -1 : 1;
            });
        } else {
            sortArt = true;
            sortedArt = data.sort((a, b) => {
                return a.LastName < b.LastName ? 1 : -1;
            });
        }
        setTimeout(() => resolve(sortedArt), 0);
    })
}


// Sort paintings by Title
function sortPaintTitle(obj) {
    if (sortTitle) {
        sortedTitle = obj.sort((a, b) => {
            return a.Title < b.Title ? -1 : 1;
        });
        sortTitle = false;
    } else {
        sortedTitle = obj.sort((a, b) => {
            return a.Title < b.Title ? 1 : -1;
        });
        sortTitle = true;
    }
    displayPaintingList(sortedTitle);
}

// Sort paintings by year
function sortPaintYear(obj) {
    if (sortYear) {
        sortedYear = obj.sort((a, b) => {
            return a.YearOfWork < b.YearOfWork ? -1 : 1;
        });
        sortYear = false;
    } else {
        sortedYear = obj.sort((a, b) => {
            return a.YearOfWork < b.YearOfWork ? 1 : -1;
        });
        sortYear = true;
    }
    displayPaintingList(sortedYear);
}

// Display gallery's information.
function displayGalleryInfo(obj) {
    document.querySelector(".galleryInfo").firstChild.nodeValue = "";
    document.querySelector(" #galleryName").textContent = `${obj.GalleryName}`;
    document.querySelector(" #galleryNative").textContent = `${obj.GalleryName}`;
    document.querySelector(" #galleryCity").textContent = `${obj.GalleryCity}`;
    document.querySelector(" #galleryAddress").textContent = `${obj.GalleryAddress}`;
    document.querySelector(" #galleryCountry").textContent = `${obj.GalleryCountry}`;
    document.querySelector(" #galleryHome").setAttribute('href', `${obj.GalleryWebSite}`);
    document.querySelector(" #galleryHome").textContent = `${obj.GalleryWebSite}`;
    document.querySelector(".galleryInfo section").style.display = "grid";
    createMap(obj);

}

// Display the list of paintings of the gallery
function displayPaintingList(obj, id) {
    let paintDiv = document.querySelector(".paintingList");
    paintDiv.innerHTML = `<h2>Paintings</h2>
        <div><label></label><label>Artist</label><label>Title</label><label>Year</label></div>
        <ul></ul>`;
    let paintUL = document.querySelector(".paintingList ul");
    paintUL.innerHTML = "";
    obj.forEach(gallery => {
        const liElem = document.createElement("li");
        const liImg = document.createElement("img");
        const divArtist = document.createElement("span");
        const divTitle = document.createElement("span");
        divTitle.setAttribute("id", "pTitle");
        const divYear = document.createElement("span");
        liImg.src = `${paintURL}${gallery.ImageFileName}`
        liImg.setAttribute("title", `${gallery.Title}`);
        liImg.setAttribute("alt", `${gallery.Title}`);
        liElem.appendChild(liImg)

        divArtist.textContent = `${gallery.LastName}`;
        liElem.appendChild(divArtist);

        divTitle.textContent = `${gallery.Title}`;
        liElem.appendChild(divTitle);

        divYear.textContent = `${gallery.YearOfWork}`;
        liElem.appendChild(divYear);
        paintUL.appendChild(liElem);
    });
/* 
    document.querySelector('main .paintingList').addEventListener('click', function (e) {
        if (e.target && e.target.nodeName.toLowerCase() == "label") {
            let sortBy = e.target.textContent;
            switch (sortBy) {
                case "Artist":
                    console.log(obj);
                    sortPaintArt(`${paintings}${id}`)
                    .then(resolve => {
                        displayPaintingList(resolve);
                    })
                    break;
                case "Title":
                    console.log(obj);
                    //sortPaintArt(gallery);
                    break;
                default:
                    getPaintData(`${paintings}${obj.GalleryID}`)
                    break;
            }
        }
    });
     */
}
