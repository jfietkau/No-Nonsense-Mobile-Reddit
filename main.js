function loadNsfwContent() {

  var nsfwWarning = document.getElementsByClassName('XPromoNSFWBlocking__warning');
  var isNsfwPost = nsfwWarning.length > 0;

  if(isNsfwPost) {
    var contentUrl = window.location.href + '.json';
    nsfwWarning[0].parentNode.removeChild(nsfwWarning[0]);
    var contentReq = new XMLHttpRequest();
    contentReq.open('GET', contentUrl);
    contentReq.addEventListener('load', function(data) {
      var response = JSON.parse(data.target.response);
      var postData = response[0]['data']['children'][0]['data'];
      if(postData.hasOwnProperty('selftext_html') && postData['selftext_html'] != null) {
        // Display formatted self post text
        var selftextContainer = document.createElement('div');
        selftextContainer.classList.add('PostContent__selftext');
        var doc = new DOMParser().parseFromString(postData['selftext_html'], 'text/html');
        selftextContainer.innerHTML = doc.documentElement.textContent;
        var targetElements = document.getElementsByClassName('PostContent__text-wrapper');
        if(targetElements.length > 0) {
          targetElements[0].appendChild(selftextContainer);
          targetElements[0].classList.remove('PostContent__text-wrapper');
        } else {
          var container = document.getElementsByClassName('PostContent');
          var imageContainer = document.getElementsByClassName('PostContent__image-wrapper');
          // I couldn't find a way to get at the unblurred image preview from here, so we just get rid of it
          container[0].removeChild(imageContainer[0]);
          container[0].appendChild(selftextContainer);
        }
      } else if(postData.hasOwnProperty('url_overridden_by_dest') && postData['url_overridden_by_dest'] != null) {
        // Direct link to an image
        var imageContainer = document.getElementsByClassName('PostContent__image-wrapper');
        if(imageContainer.length > 0) {
          imageContainer[0].style.backgroundImage = 'url("' + postData['url_overridden_by_dest'] + '")';
        }
      }
    });
    contentReq.send();
  }

}

loadNsfwContent();

