import { supabase } from "./supabase.js";
import { getArtistImage } from "./images.js";



const box = document.getElementById("artists");



let songs = [];





async function loadArtists(){


    const {data,error} = await supabase

    .from("songs")

    .select("*")

    .order("artist");




    if(error){


        console.error(error);


        box.innerHTML =

        "<p>Greška kod učitavanja izvođača</p>";


        return;


    }





    songs = data;





    const grouped = {};





    songs.forEach(song=>{



        if(!grouped[song.artist]){


            grouped[song.artist] = [];


        }



        grouped[song.artist].push(song);



    });







    const artists = Object.keys(grouped)

    .sort((a,b)=>


        a.localeCompare(b,"hr")

    );







    showArtists(grouped,artists);



}









function showArtists(grouped,artists){


    box.innerHTML = "";





    artists.forEach(name=>{



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








loadArtists();

