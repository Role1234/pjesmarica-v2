import { supabase } from "./supabase.js";



let allSongs = [];

let filteredSongs = [];

let currentPage = 1;

const songsPerPage = 50;

let editId = null;






// =========================
// PROVJERA PRIJAVE
// =========================


async function checkLogin(){


    const { data } =
    await supabase.auth.getSession();



    if(!data.session){


        window.location.href =
        "login.html";


        return false;


    }


    return true;


}







// =========================
// UČITAVANJE PJESAMA
// =========================


async function loadSongs(){



    const {data,error}=

    await supabase

    .from("songs")

    .select("id,title,artist,lyrics,created_at")

    .order("artist");






    if(error){


        console.error(error);


        showMessage(
            "Greška kod učitavanja."
        );


        return;


    }







    allSongs=data;

    filteredSongs=data;





    fillArtistFilter();

    fillArtistSuggestions();

    renderSongs();



}









// =========================
// AUTOCOMPLETE
// =========================


function fillArtistSuggestions(){



    const list =
    document.getElementById("artistList");



    if(!list) return;




    list.innerHTML="";





    const artists = [

        ...new Set(

            allSongs.map(
                song=>song.artist
            )

        )

    ].sort();






    artists.forEach(artist=>{


        list.innerHTML += `

        <option value="${artist}"></option>

        `;


    });



}










// =========================
// FILTER IZVOĐAČA
// =========================


function fillArtistFilter(){



    const select =
    document.getElementById("artistFilter");



    if(!select) return;





    select.innerHTML = `

    <option value="">
    🎤 Svi izvođači
    </option>

    `;






    const artists=[

        ...new Set(

            allSongs.map(
                song=>song.artist
            )

        )

    ].sort();






    artists.forEach(artist=>{


        select.innerHTML += `

        <option value="${artist}">
        ${artist}
        </option>

        `;


    });



}









// =========================
// PRIKAZ PJESAMA
// =========================


function renderSongs(){



    const box =
    document.getElementById("adminSongs");



    if(!box) return;





    box.innerHTML="";






    const counter =
    document.getElementById("songCounter");



    if(counter){


        counter.textContent =

        `${filteredSongs.length} pjesama`;


    }







    const start =

    (currentPage-1)
    *
    songsPerPage;





    const pageSongs =

    filteredSongs.slice(

        start,

        start + songsPerPage

    );







    pageSongs.forEach(song=>{


        box.innerHTML += `


        <div class="admin-song">


        <div>


        <h3>
        🎵 ${song.title}
        </h3>


        <p>
        ${song.artist}
        </p>


        </div>





        <div>


        <button onclick="openEdit(${song.id})">
        ✏️
        </button>



        <button onclick="deleteSong(${song.id})">
        🗑️
        </button>



        </div>



        </div>


        `;


    });





    renderPagination();



}









// =========================
// PAGINACIJA
// =========================


function renderPagination(){



    const box =
    document.getElementById("pagination");



    if(!box) return;




    box.innerHTML="";






    const pages =

    Math.ceil(

        filteredSongs.length /
        songsPerPage

    );







    for(let i=1;i<=pages;i++){


        box.innerHTML += `


        <button onclick="changePage(${i})">

        ${i}

        </button>


        `;


    }



}







function changePage(page){


    currentPage = page;


    renderSongs();


}









// =========================
// FILTERI
// =========================


function applyFilters(){



    const text =

    document

    .getElementById("adminSearch")

    .value

    .toLowerCase();






    const artist =

    document

    .getElementById("artistFilter")

    .value;






    filteredSongs =

    allSongs.filter(song=>{



        const textMatch =


        song.title
        .toLowerCase()
        .includes(text)



        ||

        song.artist
        .toLowerCase()
        .includes(text);







        const artistMatch =


        artist === ""

        ||

        song.artist === artist;






        return textMatch && artistMatch;



    });






    currentPage=1;


    renderSongs();



}









// =========================
// DODAVANJE PJESME
// =========================


async function saveSong(){



    const title =
    document.getElementById("title")
    .value.trim();




    const artist =
    document.getElementById("artist")
    .value.trim();




    const lyrics =
    document.getElementById("lyrics")
    .value.trim();







    if(!title || !artist || !lyrics){


        showMessage(
            "Popuni sva polja."
        );


        return;


    }








    const {error}=

    await supabase

    .from("songs")

    .insert({

        title,

        artist,

        lyrics

    });








    if(error){


        console.error(error);


        showMessage(
            error.message
        );


        return;


    }








    clearForm();


    await loadSongs();


    showMessage(
        "Pjesma dodana ✅"
    );



}









// =========================
// UREĐIVANJE
// =========================


function openEdit(id){



    const song =

    allSongs.find(

        s=>s.id===id

    );





    if(!song) return;






    editId=id;





    document.getElementById("editTitle").value =
    song.title;



    document.getElementById("editArtist").value =
    song.artist;



    document.getElementById("editLyrics").value =
    song.lyrics;






    document.getElementById("editModal")
    .style.display="block";



}







function closeModal(){


    document.getElementById("editModal")
    .style.display="none";


    editId=null;


}








async function updateSong(){



    if(!editId) return;






    const {error}=

    await supabase

    .from("songs")

    .update({

        title:
        document.getElementById("editTitle").value,

        artist:
        document.getElementById("editArtist").value,

        lyrics:
        document.getElementById("editLyrics").value

    })

    .eq(
        "id",
        editId
    );







    if(error){


        showMessage(
            error.message
        );


        return;


    }







    closeModal();


    await loadSongs();


    showMessage(
        "Izmjene spremljene ✅"
    );



}









// =========================
// BRISANJE
// =========================


async function deleteSong(id){



    if(!confirm(
        "Obrisati pjesmu?"
    )) return;








    const {error}=

    await supabase

    .from("songs")

    .delete()

    .eq(
        "id",
        id
    );







    if(error){


        showMessage(
            error.message
        );


        return;


    }






    await loadSongs();


    showMessage(
        "Pjesma obrisana 🗑️"
    );



}









// =========================
// ČIŠĆENJE
// =========================


function clearForm(){


    document.getElementById("title").value="";

    document.getElementById("artist").value="";

    document.getElementById("lyrics").value="";


}









// =========================
// PORUKA
// =========================


function showMessage(text){



    const box =
    document.getElementById("message");



    if(box){


        box.textContent=text;



        setTimeout(()=>{


            box.textContent="";


        },3000);


    }



}









// =========================
// ODJAVA
// =========================


async function logout(){



    await supabase.auth.signOut();



    window.location.href =
    "login.html";



}









// =========================
// GLOBALNE FUNKCIJE ZA HTML
// =========================


window.saveSong = saveSong;

window.clearForm = clearForm;

window.openEdit = openEdit;

window.closeModal = closeModal;

window.updateSong = updateSong;

window.deleteSong = deleteSong;

window.logout = logout;

window.changePage = changePage;








// =========================
// START
// =========================


document.addEventListener(

"DOMContentLoaded",

async()=>{



    const ok =
    await checkLogin();



    if(!ok) return;





    document

    .getElementById("adminSearch")

    .addEventListener(
        "input",
        applyFilters
    );





    document

    .getElementById("artistFilter")

    .addEventListener(
        "change",
        applyFilters
    );





    loadSongs();



});
