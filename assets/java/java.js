$(document).ready(function() {

    var config = {
        apiKey: "AIzaSyD6PlneWj2HADezF-789sx-DxDAJ0DfpN0",
        authDomain: "testproject1-be755.firebaseapp.com",
        databaseURL: "https://testproject1-be755.firebaseio.com",
        projectId: "testproject1-be755",
        storageBucket: "testproject1-be755.appspot.com",
        messagingSenderId: "396198600089"
    };
    firebase.initializeApp(config);
    var database=firebase.database();


    var empdata = {
        additem: function(){
            database.ref("/traintime").set({
                emparray:emparray
            });
        },
        init: function(){
            database.ref("/traintime").on("value", 
            function(snapshot) {
                emparray=snapshot.val().emparray;
        
                if(emparray!==null){
                    console.log(emparray);
                    for(var i=currentindex; i<emparray.length; i++){
                        if(emparray[i]!==undefined && emparray[i]!==null){
                            var curtime= new Date();
                            var cstart=emparray[i][2];
                            var crate=emparray[i][3];
                            var chours=parseInt(curtime.getHours());
                            var cmin=parseInt(curtime.getMinutes());
                            console.log("chours: "+chours+" cmin: "+cmin)
                           // var time_day_diff=moment(cstart).fromnow();
                           // console.log(time_day_diff);
                            console.log("start hours: "+cstart.split(":")[0]+" startmin: "+cstart.split(":")[1]);
                            var dhours=chours-parseInt(cstart.split(":")[0]);
                            var dmin=cmin-parseInt(cstart.split(":")[1]);
                            console.log("dhours: "+dhours+" dmin: "+dmin);

                            var nextarr="";
                            var minaway="";
                            var nextmin=0;
                            var startmin=parseInt(cstart.split(":")[1])+(parseInt(cstart.split(":")[0])*60);
                            console.log ("startmin: "+startmin)
                            var nexthour=0;

                            var hourstring="";
                            var minstring="";
                            


                            if (dhours>0 || (dhours===0 && cmin>parseInt(cstart.split(":")[1]))){
                                console.log("after start");
                                dmin=dmin+(dhours*60);
                                console.log("dmin: "+dmin)
                                minaway=crate-(dmin%crate);
                                console.log("minaway: "+minaway);
                                console.log("crate: "+crate);
                                nextmin=dmin+(dmin%crate);
                                console.log("nextmin: "+nextmin+" dmin mod crate: "+dmin%cmin);
                                console.log("the collected min: "+(startmin+dmin+minaway));
                                nexthour=Math.floor((startmin+dmin+minaway)/60);
                                if (Math.floor((startmin+dmin+minaway)/60)<10){
                                    hourstring="0"+nexthour;
                                }
                                else{
                                    hourstring=nexthour;

                                }
                                if(((startmin+dmin+minaway)%60)<10){
                                    minstring="0"+((startmin+dmin+minaway)%60);
                                }
                                else{
                                    minstring=((startmin+dmin+minaway)%60);
                                }
                                nextarr=hourstring+":"+minstring;

                            }
                            if(dhours<0 || (dhours===0 && cmin<parseInt(cstart.split(":")[1]))){
                                console.log("before start");
                                nextarr=cstart;
                                minaway= -(dhours*60)+parseInt(cstart.split(":")[1]);
                            }
                            if((dmin%crate)==0 && (chours==23 && (minaway+cmin)>60)){
                                console.log("end of day");
                                nextarr="Tomorrow at "+cstart;
                                minaway="Tomorrow";
                            }

                            $("#thebody").append("<tr><td>"+emparray[i][0]+"</td><td>"+emparray[i][1]+"</td><td>Every "+emparray[i][3]+" Minutes</td><td>"+nextarr+"</td><td>"+minaway+"</td></tr>");
                        }
                    }
                    currentindex=emparray.length;
                    console.log(emparray);                    
                }
                else{
                    console.log("emparray was null");
                }
            }, 
            function(errorObject) {
                console.log("there is no saved cloud info");
            });

        },
    }


    var currentindex=0;
    var emparray=[];
    var name="";
    var destination="";
    var start="";
    var rate=0;
    var row="";
    var counter=0;


    empdata.init();
    if (emparray==undefined){
        emparray=[];
    }

    $("#new-form").on("submit", function(event) {
        event.preventDefault();
        name=$("#name-input").val().trim();
        destination=$("#dest-input").val().trim();
        start=$("#start-input").val().trim();
        rate=$("#rate-input").val().trim();
        $("#name-input").val("");
        $("#dest-input").val("");
        $("#start-input").val("");
        $("#rate-input").val("");
        
        emparray.push([name,destination,start,rate]);
        empdata.additem();
    });

  $("#cleararr").on("click", function(event) {
       database.ref("/traintime").set({
           emparray:[]
        });
  });

 //  setInterval(empdata.init(), 60000);

});