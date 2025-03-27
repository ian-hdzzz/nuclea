window.onload = function() {
    const loaderWrapper = document.getElementById('loaderWrapper');
    const mainContent = document.getElementById('mainContent');
    
    const randomTime = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;      

    setTimeout(function() {

      loaderWrapper.style.opacity = '0';
      loaderWrapper.style.visibility = 'hidden';

      mainContent.style.opacity = '1';
    }, randomTime);
  };