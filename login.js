import { supabase } from "./supabase.js";


// =========================
// PROVJERA POSTOJEĆE SESIJE
// =========================

async function checkSession(){


    const { data } =
    await supabase.auth.getSession();



    if(data.session){


        window.location.href =
        "admin.html";


    }


}



checkSession();





// =========================
// PORUKA
// =========================


function showMessage(text){


    const message =
    document.getElementById("message");


    if(message){

        message.textContent = text;

    }


}






// =========================
// PRIJAVA
// =========================


async function login(){



    const email =
    document
    .getElementById("email")
    .value
    .trim();




    const password =
    document
    .getElementById("password")
    .value;





    const button =
    document.getElementById("loginButton");






    if(!email || !password){


        showMessage(
            "Unesi email i lozinku."
        );


        return;

    }







    if(button){


        button.disabled = true;


        button.textContent =
        "Prijava...";


    }







    try{



        const { error } =

        await supabase.auth.signInWithPassword({

            email,

            password

        });






        if(error){


            console.error(error);


            showMessage(
                "Pogrešan email ili lozinka."
            );


            return;


        }







        showMessage(
            "Prijava uspješna ✅"
        );







        setTimeout(()=>{


            window.location.href =
            "admin.html";


        },700);







    }

    catch(error){



        console.error(error);


        showMessage(
            "Greška kod prijave."
        );


    }







    finally{


        if(button){


            button.disabled=false;


            button.textContent =
            "🔐 Prijavi se";


        }


    }



}






// =========================
// GUMB
// =========================


document.addEventListener(
"DOMContentLoaded",
()=>{


    const button =
    document.getElementById("loginButton");



    if(button){


        button.addEventListener(
            "click",
            login
        );


    }


});
