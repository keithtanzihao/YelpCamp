function typingAnimation(text, id, index) {

    if (index < text.length) {
        // console.log(text.charAt(index));
        document.getElementById(id).innerHTML += text.charAt(index);
        index++;
        setTimeout(() => { typingAnimation(text, id, index) }, 40);
    }
}


typingAnimation("Welcome to YelpCamp", "type-title", 0);
typingAnimation("View campgrounds from all over the world", 'type-desc', 0);
