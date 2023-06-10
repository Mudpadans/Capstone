window.onload = function() {
    axios.get('http://localhost:4200/checkAuthentication')
      .then(res => {
        if(res.data.status !== "Authenticated") {
          // User is not authenticated, redirect to signup page
          window.location.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/sign-up/index.html";
        }
      })
      .catch(err => {
        // Request failed, probably because user is not authenticated
        window.location.href = "/Volumes/GIGAFILES/Devmountain/Capstone/client/sign-up/index.html";
      });
  };