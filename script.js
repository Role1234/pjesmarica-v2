import { supabase } from "./supabase.js";
import { getArtistImage } from "./images.js";




const box =
document.getElementById("artists");


const search =
document.getElementById("search");


const songCount =
document.getElementById("songCount");


const artistCount =
document.getElementById("artistCount");


let songs=[];

let artists=[];




async function loadSongs(){


    const {data,error}=await supabase

    .from("songs")

    .select("*")

    .order("artist");



    if(error){

        console.error(error);

        box.innerHTML =
        "<p>Greška kod učitavanja pjesama</p>";

        return;

    }



    songs=data;



    songCount.textContent =
    songs.length;



    const grouped={};



    songs.forEach(song=>{


        if(!grouped[song.artist]){

            grouped[song.artist]=[];

        }


        grouped[song.artist].push(song);


    });




    artists =
    Object.keys(grouped);



    artistCount.textContent =
    artists.length;



    showArtists(grouped,artists);



}




function showArtists(grouped,list){


    box.innerHTML="";



    list.forEach(name=>{


        const image =
            getArtistImage(name);




        box.innerHTML += `


        <div class="artist-card">


            <img 
            src="${image}"
            onerror="this.src='images/default.jpg'"
            >



            <h3>
            ${name}
            </h3>


            <p>
            ${grouped[name].length} pjesama
            </p>


            <a href="izvodac.html?artist=${encodeURIComponent(name)}">

            Otvori

            </a>


        </div>


        `;


    });



}






search.addEventListener("input",()=>{


    const value =
    search.value.toLowerCase();



    const filtered =
    artists.filter(name=>

        name.toLowerCase()
        .includes(value)

    );



    const grouped={};



    songs.forEach(song=>{


        if(!grouped[song.artist]){

            grouped[song.artist]=[];

        }


        grouped[song.artist].push(song);


    });



    showArtists(grouped,filtered);



});





loadSongs();
