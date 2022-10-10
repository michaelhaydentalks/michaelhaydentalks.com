var theme;

if (!theme || theme.length < 1) {
    if (!localStorage.getItem('theme')) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    }
} else {
    localStorage.setItem('theme', theme);
}
theme = localStorage.getItem('theme');

function setThemeDark() {
    document.body.classList.remove("body-theme-override-light");
    document.body.classList.add("body-theme-override-dark");
    localStorage.setItem('theme', 'dark');

}

function setThemeLight() {
    document.body.classList.remove("body-theme-override-dark");
    document.body.classList.add("body-theme-override-light");
    localStorage.setItem('theme', 'light');

}

switch (theme) {
    case "auto":
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setThemeDark()
        } else {
            setThemeLight()
        }
        break;
    case "dark":
        setThemeDark()
        break;
    case "light":
        setThemeLight()
        break;
    default:
        setThemeLight()
}

// END THEME  




function toggleMenu() {
    var t = document.getElementById("menuToggle");
    var c = document.querySelectorAll(".menu-links-container")[0];



    if (c.classList.contains("stowed-menu")) {
        c.classList.add("open-menu")
        c.classList.remove("stowed-menu")
        c.style.display = "grid";
        t.querySelectorAll(".fa-times")[0].style.display = "";
        t.querySelectorAll(".fa-bars")[0].style.display = "none";
    } else {
        c.classList.add("stowed-menu")
        c.classList.remove("open-menu")
        c.style.display = "";
        t.querySelectorAll(".fa-times")[0].style.display = "none";
        t.querySelectorAll(".fa-bars")[0].style.display = "";
    }
}


if (document.getElementById("goToLibrary") && document.getElementById("carousel")) {
    document.getElementById("goToLibrary").removeAttribute("href");
    document.getElementById("goToLibrary").addEventListener("click", function () {

        scrollToCarousel();

    })
}

function scrollToCarousel() {
    var e = document.getElementById("carousel").offsetTop;
    window.scroll({
        top: e,
        behavior: 'smooth'
    });
}

document.getElementById("menuToggle").addEventListener("click", function () {
    toggleMenu();
})

document.getElementById("darkThemeAction").addEventListener("click", function () {
    setThemeDark()
})
document.getElementById("lightThemeAction").addEventListener("click", function () {
    setThemeLight()
})


for (i = 0; i < document.querySelectorAll(".accordian-trigger-span").length; i++) {
    if (
        document.querySelectorAll(".accordian-trigger-span")[i]
        && document.querySelectorAll(".accordian-payload")[i]
    ) {
        document.querySelectorAll(".accordian-trigger-span")[i].setAttribute("index", i);
        document.querySelectorAll(".accordian-trigger-span")[i].addEventListener("click", function () {
            var n = this.getAttribute("index");
            for (i = 0; i < document.querySelectorAll(".accordian-trigger-span").length; i++) {
                if (i != n) {
                    document.querySelectorAll(".accordian-trigger-span")[i].classList.remove("open")
                    document.querySelectorAll(".accordian-payload")[i].classList.remove("open")
                }
            }
            if (!n) {
                console.error("no n");
                return;
            }
            var p = document.querySelectorAll(".accordian-payload")[n];
            if (p.classList.contains("open")) {
                p.classList.remove("open")
            } else {
                p.classList.add("open");
                var e = p.offsetTop;
                window.scroll({
                    top: e,
                    behavior: 'smooth'
                });
            }
            if (this.classList.contains("open")) {
                this.classList.remove("open")
            } else {
                this.classList.add("open")
            }
        })
    }
}
document.querySelectorAll(".accordian-trigger-span.description")[0] && document.querySelectorAll(".accordian-payload.description")[0] && (
    document.querySelectorAll(".accordian-trigger-span.description")[0].classList.add("open"),
    document.querySelectorAll(".accordian-payload.description")[0].classList.add("open")
)
var loadActivityFlag;
var permanentlyStop;
var carouselCount = 0;
// function carouselInfinity(m) {
//     document.getElementById("carousel").classList.add("-loading");
//     document.querySelectorAll(".loadmorevideoscarousel").forEach(function(ele){ele.style.display = "none";})

//     m = m ? m : "next";
//     if (m == "next") {
//         carouselCount++
//     } else { carouselCount-- };

//     if (carouselCount < 0) { carouselCount = 0; }


//     var xhr = new XMLHttpRequest();

//     xhr.open("GET", "https://michaelhaydentalks.com/?c=" + carouselCount);

//     xhr.send();

//     xhr.onload = function () {
//         // Handle response
//         if (200 === xhr.status && xhr.responseText.length > 0) {
//             var data = xhr.responseText;
//             document.getElementById("carousel").innerHTML = document.getElementById("carousel").innerHTML + data;
//             document.getElementById("carousel").classList.remove("-loading");
//             loadActivityFlag = false;
//         } else {
//             permanentlyStop = true;
//             document.getElementById("carousel").classList.remove("-loading");
//         }

//     };

//     xhr.onprogress = function (event) {
//         // Handle progress
//     };

//     xhr.onerror = function () {
//         // Handle error
//         permanentlyStop = true;
//     };

// }


// window.addEventListener("scroll", function (e) {
//     if (document.getElementById("pageEnd").getBoundingClientRect().top-100 <= window.innerHeight && loadActivityFlag != true && permanentlyStop != true) {
//         loadActivityFlag = true;
//         carouselInfinity("next");
//     }
// })


