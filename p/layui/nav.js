// (function(){
//     var Ajax = function(){
//         var AjaxComponent = {
//             "render": function(){
//             }
//         }
        
//         return AjaxComponent;
//     }
    
// }())


(function(){
    var DashBoard = function(options){
        var DashBoardComponent = {
            "render": function(){
                var info = [
                    {
                        "code": "CS100",
                        "name": "Introduction to Programming",
                        "url": "CS100/index.html",
                        "cover": "//i-techx.github.io/image/CS100_cover.jpg",
                        "semester": "Fall 2019, Fall 2018"
                    },{
                        "code": "CS101",
                        "name": "Algorithms and Data Structures",
                        "url": "CS101/index.html",
                        "cover": "//i-techx.github.io/image/CS101_cover.png",
                        "semester": "Fall 2019, Fall 2018"
                    },{
                        "code": "CS120",
                        "name": "Computer Networks",
                        "url": "CS120/index.html",
                        "cover": "//i-techx.github.io/image/CS120_cover.jpg",
                        "semester": "Fall 2020, Fall 2019"
                    },{
                        "code": "CS132",
                        "name": "Software Engineering",
                        "url": "CS132/index.html",
                        "cover": "//i-techx.github.io/image/CS132_cover.png",
                        "semester": "Spring 2020, Spring 2019"
                    },{
                        "code": "CS152",
                        "name": "Applied Cryptography",
                        "url": "CS152/index.html",
                        "cover": "//i-techx.github.io/image/CS152_cover.png",
                        "semester": "Fall 2020"
                    },{
                        "code": "CS172",
                        "name": "Computer Vision I",
                        "url": "CS172/index.html",
                        "cover": "//i-techx.github.io/image/CS172_cover.jpg",
                        "semester": "Fall 2020, Fall 2019"
                    },{
                        "code": "CS181",
                        "name": "Artificial Intelligence I",
                        "url": "CS181/index.html",
                        "cover": "//i-techx.github.io/image/CS181_cover.jpg",
                        "semester": "Fall 2020, Fall 2019, Fall 2018"
                    },{
                        "code": "SI120",
                        "name": "Discrete Mathematics",
                        "url": "SI120/index.html",
                        "cover": "//i-techx.github.io/image/SI120_cover.jpg",
                        "semester": "Spring 2021, Spring 2020, Spring 2019, Spring 2018, Spring 2017"
                    },{
                        "code": "SI140-01",
                        "name": "Probability and Mathematical Statistics",
                        "url": "SI140-01/index.html",
                        "cover": "//i-techx.github.io/image/SI140-01_cover.jpg",
                        "semester": "Fall 2019"
                    },{
                        "code": "EE115",
                        "name": "Analog and Digital Circuits",
                        "url": "EE115/index.html",
                        "cover": "//i-techx.github.io/image/EE115_cover.jpg",
                        "semester": "Fall 2020"
                    },{
                        "code": "EE150",
                        "name": "Signals and Systems",
                        "url": "EE150/index.html",
                        "cover": "//i-techx.github.io/image/EE150_cover.jpeg",
                        "semester": "Spring 2020, Spring 2018, Spring 2017, Spring 2016"
                    }
                ]
        
                info.forEach(elem => {
                    if (elem.hasOwnProperty("status") && elem.status == "activate") {
                        document.getElementById('course-cards').innerHTML += '<div class="activate"><div class="layui-card" style="border-radius: 10px;"><div class="layui-card-body"><div class="layui-row"><div class="layui-col-md3"><a href="'+ elem.url +'"><img class="shadow" src="'+ elem.cover +'"style="width:100%;"></a></div><div class="layui-col-md9"><div style="margin: 5px 1em;"><div style="font-family: Quicksand; font-weight: bold; text-align: left; font-size: 2em;"><a href="'+ elem.url +'">'+ elem.name +'</a></div><div class="layui-row"><div class="layui-col-md9"><p style="padding-top: 1%; text-align: left; font-family: Quicksand; font-weight: bold; font-size: 1.2em; margin-bottom: 0.2em; color:#8FBC8F;">ACTIVATE</p></div></div><div class="layui-row"><div class="layui-col-md9"><p style="padding-top: 7%; text-align: left; font-size: 1.2em; margin-bottom: 0.2em;">'+ elem.code +'</p><p style="text-align: left; font-size: 1.2em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">'+ elem.semester +'</p></div><div class="layui-col-md3" style="padding-top: 5%; text-align: center;"><a href="'+ elem.url +'" class="layui-btn layui-btn-lg layui-btn-violet" style="font-weight: normal;">查看课程</a></div></div></div></div></div></div></div></div>';
                    } else {
                        document.getElementById('course-cards').innerHTML += '<div class="layui-card" style="border-radius: 10px;"><div class="layui-card-body"><div class="layui-row"><div class="layui-col-md3"><a href="'+ elem.url +'"><img class="shadow" src="'+ elem.cover +'"style="width:100%;"></a></div><div class="layui-col-md9"><div style="margin: 5px 1em;"><div style="font-family: Quicksand; font-weight: bold; text-align: left; font-size: 2em;"><a href="'+ elem.url +'">'+ elem.name +'</a></div><div class="layui-row"><div class="layui-col-md9"><p style="padding-top: 14%; text-align: left; font-size: 1.2em; margin-bottom: 0.2em;">'+ elem.code +'</p><p style="text-align: left; font-size: 1.2em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">'+ elem.semester +'</p></div><div class="layui-col-md3" style="padding-top: 12%; text-align: center;"><a href="'+ elem.url +'" class="layui-btn layui-btn-lg layui-btn-violet" style="font-weight: normal;">查看课程</a></div></div></div></div></div></div></div>';
                    }
                });
            }
        }
        
        return DashBoardComponent;
    }
    
    window.DashBoard = DashBoard;
}())