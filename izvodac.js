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



const params =
new URLSearchParams(
    window.location.search
);


const name =
params.get("artist");



const nameElement =
document.getElementById("name");


const imageElement =
document.getElementById("artistImage");


const songsBox =
document.getElementById("songs");


const counter =
document.getElementById("songCounter");




async function loadArtist(){


    if(!name){


        songsBox.innerHTML =
        "<p>Nije pronađen izvođač.</p>";


        return;


    }



    console.log("TRAŽIM IZVOĐAČA:", name);



    nameElement.textContent =
    name;



    imageElement.src =
    artistImages[name] || defaultImage;





    const {data,error}=await supabase

    .from("songs")

    .select("*")

    .eq("artist", name)

    .order("title");





    console.log("PODACI:", data);

    console.log("GREŠKA:", error);





    if(error){


        console.error(error);


        songsBox.innerHTML =
        "<p>Greška kod učitavanja pjesama.</p>";


        return;


    }





    counter.textContent =
    "Ukupno pjesama: " + data.length;





    songsBox.innerHTML = "";





    if(data.length === 0){


        songsBox.innerHTML =

        "<p>Nema pjesama za ovog izvođača.</p>";


        return;


    }





    data.forEach(song=>{


        songsBox.innerHTML += `


        <div class="song-card">


            <h3>
            ${song.title}
            </h3>


            <a href="pjesma.html?id=${song.id}">
            🎵 Otvori tekst
            </a>


        </div>


        `;


    });


}





loadArtist();
