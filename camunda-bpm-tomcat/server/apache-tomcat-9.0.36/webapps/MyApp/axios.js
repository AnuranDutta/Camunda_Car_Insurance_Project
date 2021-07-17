const postBtn = document.getElementById("post-btn");

const getData = () => {
  axios.get("http://localhost:8080/engine-rest/task").then((response) => {
    console.log(response);
  });
};

const sendData = () => {
  const customerName = document.getElementById("inp-customerName").value;
  const customerAge = document.getElementById("inp-customerAge").value;
  const carAge = document.getElementById("inp-carAge").value;
  const carPrice = document.getElementById("inp-carPrice").value;
  const carManufacturer = document.getElementById("inp-carManufacturer").value;
  const carType = document.getElementById("inp-carType").value;
  console.log(customerName +" "+customerAge +" "+carAge +" "+carPrice +" "+carManufacturer +" "+carType+"...");

  //validate function to verify data entered
  const validate = () => {
    let messages = [];
    var regex = /^[a-zA-Z ]{2,30}$/;
    if(customerName === '' || customerName == null || customerAge === '' || customerAge == null || carAge === '' || carAge == null || carPrice === '' || carPrice == null) {
      messages.push('One or more required fields are empty!');
    }
    if(!regex.test(customerName)&&!(customerName === '' || customerName == null)){
      messages.push('Name must be a string of length 2 to 30 char');
    }else if(!(customerAge === '' || customerAge == null)&&(isNaN(customerAge) || customerAge>100 || customerAge<17)) {
      messages.push('Age must be a number between 17 and 100');
    }else if(!(carAge === '' || carAge == null)&&( isNaN(carAge) || carAge<0 || carAge>100)) {
      messages.push('Car age must be a number between 0 and 100');
    }else if(!(carPrice === '' || carPrice == null)&&( isNaN(carPrice) || carPrice<1)) {
      messages.push('Car price must be a number without any gap or \',\'');
      messages.push('Car price cannot be zero');
    }

    if(messages.length > 0){
      document.getElementById('errors').classList.remove('text-success');
      document.getElementById('errors').classList.add('text-danger');
      document.getElementById('errors').innerHTML = messages.join("<br>");
      setTimeout(() => {
        document.getElementById("errors").innerHTML = "";
      }, 3000);
    } else {
      document.getElementById('errors').classList.remove('text-danger');
      document.getElementById('errors').classList.add('text-success');
      document.getElementById('errors').innerHTML = "No errors!";
      setTimeout(() => {
        document.getElementById("errors").innerHTML = "";
      }, 3000);
      return true
    }
  };

  if (validate()) {
    axios
      .post(
        'http://localhost:8080/engine-rest/process-definition/key/insurance-approval/start',
        {
          "variables": {
            "customerName": {
              "value": customerName,
            },
            "age": {
              "value":customerAge,
              "type":"integer"
            },
            "carAge": {
              "value":carAge,
              "type":"integer"
            },
	    "carPrice": {
              "value":carPrice,
              "type":"integer"
            },
            "carManufacturer": {
              "value": carManufacturer
            },
            "carType": {
                "value": carType
            }
          }
        }
      )
      .then((response) => {
        console.log(response);
        if (!response.data.ended) {
          document
            .getElementById("result")
            .setAttribute("class", "text-success text-center");
          document.getElementById("result").innerHTML = "Application Issued!";
          setTimeout(() => {
            document.getElementById("result").innerHTML = "";
          }, 3000);
        } else {
          document
            .getElementById("result")
            .setAttribute("class", "text-danger text-center");
          document.getElementById("result").innerHTML =
            "Application Rejected due To High Risk!";
          setTimeout(() => {
            document.getElementById("result").innerHTML = "";
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err, err.response);
      });
   //reset input fields
   document.getElementById("inp-customerName").value = "";
   document.getElementById("inp-customerAge").value = "";
   document.getElementById("inp-carAge").value = "";
   document.getElementById("inp-carPrice").value ="";
  }
};
postBtn.addEventListener("click", sendData);
