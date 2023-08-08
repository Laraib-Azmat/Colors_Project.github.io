//DOM

const colorDiv = document.querySelectorAll(".color");
const genrateColor = document.querySelector(".genrate-button");
const sliders = document.querySelectorAll("input[type=range]");
let initialColors;
const copys = document.querySelectorAll(".copy");
const copyPopup = document.querySelector(".copy-popup");
const copyText = document.querySelector(".copy-popup-text");
const adjustButton = document.querySelectorAll(".adjust-button");
const popup = document.querySelectorAll(".pop-up");
const close = document.querySelectorAll(".close");
const lockButton = document.querySelectorAll(".lock-button");
let savePalette = [];

//Event Listners

genrateColor.addEventListener("click", randomColor);
sliders.forEach(slider => {
    slider.addEventListener("input", hslColor);
});

colorDiv.forEach((div, index) => {
    div.addEventListener("change", () => {
        UpdateText(index);
    });
});

copys.forEach(copy => {
    copy.addEventListener("click", () => {
        copyPopup.classList.add("active-popup");
        copyText.classList.add("active-text");
        copyToClipboard(copy);
    });
});
copyPopup.addEventListener("transitionend", () => {
    copyPopup.classList.remove("active-popup");
    copyText.classList.remove("active-text");
});

adjustButton.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        popup[index].classList.toggle("adjust-active");
    });
});

close.forEach((clos, index) => {
    clos.addEventListener("click", () => {
        popup[index].classList.remove("adjust-active"); 
    });
});

lockButton.forEach(lock => {
    lock.addEventListener("click", () => {
        const div = lock.parentElement;
        console.log(div);
        div.classList.toggle("locked");
        if (div.classList.contains("locked")) {
            lock.innerHTML = `<i class="fa-solid fa-lock"></i>`;
        } else {
            lock.innerHTML = `<i class="fa-solid fa-lock-open"></i>`;
        }
    });
});

//Functions

             // Genrating a random color

function randomColor(){
    initialColors=[];

    colorDiv.forEach(div => {
        const hexColor = chroma.random();
        const hexText = div.children[0];
        if (div.classList.contains("locked")) {
            initialColors.push(hexText.innerText);
            return;
        } else {

            initialColors.push(hexColor);
            div.style.backgroundColor = hexColor;
            hexText.innerText = hexColor;

            checkColorContrast(hexColor, hexText);

            //color to the input sliders
            const sliders = div.querySelectorAll("input");
            console.log(sliders);
       
            const hue = sliders[0];
            const brightness = sliders[1];
            const saturation = sliders[2];
       
            colorSliders(hexColor, hue, brightness, saturation);
            const icons = div.querySelectorAll(".icons");
            for (icon of icons) {
                checkColorContrast(hexColor, icon);
            }
        }
    });

    updateSlider();
}
   
          //check color and text contrast

function checkColorContrast(color, text) {
    const luminance = chroma(color).luminance();

    if (luminance > 0.5) {
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
}      
    
            // Color  pop-up slider
function colorSliders(color, hue, brightness, saturation) {
    //set Saturation

    const noSat = color.set('hsl.s', 0);
    const fullSat = color.set('hsl.s', 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;

    //set Brightness

    const midBright = color.set('hsl.l', 0.5);
    const scaleBright = chroma.scale(['black', midBright, 'white']);
    brightness.style.background = `linear-gradient(to right, ${scaleBright(0)},${scaleBright(0.5)}, ${scaleBright(1)})`;
//set hue
    hue.style.background = `linear-gradient(to right,  rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}


function hslColor(e) {
    const index = e.target.parentElement.getAttribute("data");
    const bgColor = initialColors[index]
    const sliders = e.target.parentElement.querySelectorAll("input[type=range]");

    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    let color = chroma(bgColor).set('hsl.h', hue.value)
        .set('hsl.s', saturation.value)
        .set('hsl.l', brightness.value);
    colorDiv[index].style.background = color;

    colorSliders(color, hue, saturation, brightness);
}

function UpdateText(index){
    const color = colorDiv[index].style.backgroundColor;
    const text = colorDiv[index].querySelector("h2");
    text.innerText = chroma(color);
    checkColorContrast(color, text);

    //contrast of icons
    const icons = colorDiv[index].querySelectorAll(".icons");
    for (icon of icons) {
        checkColorContrast(color, icon);
    }

}

function updateSlider() {
    sliders.forEach(slider => {
        if (slider.name === "hue") {
            const index = slider.parentElement.getAttribute("data");
            const hueValue = chroma(initialColors[index]).hsl()[0];
            slider.value = Math.floor(hueValue);
      } 
        if (slider.name === "saturation") {
            const index = slider.parentElement.getAttribute("data");
            const satValue = chroma(initialColors[index]).hsl()[1];
            slider.value = Math.floor(satValue * 100)/100;
      } 
        if (slider.name === "brightness") {
            const index = slider.parentElement.getAttribute("data");
            const brightValue = chroma(initialColors[index]).hsl()[2];
            slider.value = Math.floor(brightValue*100)/100;
      } 
    });
}
//copy to clipboard

function copyToClipboard(text) {
    const e1 = document.createElement("textarea");
    e1.value = text.innerText;
    document.body.appendChild(e1);
    e1.select();
    document.execCommand("copy");
    document.body.removeChild(e1);
}




//Local Storage and Save , library popups

const save = document.querySelector(".save");
const savepopup = document.querySelector(".save-popup");
const saveText = document.querySelector(".save-popup-text");
const saveClose = document.querySelector(".close-save");
const saveGenrate = document.querySelector(".save-genrate");
const librarybtn = document.querySelector(".library-button");
const libraryPopup = document.querySelector(".library-popup");
const libraryText = document.querySelector(".library-popup-text");
const libraryClose = document.querySelector(".library-close");

save.addEventListener("click", () => {
    savepopup.classList.toggle("active-save-popup");
    saveText.classList.toggle("active-save-popup-text");
});

saveClose.addEventListener("click", () => {
    savepopup.classList.remove("active-save-popup");
    saveText.classList.remove("active-save-popup-text");
});

saveGenrate.addEventListener("click", saveToLocal);

//save to local storage

function saveToLocal() {
    const input = saveText.querySelector("input");
    const name = input.value;
    const colors = [];
   
    const texts = document.querySelectorAll(".copy");
    texts.forEach(text => {
        colors.push(text.innerText);
    });
    let paletteNr = savePalette.length;
    savePalette = { name, colors, nr: paletteNr };
    
    savePaletteToLocalStorage(savePalette);

    input.value = "";
    
    //update library

    const div = document.createElement("div");
    savePalette.colors.forEach(color => {
        const smallDiv = document.createElement("div");
        smallDiv.classList.add(".library-color-divs");
        smallDiv.style.backgroundColor = color;
        div.appendChild(smallDiv);
    });
    libraryText.appendChild(div);

}
function savePaletteToLocalStorage(savePalette){
    let palette;

    if (localStorage.getItem("localPalette") === null) {
        palette = [];
    } else {
        palette = JSON.parse(localStorage.getItem("localPalette"));
    }
    palette.push(savePalette);
    localStorage.setItem("localPalette", JSON.stringify(palette));

}

librarybtn.addEventListener("click", () => {
    libraryPopup.classList.toggle("active-library-popup");
    libraryText.classList.toggle("active-library-popup-text");
});

libraryClose.addEventListener("click", () => {
    libraryPopup.classList.remove("active-library-popup");
    libraryText.classList.remove("active-library-popup-text");
});


randomColor();