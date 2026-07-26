console.log("dodaj-pjesmu.js učitan");
import { supabase } from "./supabase.js";



const formButton = document.querySelector(".send-btn");

const clearButton = document.querySelector(".clear-btn");





async function sendSong(){


    const title =
    document.getElementById("title")
    .value
    .trim();



    const artist =
    document.getElementById("artist")
    .value
    .trim();



    const lyrics =
    document.getElementById("lyrics")
    .value
    .trim();





    if(!title || !artist || !lyrics){


        showMessage(
            "Molimo popunite sva polja."
        );


        return;

    }






    const { error } =

    await supabase

    .from("pending_songs")

    .insert({

        title,

        artist,

        lyrics

    });







    if(error){


        console.error(error);


        showMessage(
            "Greška kod slanja pjesme."
        );


        return;

    }






    showMessage(
        "Pjesma je uspješno poslana na pregled ✅"
    );



    clearForm();



}









function clearForm(){


    document.getElementById("title").value="";


    document.getElementById("artist").value="";


    document.getElementById("lyrics").value="";


}








function showMessage(text){


    const box =
    document.getElementById("message");


    box.textContent=text;



}








formButton.addEventListener(
    "click",
    sendSong
);



clearButton.addEventListener(
    "click",
    clearForm
);