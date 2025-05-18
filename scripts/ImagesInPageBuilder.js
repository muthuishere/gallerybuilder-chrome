function ImagesInPageBuilder(){
    // Initialize any properties
}

var validateImagesInPage = function(){
    const inputElement = document.getElementById('inputImagesInPage');
    
    if(inputElement.value === "" ){
        alert("Page URL cannot be empty");
        return false;
    }

    return true;
}

ImagesInPageBuilder.prototype.fetch = function(){
    if(!validateImagesInPage()){
        return;
    }

    // Add implementation for fetch functionality
};


ImagesInPageBuilder.prototype.build = function(){
    if(!validateImagesInPage()){
        return;
    }
    
    // Add implementation for build functionality
};


var imagesInPageBuilder = new ImagesInPageBuilder();

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.btnImagesInPagefetch').addEventListener('click', function() {
        imagesInPageBuilder.fetch();
    });
    
    document.querySelector('.btnImagesInPageBuild').addEventListener('click', function() {
        imagesInPageBuilder.build();
    });
});