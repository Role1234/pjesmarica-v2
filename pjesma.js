import { supabase } from "./supabase.js";


const params = new URLSearchParams(
    window.location.search
);


const id = params.get("id");



const { data: song, error } = await supabase

.from("songs")

.select("*")

.eq("id", id)

.single();



if(error){

    document.getElementById("title").innerHTML =
    "Pjesma nije pronađena";

}
else {


document.getElementById("title").innerHTML =
song.title;


document.getElementById("artist").innerHTML =
song.artist;



document.getElementById("lyrics").innerHTML =
song.lyrics.replaceAll("\n","<br>");

}
