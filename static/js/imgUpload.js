function showImage(event) {
    let images = document.getElementById("formFile");
    let number = images.files.length;
    console.log(images, number)
    for (i = 0; i < number; i++) {
        var urls = URL.createObjectURL(event.target.files[i]);
        console.log(urls);
        document.getElementById("mini-box").innerHTML += '<img src="' + urls + '" class = "mini-img">';
    }
}


window.onload = () => {
    let list = document.getElementsByClassName("c-mini-img");
    console.log(list);
    for (let img of list) {
        img.addEventListener("click", () => {
            img.remove();
            let inputData = document.createElement('input');

            let searchTerm = img.currentSrc.indexOf('YelpCamp');
            let arrayName = img.currentSrc.slice(searchTerm, -4);

            inputData.innerHTML = '<input type="hidden" name="deleteImg[]" value="' + arrayName +'">';
            document.getElementById("mini-box").appendChild(inputData);
        })
    }
}
