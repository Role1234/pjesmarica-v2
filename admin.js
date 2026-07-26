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



    const artists=[

        ...new Set(

            allSongs.map(
                song=>song.artist
            )

        )

    ].sort();




    artists.forEach(artist=>{

        list.innerHTML +=`

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



    select.innerHTML=`

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


        select.innerHTML +=`

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


        box.innerHTML +=`

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


        box.innerHTML +=`

        <button onclick="changePage(${i})">

        ${i}

        </button>

        `;


    }



}



function changePage(page){

    currentPage=page;

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

        showMessage(error.message);

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


    editTitle.value=song.title;

    editArtist.value=song.artist;

    editLyrics.value=song.lyrics;



    editModal.style.display="block";


}



function closeModal(){


    editModal.style.display="none";

    editId=null;


}





async function updateSong(){


    if(!editId) return;



    const {error}=

    await supabase

    .from("songs")

    .update({

        title:editTitle.value,

        artist:editArtist.value,

        lyrics:editLyrics.value

    })

    .eq(
        "id",
        editId
    );



    if(error){

        showMessage(error.message);

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

        showMessage(error.message);

        return;

    }



    await loadSongs();


    showMessage(
        "Pjesma obrisana 🗑️"
    );


}









function clearForm(){

    title.value="";

    artist.value="";

    lyrics.value="";

}









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
// BACKUP FUNKCIJE
// =========================



async function downloadJsonBackup(){


    const {data,error}=

    await supabase

    .from("songs")

    .select("*")

    .order("artist");



    if(error){

        alert(
            "Greška kod backupa."
        );

        return;

    }



    const backup={

        app:"Pjesmarica",

        createdAt:
        new Date().toISOString(),

        songs:data

    };



    const blob =

    new Blob(

        [
            JSON.stringify(
                backup,
                null,
                2
            )
        ],

        {
            type:"application/json"
        }

    );



    const url =
    URL.createObjectURL(blob);



    const a =
    document.createElement("a");



    a.href=url;


    a.download=

    "pjesmarica-backup.json";



    a.click();



    URL.revokeObjectURL(url);



}








function openPdfBackup(){


    const modal =
    document.getElementById("pdfModal");


    const select =
    document.getElementById("pdfArtist");


    select.innerHTML=`

    <option value="">
    🎤 Sve pjesme
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


        select.innerHTML +=`

        <option value="${artist}">
        ${artist}
        </option>

        `;


    });



    updatePdfCount();


    select.onchange =
    updatePdfCount;



    modal.style.display="block";


}





function updatePdfCount(){


    const artist =
    document.getElementById("pdfArtist")
    .value;



    let songs = allSongs;



    if(artist){

        songs =
        allSongs.filter(
            song=>song.artist===artist
        );

    }



    document.getElementById("pdfSongCount")
    .textContent=

    `Broj pjesama: ${songs.length}`;


}






function closePdfModal(){


    pdfModal.style.display="none";


}







function createPdf(){


    const artist =
    document
    .getElementById("pdfArtist")
    .value;



    let songs=[...allSongs];



    if(artist){

        songs =
        songs.filter(
            song=>song.artist===artist
        );

    }



    if(!songs.length){

        alert(
            "Nema pjesama za izvoz."
        );

        return;

    }



    const exportName =
    artist || "Svi izvođači";




    let content = [];



    // NASLOVNICA

    content.push({

        text:"PJESMARICA",

        style:"title",

        alignment:"center",

        margin:[0,40,0,10]

    });



    content.push({

        text:"PDF Backup",

        style:"subtitle",

        alignment:"center"

    });



    content.push({

        text:
        `Izvođač: ${exportName}`,

        alignment:"center",

        margin:[0,20,0,0]

    });



    content.push({

        text:
        `Broj pjesama: ${songs.length}`,

        alignment:"center"

    });



    content.push({

        text:
        `Datum: ${new Date().toLocaleDateString("hr-HR")}`,

        alignment:"center"

    });



    content.push({

        text:"",

        pageBreak:"after"

    });






    // PJESME


    songs.forEach((song,index)=>{


        content.push({


            text:
            song.title,


            style:"songTitle",

            alignment:"center"



        });



        content.push({


            text:
            `Izvođač: ${song.artist}`,

            style:"artist",

            alignment:"center"


        });




        content.push({


            canvas:[

                {

                    type:"line",

                    x1:0,

                    y1:0,

                    x2:515,

                    y2:0,

                    lineWidth:1,

                    lineColor:"#d4af37"

                }

            ],


            margin:[0,5,0,10]


        });







        content.push({


            text:
            song.lyrics,


            style:"lyrics",

            alignment:"center"



        });






        if(index !== songs.length-1){


            content.push({

                text:"",

                pageBreak:"after"


            });


        }



    });







    const docDefinition={



        content:content,



        styles:{



            title:{


                fontSize:28,

                bold:true,

                color:"#d4af37"


            },



            subtitle:{


                fontSize:16


            },



            songTitle:{


                fontSize:18,

                bold:true,

                color:"#d4af37",

                margin:[0,0,0,5]


            },



            artist:{


                fontSize:11,

                color:"#555",

                margin:[0,0,0,10]


            },



            lyrics:{


                fontSize:12,

                lineHeight:1.4


            }



        },




        footer:function(currentPage,pageCount){


            return {


                text:
                `Pjesmarica | ${currentPage} / ${pageCount}`,

                alignment:"center",

                fontSize:9,

                color:"#777"


            };


        }




    };






    pdfMake
    .createPdf(docDefinition)
    .download(

        `pjesmarica-${exportName}.pdf`

    );



    closePdfModal();



}






function importBackupSoon(){


    importModal.style.display="block";


}




function closeImportModal(){


    importModal.style.display="none";


}









// =========================
// ODJAVA
// =========================


async function logout(){


    await supabase.auth.signOut();


    window.location.href =
    "login.html";


}









// GLOBALNO


window.saveSong=saveSong;

window.clearForm=clearForm;

window.openEdit=openEdit;

window.closeModal=closeModal;

window.updateSong=updateSong;

window.deleteSong=deleteSong;

window.logout=logout;

window.changePage=changePage;


window.openPdfBackup=openPdfBackup;

window.closePdfModal=closePdfModal;

window.createPdf=createPdf;

window.downloadJsonBackup=downloadJsonBackup;

window.importBackupSoon=importBackupSoon;

window.closeImportModal=closeImportModal;









document.addEventListener(

"DOMContentLoaded",

async()=>{


    const ok =
    await checkLogin();


    if(!ok) return;




    adminSearch.addEventListener(
        "input",
        applyFilters
    );



    artistFilter.addEventListener(
        "change",
        applyFilters
    );



    loadSongs();


});