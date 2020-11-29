const membersBL = require('./membersBL');
const moviesBL = require('./moviesBL');
const Member = require('./memberModel');
const Movie = require('./movieModel');


exports.initDB = async function(){
    let members = await membersBL.getMemebers();
    let movies = await moviesBL.getMovies();

    pullDataFromMemebersWS(members);
    pullDataFromMoviesWS(movies);

}

function pullDataFromMemebersWS(members){
    //check if db Initialized before (members collection)
    Member.find({}, function(err, membs){    
        if(err){
            console.log("An error occured while try to read from DB (member collection), please restart the server!")
        }
        else{
            console.log("Succeed reading from DB (members collection!");
            if(membs.length == 0){   //first time try to read data from WS members, so now will update the DB with that data
                let isMembersUpdated = true;
                //insert all members from members WS to db
                members.forEach(element => {
                    let memb  = new Member({
                        name: element.name,
                        email: element.email,
                        city: element.city
                    })
 
                    memb.save(function(err, member) {
                        if(err){
                            isMembersUpdated = false;
                            console.log(`error while try to save the member: ${element.name} in db`);
                        }
                    
                    });
                    
                });

                if(isMembersUpdated){
                    console.log("*** All members from WS memebers are updated in DB now!!! ***")
                }
            }
            else{   //Data from members WS is already in DB
                console.log("Members Collection are updated already!");

            }
        }
    })
}

function pullDataFromMoviesWS(movies){
    //check if db Initialized before (movies collection)
    Movie.find({}, function(err, movs){    
        if(err){
            console.log("An error occured while try to read from DB (movie collection), please restart the server!")
        }
        else{
            console.log("Succeed reading from DB (movies collecion!");
            if(movs.length == 0){   //first time try to read data from WS movies, so now will update the DB with that data
                let isMoviesUpdated = true;
                //insert all movies from movies WS to db
                movies.forEach(element => {
                    let mov  = new Movie({
                        name: element.name,
                        genres: element.genres,
                        image: element.image,
                        premiered: element.premiered
                    })
 
                    mov.save(function(err, movie) {
                        if(err){
                            isMoviesUpdated = false;
                            console.log(`error while try to save the movie: ${element.name} in db`);
                        }
                    
                    });
                    
                });

                if(isMoviesUpdated){
                    console.log("*** All movies from WS movies are updated in DB now!!! ***")
                }
            }
            else{   //Data from movies WS is already in DB
                console.log("Movies Collection are updated already!");

            }
        }
    })

}
