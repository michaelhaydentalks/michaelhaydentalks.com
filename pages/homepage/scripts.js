function getCarouselRowCapacity(){
  let carousel = document.getElementById("carousel")
  let tiles = carousel.querySelectorAll("a")
  let primaryRow = false
  let itemInPrimaryCount = 0
  for(const tile of tiles){
    let rowNow = tile.getBoundingClientRect().top
    if(primaryRow!==false && primaryRow !== rowNow){
      break
    }
    primaryRow = rowNow
    itemInPrimaryCount++
  }
  return itemInPrimaryCount
}
// window.addEventListener("resize", ()=>{window.rowLength = getCarouselRowCapacity()})

if (document.getElementById("loadMoreBtn")) {
  fetch('/src/json/videos.json', {
    method: 'GET',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      window.videos = data;
      // prepareButton
      if (window.videos.length > getCarouselRowCapacity()) {
        window.videoCount = document.querySelectorAll("#carousel>a").length//getCarouselRowCapacity();
        let num = window.videoCount/getCarouselRowCapacity()
        if(num % 1 != 0){
          carousel(1)
        }
        document.getElementById("loadMoreBtn").addEventListener('click', carousel)
        document.getElementById("loadMoreBtn").innerHTML = "More meditations"
        window.addEventListener("scroll", carouselWatch)
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function carouselWatch() {
  if (document.getElementById("pageEnd").getBoundingClientRect().top - 100 <= window.innerHeight) {
    carousel();
  }
}

function carousel(balance) {
  let increaseBy = balance===1 ? getCarouselRowCapacity() - (window.videoCount%getCarouselRowCapacity()) : getCarouselRowCapacity()
  for (i = window.videoCount - 1; i < window.videoCount + (increaseBy-1); i++) {
    let link = document.createElement('a')
    if (window.videos[i]) {
      link.href = "/video/"+window.videos[i].url
      let thumbnail = window.videos[i].thumbnail
      let name = window.videos[i].name
      let created = window.videos[i].created
      link.innerHTML = `<i style="background-image:url(${thumbnail});" loading="lazy"></i><h2>${name}</h2><span class="created">${created}</span></a>`;
      document.getElementById("carousel").append(link)
    }
    else {
      document.getElementById("loadMoreBtn").removeEventListener('click', carousel)
      window.removeEventListener("scroll", carouselWatch)
      document.getElementById("loadMoreBtn").innerHTML = "End of list"
      document.getElementById("loadMoreBtn").classList.remove("btn-pri")
      break
    }
  }
  window.videoCount = window.videoCount + getCarouselRowCapacity();// > window.videoCount? window.videoCount : window.videoCount + 6;
}