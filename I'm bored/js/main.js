const jq = require('jquery');
const request = require('request');
const $ = require('cheerio');

let arrayFree, arrayHome, arraySport, arrayRandom = [];

new Vue({
    el: '#app',
    data: {
        show: true,
        city: "none",
        type: "",
        curEvents: [],
        event: "",
        comment: "",
        eventPlace: null
    },
    methods: {
        getEvents: function () {
            let url = "https://" + this.city + ".vgorode.ua/afisha/";
            getPromise(url).then(
                result => {
                    this.curEvents = result;
                },
                error => {
                    return error;
                }
            );
        },
        giveEvent: function () {
            if (this.type === "event" && this.city !== "none") {
                if(this.curEvents.length !== 0) {
                    this.eventPlace = this.curEvents[Math.floor(Math.random() * this.curEvents.length)];
                    return;
                }
                else {
                    var obj = {
                        title: "На сегодня мероприятий нет",
                        tags: "",
                        place: "",
                        img: ""
                    }
                    this.eventPlace = obj;
                    return;
                }

            }
            let fullEvent = this.curEvents[Math.floor(Math.random() * this.curEvents.length)].split('.');
            this.event = fullEvent.splice(0, 1).toString();
            this.comment = fullEvent.join(". ");
        }
    },
    computed: {
        changeArr: function () {
            if (this.type === 'free') {
                this.curEvents = arrayFree;
                console.log(this.curEvents);
            }
            else if (this.type === 'home') {
                this.curEvents = arrayHome;
            }
            else if (this.type === 'sport') {
                this.curEvents = arraySport;
            }
            else if (this.type === 'random') {
                this.curEvents = arrayRandom;
            }
            else if (this.type === 'event') {
                this.getEvents();
            }
        }
    }
});


function json() {
    jq.getJSON('../js/events.json', function (json) {
        for (let i = 0; i < json.length; i++) {
            if (json[i].type === 'free') {
                arrayFree = json[i].events;
            }
            else if (json[i].type === 'home') {
                arrayHome = json[i].events;
            }
            else if (json[i].type === 'sport') {
                arraySport = json[i].events;
            }
            else if (json[i].type === 'random') {
                let allObj = [];
                json.forEach(obj => allObj = allObj.concat(obj.events));
                arrayRandom = allObj;
            }
        }
    });
}

function getPromise(url) {
    return new Promise(function (resolve, reject) {
        request(url, (error, response, body) => {
            if (!error) {
                let length = $('.art_cell', body).length;

                let arrTitle = $('.title > a', body).map(function () {
                    return $(this).text();
                }).toArray();

                let arrImg = $('.img > a > img', body).map(function () {
                    return $(this).attr('data-href');
                }).toArray();


                let arrTags = $('.ctgr', body).map(function () {
                    return $(this).text();
                }).toArray();


                let arrPlace = $('.info > a', body).map(function () {
                    return $(this).text();
                }).toArray();


                let objArr = [];
                for (let i = 0; i < length; i++) {
                    let obj = {
                        title: arrTitle[i],
                        tags: arrTags[i],
                        place: arrPlace[i],
                        img: arrImg[i]
                    };
                    objArr.push(obj);
                }
                resolve(objArr);
            }
            else {
                return reject(error);
            }
        })
    })
}


json();