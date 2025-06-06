function bigPicture(element) {
    const imageContainer = document.getElementById(element);
    const viewer = new Viewer(imageContainer, {
      inline: false, 
      toolbar: true,      
      tooltip: false,     
      viewed() {
        viewer.zoomTo(1);  
      },
      hidden() {
        viewer.destroy();
      },
      navbar: false,       
      title: false,        
    });
    viewer.show();
}