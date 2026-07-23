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



let songs = [];

let artists = [];


function normalizeText(text){

    return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

}




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



    songs = data;



    songCount.textContent =
    songs.length;



    const grouped = {};



    songs.forEach(song=>{


        if(!grouped[song.artist]){


            grouped[song.artist] = [];


        }



        grouped[song.artist].push(song);


    });





    artists =
    Object.keys(grouped);



    artistCount.textContent =
    artists.length;



    showArtists(grouped, artists);



}








function showArtists(grouped,list){


    box.innerHTML = "";



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




function getSnippet(text, searchValue){


    if(!text){

        return "";

    }


    const normalizedText =
    normalizeText(text);



    const index =
    normalizedText.indexOf(searchValue);



    if(index === -1){

        return "";

    }



    let start =
    index - 50;



    let end =
    index + searchValue.length + 80;



    if(start < 0){

        start = 0;

    }



    if(end > text.length){

        end = text.length;

    }



    let snippet =
    text.substring(start,end);



    // pronađi stvarnu riječ u originalnom tekstu
    const originalPart =
    text.substring(
        index,
        index + searchValue.length + 5
    );



    const regex =
    new RegExp(
        originalPart,
        "gi"
    );



    snippet =
    snippet.replace(
        regex,
        `<strong class="highlight">$&</strong>`
    );



    return "..." + snippet + "...";


}








function showSearchResults(results){


    box.innerHTML = "";



    if(results.length === 0){


        box.innerHTML =
        "<p>Nema pronađenih pjesama.</p>";


        return;


    }





    const searchValue =
normalizeText(search.value.trim());






    results.forEach(song=>{


        const image =
        getArtistImage(song.artist);



        const snippet =
        getSnippet(
            song.lyrics,
            searchValue
        );



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



            ${
                snippet
                ?
                `<p class="snippet">
                ${snippet}
                </p>`
                :
                ""
            }



            <a href="pjesma.html?id=${song.id}">

            Otvori pjesmu

            </a>


        </div>


        `;



    });



}






search.addEventListener("input",()=>{


    const value =
    normalizeText(search.value.trim());






    if(value === ""){


        const grouped = {};



        songs.forEach(song=>{


            if(!grouped[song.artist]){


                grouped[song.artist] = [];


            }



            grouped[song.artist].push(song);


        });



        showArtists(grouped, artists);


        return;


    }






    const results =

    songs.filter(song=>{


        const title =
normalizeText(song.title || "");


const artist =
normalizeText(song.artist || "");


const lyrics =
normalizeText(song.lyrics || "");





        return (

            title.includes(value)

            ||

            artist.includes(value)

            ||

            lyrics.includes(value)

        );


    });





    showSearchResults(results);



});







loadSongs();
