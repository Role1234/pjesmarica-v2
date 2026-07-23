import { supabase } from "./supabase.js";


const artistImages = {

"Barabe":
"images/barabe.jpg",

"Braća Pejinović":
"images/bracapejinovic.jpg",

"Hari Mata Hari":
"images/hari.jpg"

};



const defaultImage =
"images/default.jpg";



const id =
new URLSearchParams(location.search).get("id");



const titleElement =
document.getElementById("title");

const artistElement =
document.getElementById("artist");

const lyricsElement =
document.getElementById("lyrics");

const imageElement =
document.getElementById("artistImage");





if(!id){

titleElement.textContent="Pjesma nije pronađena";

throw new Error("Nema ID pjesme");

}





const {data,error}=await supabase

.from("songs")

.select("*")

.eq("id",id)

.single();





if(error || !data){


titleElement.textContent="Greška kod učitavanja pjesme";


throw error;

}





titleElement.textContent=data.title;


artistElement.textContent=data.artist;


lyricsElement.textContent=data.lyrics;


imageElement.src=
artistImages[data.artist] || defaultImage;



/*zabrana kopiranja desnim klikom*/
document
.querySelector(".lyrics-container")
.addEventListener("contextmenu", (e)=>{
    e.preventDefault();
});


///kopiranje pjesme
/*
document
.getElementById("copyBtn")
.addEventListener("click",()=>{


navigator.clipboard.writeText(data.lyrics);


alert("Tekst pjesme kopiran!");

});
*/

document
.getElementById("copyBtn")
.addEventListener("click",()=>{

    alert("Kopiranje teksta uskoro će biti dostupno.");

});





document
.getElementById("favoriteBtn")
.addEventListener("click",()=>{


alert("Favoriti će biti dodani uskoro ❤️");


});
