var map;
const galleryInfo = "https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php"
let paintings = "https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery="
let paintURL50 = "https://res.cloudinary.com/funwebdev/image/upload/h_50/art/paintings/";
let paintURL200 = "https://res.cloudinary.com/funwebdev/image/upload/w_500/art/paintings/";
let sortArt;
let sortTitle;
let sortYear;

function initMap() {}
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

// Create Map marker and display it after loading API data
function createMarker(map, latitude, longitude, city) {
    let imageLatLong = { lat: latitude, lng: longitude };
    let marker = new google.maps.Marker({
        position: imageLatLong,
        title: city,
        map: map
    });
}

// Wait for document to load before processing
document.addEventListener("DOMContentLoaded", function() {
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
    document.querySelector("section").style.display = "grid";
    // Create event listener for gallery list when clicked. 
    document.querySelector('main .galleryList').addEventListener('click', function(e) {
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

// Display gallery's information.
function displayGalleryInfo(obj) {
    document.querySelector(".galleryInfo").firstChild.nodeValue = "";
    document.querySelector(".galleryInfo #galleryName").textContent = `${obj.GalleryName}`;
    document.querySelector(".galleryInfo #galleryNative").textContent = `${obj.GalleryName}`;
    document.querySelector(".galleryInfo #galleryCity").textContent = `${obj.GalleryCity}`;
    document.querySelector(".galleryInfo #galleryAddress").textContent = `${obj.GalleryAddress}`;
    document.querySelector(".galleryInfo #galleryCountry").textContent = `${obj.GalleryCountry}`;
    document.querySelector(".galleryInfo #galleryHome").setAttribute('href', `${obj.GalleryWebSite}`);
    document.querySelector(".galleryInfo #galleryHome").textContent = `${obj.GalleryWebSite}`;
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
        divTitle.setAttribute("class", "pTitle");
        const divYear = document.createElement("span");
        liImg.src = `${paintURL50}${gallery.ImageFileName}`
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

    document.querySelector('.paintingList ul').addEventListener('click', function(e) {
        if (e.target && e.target.nodeName.toLowerCase() == "span") {
            const findPaint = obj.find(p => p.Title == `${e.target.textContent}`);
            displaySingleView(findPaint);
        }
    });
}

function displaySingleView(object) {
    console.log(object.Title);
    let sView = document.querySelector("#singleView");
    let hideBox = document.querySelectorAll("section .box");
    document.querySelector(".paintInfo img").src = '';
    // Create Painting Image;
    document.querySelector(".paintInfo img").src = `${paintURL200}${object.ImageFileName}`;
    // Create Painting Title
    document.querySelector(".paintInfo #Title").textContent = `${object.Title}`
        // Create Artist Name
    document.querySelector(".paintInfo #paintArtist").textContent = `${object.FirstName} ${object.LastName}`;
    document.querySelector(".paintInfo #paintCity").textContent = `${object.GalleryCity}`;
    document.querySelector(".paintInfo #paintLink").textContent = `${object.MuseumLink}`;
    document.querySelector(".paintInfo #paintLink").setAttribute('href', `${object.MuseumLink}`);
    document.querySelector(".paintInfo #paintCopyR").textContent = `${object.CopyrightText}`;
    document.querySelector(".paintInfo #paintYOW").textContent = `${object.YearOfWork}`;;
    document.querySelector(".paintInfo #paintH").textContent = `${object.Height}`;;
    document.querySelector(".paintInfo #paintD").textContent = `${object.Width}`;;
    document.querySelector(".paintInfo #paintMedium").textContent = `${object.Medium}`;;
    document.querySelector(".paintInfo #paintDes").textContent = `${object.Description}`;;
    //Create Gallery Name

    hideBox.forEach(hide => {
        hide.style.visibility = "hidden";
    })
    sView.style.visibility = "visible";
    document.querySelector(".paintInfo button").addEventListener('click', function() {
        hideBox.forEach(hide => {
            hide.style.visibility = "visible";
        })
        sView.style.visibility = "hidden";
    })
}