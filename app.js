//DOM

const colorDiv = document.querySelectorAll(".color");
const genrateColor = document.querySelector(".genrate-button");
const saturation = document.querySelectorAll(".saturation");







//Event Listners

genrateColor.addEventListener("click", randomColor);




//Functions

             // Genrating a random color

function randomColor(){
   

    colorDiv.forEach(div => {
        const hexColor = chroma.random();
        const hexText = div.children[0];

        div.style.backgroundColor = hexColor; 
        hexText.innerText = hexColor;

        checkColorContrast(hexColor, hexText);

        colorSlider(hexColor);
    });


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

function colorSlider(color){
    //Saturation
    const noSat = color.set('hsl.s', 0);
    const Sat = color.set("hsl.s", 1);
    const setSat = chroma.scale(noSat, color, Sat);

    saturation.style.backgroundImage = `linear-gradient(to right , ${setSat(0)}, ${setSat(1)})`;
     }       


randomColor();