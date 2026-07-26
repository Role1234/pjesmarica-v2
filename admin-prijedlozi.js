import { supabase } from "./supabase.js";


let editPendingId = null;





// =========================
// PROVJERA PRIJAVE
// =========================


async function checkLogin(){


    const {data} =
    await supabase.auth.getSession();



    if(!data.session){

        window.location.href="login.html";

        return false;

    }


    return true;

}









// =========================
// UČITAVANJE PRIJEDLOGA
// =========================


async function loadPendingSongs(){


    const box =
    document.getElementById("pendingSongs");



    const {data,error} =

    await supabase

    .from("pending_songs")

    .select("*")

    .order("created_at",{ascending:false});





    if(error){

        console.error(error);

        box.innerHTML =
        `
        <p>
        Greška kod učitavanja prijedloga.
        </p>
        `;

        return;

    }






    if(!data.length){


        box.innerHTML =

        `
        <div class="empty-box">

        🎵 Nema novih prijedloga.

        </div>
        `;


        return;


    }





    box.innerHTML="";






    data.forEach(song=>{


        box.innerHTML +=



        `

        <div class="pending-song">



            <div class="song-header">


                <div>

                    <h2>
                    🎵 Naziv pjesme
                    </h2>

                <div class="info-box">

                    ${song.title}

                </div>
                  


                </div>



                <div class="song-status">

                    Čeka pregled

                </div>


            </div>







            <div class="song-section">


                <h3>
                🎤 Ime izvođača
                </h3>


                <div class="info-box">

                    ${song.artist}

                </div>


            </div>








            <div class="song-section">


                <h3>
                📝 Tekst pjesme
                </h3>


                <div class="lyrics-preview">

                ${song.lyrics.replace(/\n/g,"<br>")}

                </div>


            </div>







            <div class="song-date">


                Dodano:
                ${new Date(song.created_at)
                .toLocaleDateString("hr-HR")}


            </div>








            <div class="pending-actions">



                <button

                class="approve-btn"

                onclick="approveSong(${song.id})">

                ✅ Odobri

                </button>







                <button

                class="edit-pending-btn"

                onclick="editPendingSong(${song.id})">

                ✏️ Uredi

                </button>







                <button

                class="delete-pending-btn"

                onclick="deletePendingSong(${song.id})">

                🗑️ Obriši

                </button>




            </div>




        </div>


        `;


    });



}











// =========================
// ODOBRAVANJE
// =========================


async function approveSong(id){


    if(!confirm(
        "Odobriti ovu pjesmu?"
    )) return;





    const {data:song,error:getError}=


    await supabase

    .from("pending_songs")

    .select("*")

    .eq("id",id)

    .single();





    if(getError){

        alert(getError.message);

        return;

    }







    const {error:insertError}=


    await supabase

    .from("songs")

    .insert({

        artist:song.artist,

        title:song.title,

        lyrics:song.lyrics

    });






    if(insertError){

        alert(insertError.message);

        return;

    }








    const {error:deleteError}=


    await supabase

    .from("pending_songs")

    .delete()

    .eq("id",id);







    if(deleteError){

        alert(deleteError.message);

        return;

    }





    alert(
        "Pjesma je odobrena ✅"
    );



    loadPendingSongs();


}











// =========================
// UREĐIVANJE
// =========================


async function editPendingSong(id){



    const {data,error}=


    await supabase

    .from("pending_songs")

    .select("*")

    .eq("id",id)

    .single();





    if(error){

        alert(error.message);

        return;

    }






    editPendingId=id;



    editTitle.value=data.title;

    editArtist.value=data.artist;

    editLyrics.value=data.lyrics;




    editModal.style.display="block";



}








function closeEditModal(){


    editModal.style.display="none";


    editPendingId=null;


}









async function updatePendingSong(){



    if(!editPendingId) return;





    const title =
    editTitle.value.trim();



    const artist =
    editArtist.value.trim();



    const lyrics =
    editLyrics.value.trim();






    if(!title || !artist || !lyrics){

        alert(
            "Popuni sva polja."
        );

        return;

    }








    const {error}=


    await supabase

    .from("pending_songs")

    .update({

        title,

        artist,

        lyrics

    })

    .eq("id",editPendingId);







    if(error){

        alert(error.message);

        return;

    }






    closeEditModal();


    loadPendingSongs();


}









// =========================
// BRISANJE
// =========================


async function deletePendingSong(id){



    if(!confirm(
        "Obrisati prijedlog?"
    )) return;






    const {error}=


    await supabase

    .from("pending_songs")

    .delete()

    .eq("id",id);







    if(error){

        alert(error.message);

        return;

    }






    loadPendingSongs();



}









// =========================
// POVRATAK
// =========================


function goBack(){


    window.location.href="admin.html";


}









window.goBack=goBack;

window.approveSong=approveSong;

window.editPendingSong=editPendingSong;

window.deletePendingSong=deletePendingSong;

window.updatePendingSong=updatePendingSong;

window.closeEditModal=closeEditModal;









document.addEventListener(

"DOMContentLoaded",

async()=>{


    const ok =
    await checkLogin();



    if(!ok) return;



    loadPendingSongs();



});