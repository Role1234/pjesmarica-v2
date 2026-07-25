const sidebar =
document.getElementById("sidebar");


const menuBtn =
document.getElementById("menuBtn");


const closeBtn =
document.getElementById("closeSidebar");



menuBtn.addEventListener("click",()=>{

    sidebar.classList.add("active");

});



closeBtn.addEventListener("click",()=>{

    sidebar.classList.remove("active");

});

const currentPage =
window.location.pathname.split("/").pop();



document
.querySelectorAll(".sidebar a")
.forEach(link=>{


    if(link.dataset.page === currentPage){

        link.classList.add("active-link");

    }


});
