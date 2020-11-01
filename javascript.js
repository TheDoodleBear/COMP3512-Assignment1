var map;
const galleryInfo = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php"
var paintings = "https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery="
let paintURL = "https://res.cloudinary.com/funwebdev/image/upload/h_50/art/paintings/";
let sortArt;
let sortTitle;
let sortYear;
function initMap() { }

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

function displayGalleryList(data) {
    document.querySelector(".loader").style.display = "none";
    let ulGallery = document.querySelector(".galleryList ul");
    document.querySelector(".galleryList").firstChild.nodeValue = "";
    data.forEach(gallery => {
        const liElem = document.createElement("li");
        liElem.textContent = `${gallery.GalleryName}`;
        ulGallery.appendChild(liElem);
    });
    document.querySelector("main").style.display = "grid";
    document.querySelector('main .galleryList').addEventListener('click', function (e) {
        // Verify user has clicked on the right list element
        if (e.target && e.target.nodeName.toLowerCase() == "li") {
            let resetColor = document.querySelectorAll(".galleryList li");
            for (let r of resetColor) {
                r.style.color = "Black";
            }
            e.target.style.color = "white";
            const filterGallery = data.find(g => g.GalleryName == `${e.target.textContent}`);
            displayGalleryInfo(filterGallery)
            document.querySelector(".loader").style.display = "none";
            let paintAPI = `${paintings}${filterGallery.GalleryID}`;
            getPaintData(paintAPI)
                .then(resolve1 => {
                    displayPaintingList(resolve1);
                    document.querySelector('main .paintingList').addEventListener('click', function (e) {
                        if (e.target && e.target.nodeName.toLowerCase() == "label") {
                            let sortBy = e.target.textContent;
                            if (sortBy == "Artist") {
                                sortPaintArt(resolve1);
                            } else if (sortBy == "Title") {
                                sortPaintTitle(resolve1);
                            } else if (sortBy == "Year") {
                                sortPaintYear(resolve1);
                            }
                        }
                    });
                }).catch(err => { console.warn(err) });

        }
    });
}

async function getPaintData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return new Promise((resolve, rejected) => {
        const sortedData = data.sort((a, b) => {
            return a.LastName < b.LastName ? -1 : 1;
        });
        setTimeout(() => resolve(sortedData), 500);
    })
}

function sortPaintArt(obj) {
    if (sortArt) {
        sortArt = false;
        sortedArt = obj.sort((a, b) => {
            return a.LastName < b.LastName ? -1 : 1;
        });
    } else {
        sortArt = true;
        sortedArt = obj.sort((a, b) => {
            return a.LastName < b.LastName ? 1 : -1;
        });
    }
    console.log(sortArt);
    console.log(sortedArt);
    displayPaintingList(sortedArt);
}

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
    console.log(sortTitle);
    console.log(sortedTitle);
    displayPaintingList(sortedTitle);
}

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
    console.log(sortYear);
    console.log(sortedYear);
    displayPaintingList(sortedYear);
}


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

function displayPaintingList(obj) {
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

}

/*
 document.querySelector('button').addEventListener('click', function() {
    toggle();
})

let expanded = false;

function toggle() {
    let container = document.querySelector("#pList");
    container.classList.toggle('expand');
    container.classList.toggle('right-box');

}
 */