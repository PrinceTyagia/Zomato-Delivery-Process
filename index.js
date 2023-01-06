let isOrderAccepted = false;
let isValetFound = false;
let hasResturantSeenYourOrder = false;
let resturantTimer = null;
let valetTimer = null;
let valetDeliveryTimer = null;
let isOrderDelivered = false;


// Zomto App -  Boot up/Power up / start
window.addEventListener("load", function () {
  document.getElementById("acceptOrder").addEventListener("click", function () {
    askResturantToAcceptOrReject();
  });
  document.getElementById('findValet').addEventListener('click',function() {
      startSearchingForValets();
  })
  document
    .getElementById("deliverOrder")
    .addEventListener("click", function () {
       setTimeout(() => {
          isOrderDelivered = true;
       },2000) 
    });

  checkIfOrderAcceptedFromRestaurant()
    .then((isOrderAccepted) => {
      console.log("updated from resturant - ", isOrderAccepted);
      //step4 -> start prepraing
      if (isOrderAccepted) startPreparingOrder();
      //step3 -> Order rejected
      else
        alert(
          "Sorry resturant couldnt accept your order! Returnig your amount with zomato shares "
        );
    })
    .catch((err) => {
      console.error(err);
      alert("Something went wrong! Please try again later");
    });
});

//Step1 -> Check whether resturant accepted order or not
function askResturantToAcceptOrReject() {
  // callback
  setTimeout(() => {
    isOrderAccepted = confirm("Should resturant order?");
    hasResturantSeenYourOrder = true;
    // console.log(isOrderAccepted);
  }, 1000);
}

//step2 -> Check if Resturant has accepted order
function checkIfOrderAcceptedFromRestaurant() {
  //Promise - reslove/accept or reject
  return new Promise((resolve, reject) => {
    resturantTimer = setInterval(() => {
      console.log("Checking if order accepted or not");
      if (!hasResturantSeenYourOrder) return;
      if (isOrderAccepted) resolve(true);
      else resolve(false);
      clearInterval(resturantTimer);
    }, 2000);
  });
}

//step 4 - start preparing
function startPreparingOrder() {
  Promise.allSettled([
    updateOrderStatus(),
    updateMapView(),
    checkIfAssigned(),
    checkIfOrderDelivery()
  ])
    .then((res) => {
      console.log(res);
      setTimeout(() => {
        alert("How was your food? Rate your food and delivery partner");
      }, 5000);
    })
    .catch((err) => {
      console.error(err);
    });
}
// Helper function - Pure Function
function updateOrderStatus() {
 return new Promise((resolve,reject) => {
    setTimeout(() => {
         document.getElementById("currentStatus").innerText = isOrderDelivered ? "Order Deliverd successfully" :
           "Preparing your order";
           resolve('status updated');
    },1500)
 })
}
function updateMapView() {
  //Fake delay get to data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      document.getElementById("mapview").style.opacity = "1";
      resolve("map initialised");
    }, 1000);
  });
}
function startSearchingForValets(){
    //BED
    //Bht complex operations
    /**
     * 1.Get all location of nearby valets
     * 2.sort the valets base on shorts path of resturant
     * + to customer home
     * 3.Select the valet with shortest distance and minimum orders
     */
    // step1 - get valets
    const valetsPromises = [];
    for(let i=0;i < 5;i++){
        valetsPromises.push(getRandomDriver());
    }
    console.log(valetsPromises);
    Promise.any(valetsPromises).then(selectedPromises => {
      console.log("Selected a valet =>", selectedPromises);
      isValetFound = true;
    })
    .catch(err => {
      console.error(err);
    })
}
function getRandomDriver() {
    // fake delay to get location data from driver
    return new Promise((resolve,reject) => {
        const timeout = Math.random()*1000;
        setTimeout(() => {
          resolve("Valet - " + timeout);
        }, timeout);
    })
    return 
}
function checkIfAssigned(){
  return new Promise((resolve,reject) => {
    valetTimer = setInterval(() => {
      console.log('searching for valet');
      if(isValetFound) {
        updateValetDetails();
        resolve('updated valet details')
        clearTimeout(valetTimer);
      }
    },1000)
  })
}
function updateValetDetails(){
  if(isValetFound){
    document.getElementById("finding-driver").classList.add('none');
    document.getElementById("found-driver").classList.remove("none");
    document.getElementById("call").classList.remove("none");
  }
}

function checkIfOrderDelivery(){
  return new Promise((resolve,reject) => {
    valetDeliveryTimer = setInterval(() => {
      console.log('is order delivered by valet');
      if (isOrderDelivered) {
        resolve("order delivered valet details");
       updateOrderStatus();
        clearTimeout(valetDeliveryTimer);
      }
    },1000);
  })
}


//Promise - then,catch callback - resoleve, reject
//Types of promise-
//1.Promise.all - saare operations call paralley, if one fails, promise.all fails
//2.Promise.allsettled - saare operations call paralle, if one fails - dont give a damn , promise.allsettled passes
//3.Promise.race - first promise to complete - whether it is resolved or rejected
//4.Promise.any - first promise to fullfill that is resolved/fullfill
