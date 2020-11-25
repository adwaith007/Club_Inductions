var User= require("../models/user.js");

module.exports=function(user,appointment,req){
        if(user){
            let userbusy=false;
            user.appointments.forEach(function(appt){
                if(((new Date(appointment.start)>new Date(appt.start))&&(new Date(appointment.start)<new Date(appt.end)))||((new Date(appointment.end)>new Date(appt.start))&&(new Date(appointment.end)<new Date(appt.end)))){
                    userbusy=true;
                }
            })
            if(!userbusy){
                user.appointments.push(appointment);
                let sortfn = function(a,b){
                    if(a.start>b.start) return 1;
                    else if(b.start>a.start) return -1;
                    else return 0;
                }
                user.appointments.sort(sortfn);
                user.save();
            }
            else{
                req.flash("errors", "You already have an appointment during that time!!");
            }
        }
        
}