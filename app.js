import {supabase} from "./supabase.js";


const artistsDiv =
document.getElementById("artists");


const search =
document.getElementById("search");


const artistCount =
document.getElementById("artistCount");


const songCount =
document.getElementById("songCount");



let allSongs=[];



const {data,error}=await supabase

.from("songs")

.select("*")

.order("created_at",
{
ascending:false
});



if(error){

artistsDiv.innerHTML=error.message;

}

else{


allSongs=data;


songCount.innerHTML=data.length;


artistCount.innerHTML=
new Set(
data.map(x=>x.artist)
).size;


displayArtists(data);


}




function displayArtists(songs){


artistsDiv.innerHTML="";


let artists={};



songs.forEach(song=>{


if(!artists[song.artist])

artists[song.artist]=0;


artists[song.artist]++;


});



Object.keys(artists)
.forEach(name=>{


artistsDiv.innerHTML+=`


<div class="card">


<div class="icon">
🎤
</div>


<h3>
${name}
</h3>


<p>
${artists[name]} pjesama
</p>



<a href="izvodac.html?artist=${name}">
Otvori →
</a>



</div>


`;


});


}





search.addEventListener("input",()=>{


let value=
search.value.toLowerCase();



let filtered=
allSongs.filter(x=>

x.title.toLowerCase().includes(value)

||

x.artist.toLowerCase().includes(value)

);



displayArtists(filtered);


});

