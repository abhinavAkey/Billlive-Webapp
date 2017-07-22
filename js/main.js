function validate()
{
    var AN=/[<>;:'"{}\|/]/;
    var RE=/^[a-zA-Z ]*$/;
    var NUM=/^[0-9]*$/;
    var EMAIL=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

     if( document.regform.firstName.value == "" || document.regform.lastName.value == "" || document.regform.company.value == "" || document.regform.lineOfBusiness.value == "" || document.regform.organizationDesc.value == "" || 
        document.regform.gstRegistrationNumber.value == "" || document.regform.phoneNumber.value == "" || document.regform.email.value == "" || document.regform.address.value == "" ||
        document.regform.website.value == "" || document.regform.country.value == "" || document.regform.state.value == "" || document.regform.district.value == "" || document.regform.city.value == "")
         {
            alert( "All Fields Are Mandatory" );
            return false;
         }
 
    else if(!document.regform.firstName.value.match(RE)){
        alert( "Enter valid First Name" );
        document.regform.firstName.focus();
        return false;
    }
    else if(!document.regform.lastName.value.match(RE)){
        alert( "Enter valid Last Name" );
        document.regform.lastName.focus();
        return false;
    }
    else if(document.regform.company.value.match(AN)){
        alert( "Enter valid Company" );
        document.regform.company.focus();
        return false;
    }
    else if(document.regform.lineOfBusiness.value.match(AN)){
        alert( "Enter valid Line Of Business" );
        document.regform.lineOfBusiness.focus();
        return false;
    }
    else if(document.regform.organizationDesc.value.match(AN)){
        alert( "Enter valid Organization Description" );
        document.regform.organizationDesc.focus();
        return false;
    }
    else if(document.regform.gstRegistrationNumber.value.match(AN)){
        alert( "Enter valid GST Registration Number" );
        document.regform.gstRegistrationNumber.focus();
        return false;
    }
    else if(!document.regform.phoneNumber.value.match(NUM) || document.regform.phoneNumber.value.length < 8){
        alert( "Enter valid Phone Number" );
        document.regform.phoneNumber.focus();
        return false;
    }
    else if(!document.regform.email.value.match(EMAIL)){
        alert( "Enter valid Email Id" );
        document.regform.email.focus();
        return false;
    }
    else if(document.regform.address.value.match(AN)){
        alert( "Enter valid Address" );
        document.regform.address.focus();
        return false;
    }
    else if(document.regform.website.value.match(AN)){
        alert( "Enter valid Website" );
        document.regform.website.focus();
        return false;
    }
    else if(!document.regform.city.value.match(RE)){
        alert( "Enter valid City Name" );
        document.regform.city.focus();
        return false;
    }
    return true;
}


$(document).ready(function(){
    $("#add").click(function(){

         var jsonData = '{"firstName" : "' + $('#firstName').val() + '", "lastName" : "' + $('#lastName').val() + '", "company" : "' + $('#company').val() + '", "legalOrTradingName" : "' + $('#legalOrTradingName').val() + '", "lineOfBusiness" : "' + $('#lineOfBusiness').val() + '", "organizationDesc" : "' + $('#organizationDesc').val() + '", "gstRegistrationNum" : "' + $('#gstRegistrationNum').val() + '", "website" : "' + $('#website').val() + '", "address" : "' + $('#address').val() + '", "country" : "' + $('#country').val() + '", "state" : "' + $('#state').val() + '", "district" : "' + $('#district').val() + '", "city" : "' + $('#city').val() + '", "phoneNumber" : "' + $('#phoneNumber').val() + '", "email" : "' + $('#email').val() + '", "typeOfUser" : "' + $('#typeOfUser').val() + '"}';
        // 
        console.log("jsonData**********",jsonData)
        $.ajax({                    
          url: 'http://192.168.0.18:8080/HibernateMVC/users/signup',     
          type: 'post', // performing a POST request
          data : jsonData,// will be accessible in $_POST['data1']
      
           dataType: 'json',                   
           success: function(data)         
            {
              // etc...
            } 
});
    });
});