import { supabase } from "./supabase.js";
import { getArtistImage } from "./images.js";



const box =
document.getElementById("favorites");





async function loadFavorites(){


    const favorites =
    JSON.parse(
        localStorage.getItem("favorites")
    ) || [];




    if(favorites.length === 0){


        box.innerHTML =

        `
        <p>
        Nema omiljenih pjesama ❤️
        </p>
        `;


        return;


    }






    const {data,error} =

    await supabase

    .from("songs")

    .select("*")

    .in("id", favorites);





    if(error){


        console.error(error);


        box.innerHTML =

        `
        <p>
        Greška kod učitavanja omiljenih pjesama.
        </p>
        `;


        return;


    }






    box.innerHTML = "";





    data.forEach(song=>{


        const image =

        getArtistImage(song.artist);





        box.innerHTML += `


        <div class="artist-card">



            <img

            src="${image}"

            onerror="this.src='images/default.jpg'"

            >





            <h3>

            🎵 ${song.title}

            </h3>





            <p>

            ${song.artist}

            </p>






            <a href="pjesma.html?id=${song.id}">

            Otvori pjesmu

            </a>



            <br>



            <button

            class="remove-favorite"

            onclick="removeFavorite(${song.id})">

            ❌ Ukloni

            </button>




        </div>


        `;



    });



}







window.removeFavorite = function(id){



    let favorites =

    JSON.parse(

        localStorage.getItem("favorites")

    ) || [];





    favorites =

    favorites.filter(

        songId => songId !== id

    );





    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)

    );





    loadFavorites();



}







loadFavorites();
