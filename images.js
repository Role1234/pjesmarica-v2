export function getArtistImage(name) {

    return "images/" +

        name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/č/g, "c")
            .replace(/ć/g, "c")
            .replace(/š/g, "s")
            .replace(/ž/g, "z")
            .replace(/đ/g, "dj")
            .replace(/\s+/g, "")

        + ".jpg";

}