function subscribe(e) {
    fetch('https://api.michaelhaydentalks.com/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: JSON.stringify({
            email: e,
            token: '83Lpg0cV1610645324Z2lz6mvm',
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("subscribeInfo").innerHTML = this.response
        })
        .catch((error) => {
            console.error("Error:", error);
        });




    // var xhr = new XMLHttpRequest();
    // xhr.open("POST", 'https://api.michaelhaydentalks.com/subscribe', true);

    // //Send the proper header information along with the request
    // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    // xhr.onload = function() { // Call a function when the state changes.
    //     if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
    //         // Request finished. Do processing here.
    //         document.getElementById("subscribeInfo").innerHTML = this.responseText;
    //         // document.getElementById("emailInput").value = "";
    //     }
    // }
    // xhr.send(encodeURI(`email=${e}&token=83Lpg0cV1610645324Z2lz6mvm`));
}

if (document.getElementById("subscribe") && document.getElementById("emailInput") && document.getElementById("subscribeInfo")) {
    var t = document.getElementById("subscribe");
    var i = document.getElementById("emailInput");
    i.value = "";
    var f = document.getElementById("subscribeInfo");
    window.addEventListener("keyup", function (e) {
        if (e.keyCode == 13 && i.value.length > 0) { subscribe(i.value) };
    });
    t.addEventListener("click", function () {
        if (String(i.value).length > 0) {
            if (document.getElementById("emailInput").value.indexOf("@") < 0 || document.getElementById("emailInput").value.indexOf(".") < 0) {
                f.innerHTML = "Please enter a valid email address.";
            } else {
                f.innerHTML = "One moment...";
                subscribe(document.getElementById("emailInput").value);
            }
        } else {
            f.innerHTML = "Please enter an email address in the field above.";
        }

    });
}



// PLAYBACK CONTROLS
if (localStorage) {

    if (!localStorage.getItem('autoplay')) {
        localStorage.setItem('autoplay', 'on');
    } else {
        if (document.querySelector("#autoplay")) { document.querySelector("#autoplay").setAttribute("class", localStorage.getItem('autoplay')); }
    }

    function autoplayOff() {
        localStorage.setItem('autoplay', 'off');
        if (document.querySelector("#autoplay")) { document.querySelector("#autoplay").setAttribute("class", "off"); }

    }

    function autoplayOn() {
        localStorage.setItem('autoplay', 'on');
        if (document.querySelector("#autoplay")) { document.querySelector("#autoplay").setAttribute("class", "on"); }

    }
    if (document.querySelector("#autoplay")) { document.querySelector("#autoplay").style.display = "block"; }
    if (document.querySelector(".hide-on-auto-local")) { document.querySelector(".hide-on-auto-local").style.display = "none"; }
}

var positionCheck;

countdownTime = 10;
if (document.getElementById("videoEmbed")) {
    if (document.querySelector('iframe')) {
        var iframe = document.querySelector('iframe');
        var player = new Vimeo.Player(iframe);
        positionCheck = setInterval(function () {
            player.getDuration().then(function (duration) {
                player.getCurrentTime().then(function (seconds) {
                    var s = seconds / duration;
                    if (!localStorage || localStorage.getItem('autoplay') === "on") {
                        if (s > 0.9) {
                            countdownNextVideo();
                            // clearInterval(positionCheck)
                            countdownTime = Math.ceil(duration - seconds);
                        }
                        else {
                            stopCountdown()

                        }
                    }
                })
            });
        }, 1000);
    }
    if (document.querySelector('video')) {
        const media = document.querySelector('video');
        media.addEventListener('timeupdate', function () {
            const media = document.querySelector('video');
            let s = media.currentTime / media.duration;
            if (!localStorage || localStorage.getItem('autoplay') === "on") {
                if (s > 0.9) {
                    countdownNextVideo();
                    // clearInterval(positionCheck)
                    countdownTime = Math.ceil(media.duration - media.currentTime);
                }
                else {
                    stopCountdown()

                }
            }
        })

    }

}

var countdownTimeout;
function countdownNextVideo() {
    countdownTimeout = true;
    var videoParent = document.querySelector(".watch-video");
    if (videoParent) {

        var n = document.querySelector("#autoplay").getAttribute("_next");
        var u = document.querySelector("#autoplay").getAttribute("_nexturl");

        if (!document.querySelector(".auto-next-ui")) {
            var d = document.createElement("div");
            d.setAttribute("onclick", "stopCountdown(1);")
            d.classList.add("auto-next-ui")
            d.innerHTML = `<span class="timeRem"></span><span>Next '${n}'</span><small>Tap to stay on current video</small>`;
            videoParent.append(d);
        }

        // countdownTimeout = setInterval(function () {
        document.querySelector(".timeRem").innerHTML = `${countdownTime}s`
        if (countdownTime <= 1) {
            document.querySelector(".timeRem").innerHTML = "0";
            // console.log("playing next video")
            countdownTimeout == true && (window.location = u)
        }
        countdownTime--
        // }, 1000)
    }
}
function stopCountdown(s) {
    s && (
        clearInterval(positionCheck)
    )
    countdownTimeout && (countdownTimeout = false)
    document.querySelector(".auto-next-ui") && (document.querySelector(".auto-next-ui").remove())
}

window.addEventListener("scroll", function () {
    stopCountdown(1);
})
document.querySelectorAll("a").forEach(function (e) {
    e.addEventListener("click", function () {
        try { stopCountdown(1) } catch (err) { }
    })
})
 // END PLAYBACK CONTROLS