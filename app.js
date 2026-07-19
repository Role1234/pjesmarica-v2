import { supabase } from "./supabase.js";


const songsDiv =
document.getElementById("songs");



const { data: songs, error } =
await supabase
.from("songs")
.select("id,title,artist")
.limit(20);



if(error){

    songsDiv.innerHTML =
    "Greška: " + error.message;

}



songs.forEach(song => {


    songsDiv.innerHTML += `

    <div class="card">

        <h2>
        ${song.title}
        </h2>

        <p>
        ${song.artist}
        </p>


        <a href="pjesma.html?id=${song.id}">
        Čitaj pjesmu
        </a>

    </div>

    `;


});
