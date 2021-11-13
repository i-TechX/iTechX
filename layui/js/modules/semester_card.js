layui.define(['jquery', 'util', 'element', 'rate'], function(exports){

    var $ = layui.jquery,
        util = layui.util;

    var semester_card = (function(options){
        var assign = function(defaultValue, value){
            output = {};
            for (var k in defaultValue)
                output[k] = defaultValue[k];
            for (var k in value)
                output[k] = value[k];
            return output;
        };

        const queryStringify = query => {
            const queryString = Object.keys(query)
              .map(key => `${key}=${encodeURIComponent(query[key] || '')}`)
              .join('&')
            return queryString
        }

        const queryParse = (search = window.location.search) => {
            if (!search) return {}
            const queryString = search[0] === '?' ? search.substring(1) : search
            const query = {}
            queryString
              .split('&')
              .forEach(queryStr => {
                const [key, value] = queryStr.split('=')
                /* istanbul ignore else */
                if (key) query[decodeURIComponent(key)] = decodeURIComponent(value)
              })
          
            return query
          }

        options = assign({
            proxy: 'https://ghproxy.com/',
            baseURL: 'https://api.github.com',
        }, options);

        var accessToken = options.accessToken || window.localStorage.getItem('GT_ACCESS_TOKEN');
        var headers = {
            'Accept': 'application/json',
        }
        if (accessToken) {
            headers['Authorization'] = 'token ' + accessToken;
        }

        var cardComponent = {
            construct: function(callback) {
                const query = queryParse();
                if (query.course_code) {
                    this.course_code = query.course_code;
                    $.ajax({
                        url: options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/courses/" + query.course_code + "/meta.json",
                        type: "GET",
                        data: {
                            'ref': 'file-base'
                        },
                        headers: headers,
                        success: function (data) {
                            if (data && data.content) {
                                var string = decodeURIComponent(escape(window.atob(data.content.replace(/[\r\n]/g,""))));
                                var content = JSON.parse(string);
                                cardComponent.content = content;
                            } else {
                                console.log('data error:', data);
                            }
                            if (callback) callback();
                        },
                        error: function(err) {
                            console.log(err);
                            if (callback) callback();
                        }
                    })
                } else {
                    if (callback) callback();
                }
            },

            getPeople: function(callback) {
                $.ajax({
                    url: options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/people/meta.json",
                    type: "GET",
                    data: {
                        'ref': 'file-base'
                    },
                    headers: headers,
                    success: function (data) {
                        if (data && data.content) {
                            var string = decodeURIComponent(escape(window.atob(data.content.replace(/[\r\n]/g,""))));
                            var content = JSON.parse(string);
                            cardComponent.people = content;
                        } else {
                            console.log('data error:', data);
                        }
                        if (callback) callback();
                    },
                    error: function(err) {
                        console.log(err);
                        if (callback) callback();
                    }
                })
            },

            config: function(options_) {
                options = assign(options, options_);
            },

            render_: function(container){
                node = window.document.getElementById(container);
                content = this.content;
                cards = "";

                if (content == undefined) {
                    node.innerHTML = '<div style="text-align: center;">\
                        <h1 style="text-align: center; font-size: 5em; line-height: 1.3em; margin: 5rem 0 0 0; padding: 0; text-shadow: 0 0 1rem #fefefe; font-family: Quicksand, Arial; color: #b4b4b4;">404 ERROR...</h1>\
                        <p style="text-align: center; font-size: 1em; line-height: 1.3em; margin-bottom: 6px; padding: 0; text-shadow: 0 0 1rem #fefefe; font-family: Quicksand, Arial; color: #b4b4b4;">Please double check the course code, or...</p>\
                        <p style="text-align: center; font-size: 1em; line-height: 1.3em; margin-bottom: 3rem; padding: 0; text-shadow: 0 0 1rem #fefefe; font-family: Quicksand, Arial; color: #b4b4b4;">you have not logged in and have reached github\'s request rate limit.</p>\
                        <div style="position: relative;width: 200px;height: 200px; margin:auto;">\
                            <svg viewBox="0 0 120 120" style="overflow: visible"> <defs> <path id="a" d="M0 4.21585531V.05647427h4.15889198v4.15938104H0z"></path> </defs> <g fill="none" fill-rule="evenodd"> <g class="stars animated"> <path d="M32.9862439 29.2981615c.1110863.8208744-.4626987 1.5770446-1.2847376 1.6881041-.8210729.1110595-1.5764599-.4635526-1.6875462-1.2844271-.1120523-.8208744.4626987-1.5760789 1.2837716-1.6881041.8220388-.1110595 1.5774259.4635526 1.6885122 1.2844271" fill="#D0E7FB"></path> <path d="M100.94858 6.8876353c-.214287.79954375-1.0363503 1.27471744-1.8366061 1.06131608-.7983596-.21340136-1.2743411-1.03570792-1.0610028-1.83620012.2142866-.80049221 1.0363503-1.2756659 1.8366062-1.06131609.8002557.21434981 1.2752897 1.03570792 1.0610027 1.83620013" fill="#D0E7FB"></path> <g transform="translate(0 69)"> <mask id="b" fill="#fff"> <use xlink:href="#a"></use> </mask> <path d="M4.0876 2.6727c-.296 1.109-1.436 1.769-2.545 1.472-1.109-.297-1.768-1.436-1.472-2.546.297-1.109 1.436-1.768 2.546-1.471 1.11.296 1.768 1.436 1.471 2.545" fill="#A1D2F8" mask="url(#b)"></path> </g> <path d="M106.948688 111.887537c-.212978.799632-1.035129 1.275692-1.835888 1.060907-.80076-.213855-1.276008-1.035802-1.06117-1.835434.212978-.799632 1.036059-1.275692 1.835888-1.061837.80076.213855 1.275078 1.036732 1.06117 1.836364" fill="#A1D2F8"></path> <path d="M54.2354557 18.9014571c-1.5953959-.4199186-2.556853-2.0704598-2.1369062-3.6657486.4209514-1.5962933 2.0705988-2.5576859 3.6659948-2.1367627 1.5953959.4209232 2.556853 2.0704598 2.1369062 3.6657486-.4209514 1.5952888-2.0695942 2.5566813-3.6659948 2.1367627z" stroke="#A1D2F8" stroke-width="2"></path> <path d="M16.9721415 7.59675618c.2239612 1.64109572-.9269786 3.15263122-2.5690262 3.37559532-1.640039.222964-3.1515262-.9270082-3.3754875-2.56810392-.2229569-1.64210006.9279829-3.1536356 2.5690262-3.37659964 1.6410433-.22296405 3.1525306.92700817 3.3754875 2.56910824" fill="#A1D2F8"></path> <path d="M49.2357085 117.901451c-1.5962933-.419947-2.5576859-2.070599-2.1367627-3.665995.4209232-1.595396 2.0704598-2.556853 3.6657486-2.136907 1.5952888.420952 2.5566813 2.070599 2.1367627 3.665995-.4209231 1.595396-2.0694552 2.556853-3.6657486 2.136907z" stroke="#A1D2F8" stroke-width="2"></path> </g> <g class="rocket animated"> <path fill="#F2F9FE" d="M53.9118329 92L44 81.3510365 50.0881671 76 60 86.6489635z"></path> <path stroke="#A1D2F8" stroke-width="2" stroke-linejoin="round" d="M53.9118329 92L44 81.3510365 50.0881671 76 60 86.6489635z"></path> <path fill="#FFF" d="M57 47.0157449L49.8317064 42 24 60.6301909 49.2570499 62z"></path> <path fill="#F2F9FE" d="M87.754216 81L92 88.7814042 71 113l1.16221-25.7194181z"></path> <path d="M108.233532 59.9703727c10.579453-16.2472813 10.22216-27.2231872 9.399093-31.6550767v-.0029805c-.413027-5.3975467-5.752516-6.357243-5.752516-6.357243-4.3323-1.2656865-15.2362027-2.7350352-32.5037006 6.126757-22.9294458 11.767705-28.5485982 30.6029873-28.5485982 30.6029873s-4.8199707 15.3392457 1.1942938 22.6243939c.0288621.0387455.0467766.0824584.0806149.1192169.0338383.0377521.0716576.0695432.1054959.1072953.0328431.037752.0627005.0784845.0965388.1162365.0328431.0357651.0746433.0596084.1104722.0923931 6.6512212 6.7099265 22.4268471 3.4771606 22.4268471 3.4771606s19.3415882-3.6718816 33.3914591-25.2511404" fill="#FFF"></path> <path d="M108.214668 59.904736c10.318007-15.8150644 10.338974-26.7477325 9.407418-31.913642-.442314-5.0236555-4.362238-6.8839002-6.034646-7.4529163-.310519-.105447-.646997-.2198471-.998452-.2795341-.309521-.0885357-.642005-.1750818-.993461-.2586436.726874 5.517068.100844 16.050828-9.569167 30.8730987-13.9234193 21.3450646-32.8900212 25.1550846-33.6897816 25.3062916-.5082122.1044523-10.6714593 2.1099353-18.3365784-.7391239.5171983 1.9637021 1.3359293 3.8090251 2.610953 5.3509392l.1936998.233774 1.710349-1.3658374-1.5745595 1.5259975.2546054.2397428c7.1129749 7.0052638 22.6978186 3.9154669 23.3298389 3.7861451.8007589-.151207 19.7663623-3.961227 33.6897814-25.3062916" fill="#F2F9FE"></path> <g> <path d="M77.0779 50.9007l4.331 4.795-8.215 7.421c-.817.738-.623 1.045.429.688l17.561-6.405c1.053-.358 1.261-1.362.463-2.245l-4.331-4.795 8.215-7.421c.818-.738.623-1.045-.43-.69l-17.56 6.407c-1.054.356-1.261 1.362-.463 2.245" fill="#FFF"></path> <path d="M77.0779 50.9007l4.331 4.795-8.215 7.421c-.817.738-.623 1.045.429.688l17.561-6.405c1.053-.358 1.261-1.362.463-2.245l-4.331-4.795 8.215-7.421c.818-.738.623-1.045-.43-.69l-17.56 6.407c-1.054.356-1.261 1.362-.463 2.245" stroke="#A1D2F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> <path d="M108.233532 59.9703727c10.579453-16.2472813 10.22216-27.2231872 9.399093-31.6550767v-.0029805c-.413027-5.3975467-5.752516-6.357243-5.752516-6.357243-4.3323-1.2656865-15.2362027-2.7350352-32.5037006 6.126757-22.9294458 11.767705-28.5485982 30.6029873-28.5485982 30.6029873s-4.8199707 15.3392457 1.1942938 22.6243939c.0288621.0387455.0467766.0824584.0806149.1192169.0338383.0377521.0716576.0695432.1054959.1072953.0328431.037752.0627005.0784845.0965388.1162365.0328431.0357651.0746433.0596084.1104722.0923931 6.6512212 6.7099265 22.4268471 3.4771606 22.4268471 3.4771606s19.3415882-3.6718816 33.3914591-25.2511404z" stroke="#A1D2F8" stroke-width="2"></path> <path stroke="#A1D2F8" stroke-width="2" stroke-linejoin="round" d="M57 47.0157449L49.8317064 42 24 60.6301909 49.2570499 62z"></path> <path d="M65 72l-31 28" stroke="#A1D2F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M110.154443 64.7093112c1.02326.8964969 1.133632 2.4760391.244468 3.5099781l-5.959048 6.9262459c-.888132 1.033939-2.452937 1.1453504-3.476197.2478122l-.117593-.1030815c-1.0242917-.896497-1.133632-2.4760392-.2455-3.508937l5.96008-6.9272871c.888132-1.033939 2.452937-1.1443091 3.476197-.2478122l.117593.1030816z" fill="#FFF"></path> <path d="M110.154443 64.7093112c1.02326.8964969 1.133632 2.4760391.244468 3.5099781l-5.959048 6.9262459c-.888132 1.033939-2.452937 1.1453504-3.476197.2478122l-.117593-.1030815c-1.0242917-.896497-1.133632-2.4760392-.2455-3.508937l5.96008-6.9272871c.888132-1.033939 2.452937-1.1443091 3.476197-.2478122l.117593.1030816z" stroke="#A1D2F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path fill="#D0E7FB" d="M91 85.8362964L88.1804586 81l-15.890329 5.9908294L72 93z"></path> <path stroke="#A1D2F8" stroke-width="2" stroke-linejoin="round" d="M87.754216 81L92 88.7814042 71 113l1.16221-25.7194181z"></path></g></g></svg>\
                        </div>\
                    </div>\
                    <div class="layui-footer" style="margin:2em;">                                                                                              \
                        <!-- 底部固定区域 -->                                                                                                \
                        <p style="display:flex; justify-content: center;">© 2020-2021 iTechX - MIT license.</p>                             \
                    </div>';
                    return;
                }

                cards += '                                                                                \
                    <h1 style="font-family: Quicksand; margin: 1em;"><b>' + content.name + '</b></h1>     \
                    <hr>                                                                                  \
                    <div class="layui-row"><div class="layui-col-sm9">                                    \
                ';

                for (const idx in content.semesters) {
                    const semester = content.semesters[idx];
                    const key = semester.course_id + '_' + semester.season + '_' + semester.year;
                    cards += '                                                                          \
                    <div class="menu" semester="' + key + '" style="margin-bottom:1.5em;">                                           \
                        <div class="layui-card">                                                        \
                            <div class="layui-card-body">                                               \
                                <div class="layui-row" style="padding-top: 1em; padding-bottom: 1em;">  \
                                    <div class="layui-col-md2">                                         \
                                        <div class="semester">                                          \
                                            <div class="semester_season">' + semester.season + '</div> \
                                            <div class="semester_year">' + semester.year + '</div>      \
                                        </div>                                                          \
                                    </div>                                                              \
                                    <div class="layui-col-md10">                                        \
                                        <div style="margin: 5px 1em;">                                  \
                                            <div class="layui-row" style="font-family: Quicksand;">     \
                                                <div class="layui-col-md4">                             \
                                                    <div style="margin: 5px;">                          \
                                                        <b>Instructor 教师：</b>                        \
                                                    </div>                                              \
                    ';

                    for (const pid in semester.teacher) {
                        if (Object.hasOwnProperty.call(this.people, semester.teacher[pid])) {
                            const pinfo = this.people[semester.teacher[pid]];
                            cards += '                                          \
                            <div class="instructor">                            \
                                <a href="people?pid='+semester.teacher[pid]+'">                         \
                                <div><img src="' + (pinfo.image ? pinfo.image : "layui/images/teacher.jpg") + '" style="border-radius: 50%; width: 60px; height: 60px;"></div> \
                                <div>' + pinfo.name + '</div>                   \
                                </a>                                            \
                            </div>                                              \
                            ';
                        }
                    }
                    
                    cards += '                                  \
                        </div>                                  \
                        <div class="layui-col-md8">             \
                        <div style="margin: 5px;">              \
                            <b>Teaching Assistant 助教：</b>    \
                        </div>                                  \
                    ';

                    for (const pid in semester.ta) {
                        if (Object.hasOwnProperty.call(this.people, semester.ta[pid])) {
                            const pinfo = this.people[semester.ta[pid]];
                            cards += '                                          \
                            <div class="instructor">                            \
                                <a href="people?pid='+semester.ta[pid]+'">                         \
                                <div><img src="' + (pinfo.image ? pinfo.image : "layui/images/teacher.jpg") + '" style="border-radius: 50%; width: 60px; height: 60px;"></div> \
                                <div>' + pinfo.name + '</div>                   \
                                </a>                                            \
                            </div>                                              \
                            ';
                        }
                    }
                                                
                    cards += '                                                                                          \
                                                </div>                                                                  \
                                                <div class="layui-col-md12" style="margin: 0.5em 0;"></div>             \
                                                <div class="layui-col-md6">                                             \
                                                    <b>课程编号：</b>' + semester.course_id + '                                     \
                                                </div>                                                                   \
                                                <div class="layui-col-md6">                                             \
                                                    <b>开课单位：</b>' + semester.department + '                                     \
                                                </div>                                                                   \
                                                <div class="layui-col-md6">                                             \
                                                    <b>学分：</b>' + semester.credit + '                                                      \
                                                </div>                                                                  \
                                                <div class="layui-col-md6">                                              \
                                                    <b>学时：</b>' + semester.hours + '                                                     \
                                                </div>                                                                  \
                                                <div class="layui-col-md6">                                             \
                                                    <b>先修课程：</b>' + semester.prerequisite + '                                                   \
                                                </div>                                                                  \
                                                <div class="layui-col-md12">                                            \
                                                    <b>评分标准：</b>' + semester.evaluation + '                                                   \
                                                </div>                                                                  \
                                            </div>                                                                      \
                                            <div class="layui-row" style="padding-top: 1em;">                           \
                                                ';
                                            if (semester.mainpage)
                                                cards += '<a href="'+semester.mainpage+'" class="layui-btn layui-btn-lg layui-btn-violet" style="font-weight: normal; float: right;">查看主页</a>';
                                            else
                                                cards += '<a href="javascript:;" class="layui-btn layui-btn-lg layui-btn-violet layui-btn-disabled" style="font-weight: normal; float: right;">查看主页</a>';
                                            cards += '\
                                            </div>                                                                      \
                                        </div>                                                                          \
                                    </div>                                                                              \
                                </div>                                                                                  \
                            </div>                                                                                      \
                        </div>                                                                                          \
                    ';
                                                
                    cards += '</div>';
                }

                cards += '                                                                                                                  \
                        </div>                                                                                                              \
                        <div class="layui-col-sm3">                                                                                         \
                        <div id="rate-container" style="margin: 2em;">\
                            <p><b>iTechX 评分</b></p>\
                            <div style="text-align: center;"><i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop" style="font-size: 2em; color: #b4b4b4;"></i></div>\
                        </div>\
                            <div style="margin: 2em;">                                                                                      \
                                <p><b>重要课程日期</b></p>                                                                                   \
                                <blockquote class="layui-elem-quote" style="font-weight: bold; margin-bottom: 0;">' + util.toDateString(new Date(), '今天是 yyyy年MM月dd日 HH:mm UTC+8') + '</blockquote>   \
                                <blockquote class="layui-grey-quote">                                                                       \
                                    ' + (cardComponent.hasOwnProperty('userInfo') ? '您拥有完全的访问许可。' : '您拥有受限制的访问许可。登录以获取完全的访问许可。') + '\
                                </blockquote>                                                                                               \
                            </div>                                                                                                          \
                        </div>                                                                                                              \
                    </div>                                                                                                                  \
                    <div id="gitalk-container"></div>\
                    <div class="layui-footer" style="margin:2em;">                                                                          \
                        <!-- 底部固定区域 -->                                                                                                \
                        <p style="display:flex; justify-content: center;">© 2020-2021 iTechX - MIT license.</p>                             \
                    </div>                                                                                                                  \
                ';

                node.innerHTML = cards;
                var card_elements = node.getElementsByClassName("menu");

                const gitalk = new Gitalk({
                    clientID: options.clientID,
                    clientSecret: options.clientSecret,
                    repo: options.repo,      // The repository of store comments,
                    owner: options.owner,
                    admin: options.admin,
                    id: this.course_code,
                    distractionFreeMode: true  // Facebook-like distraction free mode
                })
                
                if (this.course_code) this.loadRatings('rate-container');
                if (this.course_code) gitalk.render('gitalk-container');

                for (var idx = 0; idx < card_elements.length; idx++) {
                    var e = card_elements[idx];
                    this.loadFolders(e);
                }
            },

            loadRatings: function(element) {
                element = document.getElementById(element);
                if (!cardComponent.hasOwnProperty('userInfo')) {
                    var html = '\
                    <p><b>iTechX 评分</b></p>\
                    <div class="layui-row" style="margin-bottom: 10px;">\
                        <div class="layui-col-md4">\
                            <p style="font-size: 36px; font-family: Quicksand; padding: 5px 0 10px 10px;">-.-</p>\
                        </div>\
                        <div class="layui-col-md8">\
                            <div id="star-rating"></div>\
                            <h1 style="text-align: left; padding-left: 4px; font-size: 1em; text-shadow: 0 0 1rem #fefefe; color: #b4b4b4;">登录以查看评分</h1>\
                        </div>\
                    </div>\
                    <hr>\
                    <div class="layui-row">\
                        <div class="layui-col-md2">\
                            <p style="color:rgba(0, 0, 0, 0.5);" title="力荐">5星</p>\
                        </div>\
                        <div class="layui-col-md8" style="padding-top:8px;">\
                            <div class="layui-progress" style="margin: auto;">\
                                <div class="layui-progress-bar layui-bg-violet" lay-percent="0%"></div>\
                            </div>\
                        </div>\
                        <div class="layui-col-md2" style="padding-top:4px;">\
                            <p style="padding-left: 5px; font-size: 12px; color:rgba(0, 0, 0, 0.5);">0.0%</p>\
                        </div>\
                    </div>\
                    <div class="layui-row">\
                        <div class="layui-col-md2">\
                            <p style="color:rgba(0, 0, 0, 0.5);" title="推荐">4星</p>\
                        </div>\
                        <div class="layui-col-md8" style="padding-top:8px;">\
                            <div class="layui-progress" style="margin: auto;">\
                                <div class="layui-progress-bar layui-bg-violet" lay-percent="0%"></div>\
                            </div>\
                        </div>\
                        <div class="layui-col-md2" style="padding-top:4px;">\
                            <p style="padding-left: 5px; font-size: 12px; color:rgba(0, 0, 0, 0.5);">0.0%</p>\
                        </div>\
                    </div>\
                    <div class="layui-row">\
                        <div class="layui-col-md2">\
                            <p style="color:rgba(0, 0, 0, 0.5);" title="还行">3星</p>\
                        </div>\
                        <div class="layui-col-md8" style="padding-top:8px;">\
                            <div class="layui-progress" style="margin: auto;">\
                                <div class="layui-progress-bar layui-bg-violet" lay-percent="0%"></div>\
                            </div>\
                        </div>\
                        <div class="layui-col-md2" style="padding-top:4px;">\
                            <p style="padding-left: 5px; font-size: 12px; color:rgba(0, 0, 0, 0.5);">0.0%</p>\
                        </div>\
                    </div>\
                    <div class="layui-row">\
                        <div class="layui-col-md2">\
                            <p style="color:rgba(0, 0, 0, 0.5);" title="较差">2星</p>\
                        </div>\
                        <div class="layui-col-md8" style="padding-top:8px;">\
                            <div class="layui-progress" style="margin: auto;">\
                                <div class="layui-progress-bar layui-bg-violet" lay-percent="0%"></div>\
                            </div>\
                        </div>\
                        <div class="layui-col-md2" style="padding-top:4px;">\
                            <p style="padding-left: 5px; font-size: 12px; color:rgba(0, 0, 0, 0.5);">0.0%</p>\
                        </div>\
                    </div>\
                    <div class="layui-row">\
                        <div class="layui-col-md2">\
                            <p style="color:rgba(0, 0, 0, 0.5);" title="很差">1星</p>\
                        </div>\
                        <div class="layui-col-md8" style="padding-top:8px;">\
                            <div class="layui-progress" style="margin: auto;">\
                                <div class="layui-progress-bar layui-bg-violet" lay-percent="0%"></div>\
                            </div>\
                        </div>\
                        <div class="layui-col-md2" style="padding-top:4px;">\
                            <p style="padding-left: 5px; font-size: 12px; color:rgba(0, 0, 0, 0.5);">0.0%</p>\
                        </div>\
                    </div>\
                    ';
                    element.innerHTML = html;

                    layui.element.render('progress');
                    layui.rate.render({
                        elem: '#star-rating'
                        ,value: 0 //初始值
                        ,half: true //开启半星
                        ,readonly: true
                    });
                    return;
                }

                renderRating = function (r, selfRating, issueID) {
                    var people = (r[0]+r[1]+r[2]+r[3]+r[4]);
                    if (people == 0)
                        var points = '-.-';
                    else
                        var points = ((r[0]*10+r[1]*8+r[2]*6+r[3]*4+r[4]*2) / (r[0]+r[1]+r[2]+r[3]+r[4])).toFixed(1);

                    var maxp = Math.max(r[0],r[1],r[2],r[3],r[4]);

                    var myRate = undefined;
                    if (selfRating) {
                        myRate = selfRating.content;

                        if (myRate == 'hooray')
                            myRate = 5;
                        else if (myRate == 'laugh')
                            myRate = 4;
                        else if (myRate == 'rocket')
                            myRate = 3;
                        else if (myRate == 'confused')
                            myRate = 2;
                        else if (myRate == 'eyes')
                            myRate = 1;

                    }

                    var html = '\
                    <p><b>iTechX 评分</b></p>\
                    <div class="layui-row" style="margin-bottom: 10px;">\
                        <div class="layui-col-md4">\
                            <p style="font-size: 36px; font-family: Quicksand; padding: 5px 0 10px 10px;">' + points + '</p>\
                        </div>\
                        <div class="layui-col-md8">\
                            <div id="star-rating"></div>\
                            <p style="font-size: 10px; position:relative; top:-10px; left:3px;">'+people+'人评价</p>\
                        </div>\
                    </div>\
                    <hr>\
                    <div class="layui-row">\
                        <div class="layui-col-md2">\
                            <p style="color:rgba(0, 0, 0, 0.5);" title="力荐">5星</p>\
                        </div>\
                        <div class="layui-col-md8" style="padding-top:8px;">\
                            <div class="layui-progress" style="margin: auto;">\
                                <div class="layui-progress-bar layui-bg-violet" lay-percent="'+ (maxp?r[0]/maxp*100:0) +'%"></div>\
                            </div>\
                        </div>\
                        <div class="layui-col-md2" style="padding-top:4px;">\
                            <p style="padding-left: 5px; font-size: 12px; color:rgba(0, 0, 0, 0.5);">'+(people?r[0]/people*100:0).toFixed(1)+'%</p>\
                        </div>\
                    </div>\
                    <div class="layui-row">\
                        <div class="layui-col-md2">\
                            <p style="color:rgba(0, 0, 0, 0.5);" title="推荐">4星</p>\
                        </div>\
                        <div class="layui-col-md8" style="padding-top:8px;">\
                            <div class="layui-progress" style="margin: auto;">\
                                <div class="layui-progress-bar layui-bg-violet" lay-percent="'+ (maxp?r[1]/maxp*100:0) +'%"></div>\
                            </div>\
                        </div>\
                        <div class="layui-col-md2" style="padding-top:4px;">\
                            <p style="padding-left: 5px; font-size: 12px; color:rgba(0, 0, 0, 0.5);">'+(people?r[1]/people*100:0).toFixed(1)+'%</p>\
                        </div>\
                    </div>\
                    <div class="layui-row">\
                        <div class="layui-col-md2">\
                            <p style="color:rgba(0, 0, 0, 0.5);" title="还行">3星</p>\
                        </div>\
                        <div class="layui-col-md8" style="padding-top:8px;">\
                            <div class="layui-progress" style="margin: auto;">\
                                <div class="layui-progress-bar layui-bg-violet" lay-percent="'+ (maxp?r[2]/maxp*100:0) +'%"></div>\
                            </div>\
                        </div>\
                        <div class="layui-col-md2" style="padding-top:4px;">\
                            <p style="padding-left: 5px; font-size: 12px; color:rgba(0, 0, 0, 0.5);">'+(people?r[2]/people*100:0).toFixed(1)+'%</p>\
                        </div>\
                    </div>\
                    <div class="layui-row">\
                        <div class="layui-col-md2">\
                            <p style="color:rgba(0, 0, 0, 0.5);" title="较差">2星</p>\
                        </div>\
                        <div class="layui-col-md8" style="padding-top:8px;">\
                            <div class="layui-progress" style="margin: auto;">\
                                <div class="layui-progress-bar layui-bg-violet" lay-percent="'+ (maxp?r[3]/maxp*100:0) +'%"></div>\
                            </div>\
                        </div>\
                        <div class="layui-col-md2" style="padding-top:4px;">\
                            <p style="padding-left: 5px; font-size: 12px; color:rgba(0, 0, 0, 0.5);">'+(people?r[3]/people*100:0).toFixed(1)+'%</p>\
                        </div>\
                    </div>\
                    <div class="layui-row">\
                        <div class="layui-col-md2">\
                            <p style="color:rgba(0, 0, 0, 0.5);" title="很差">1星</p>\
                        </div>\
                        <div class="layui-col-md8" style="padding-top:8px;">\
                            <div class="layui-progress" style="margin: auto;">\
                                <div class="layui-progress-bar layui-bg-violet" lay-percent="'+ (maxp?r[4]/maxp*100:0) +'%"></div>\
                            </div>\
                        </div>\
                        <div class="layui-col-md2" style="padding-top:4px;">\
                            <p style="padding-left: 5px; font-size: 12px; color:rgba(0, 0, 0, 0.5);">'+(people?r[4]/people*100:0).toFixed(1)+'%</p>\
                        </div>\
                    </div>\
                    <hr>\
                    <div style="margin: 10px">\
                        <p><b>'+ (myRate ? '我的评分' : '上过这门课？轻触以评分') +'</b></p>\
                        <div id="click-to-rate" style="padding: 0 20px;"></div>\
                    </div>\
                    ';
    
                    element.innerHTML = html;
                    
                    layui.element.render('progress');
                    layui.rate.render({
                        elem: '#star-rating'
                        ,value: (people?points/2:0) //初始值
                        ,half: true //开启半星
                        ,readonly: true
                    });

                    var rateLock = false;

                    layui.rate.render({
                        elem: '#click-to-rate'
                        ,value: (myRate ? myRate : 0) //初始值
                        ,text: true
                        ,setText: function(value){
                            var arrs = {
                              '0': ' '
                              ,'1': '很差'
                              ,'2': '较差'
                              ,'3': '还行'
                              ,'4': '推荐'
                              ,'5': '力荐'
                            };
                            this.span.text(arrs[value] || ( value + "星"));
                        }
                        ,choose: function(value){
                            if (rateLock) {
                                alert('点击过于频繁，请稍后再试。');
                                return;
                            }
                            rateLock = true;

                            if (value == 5)
                                value = 'hooray';
                            else if (value == 4)
                                value = 'laugh';
                            else if (value == 3)
                                value = 'rocket';
                            else if (value == 2)
                                value = 'confused';
                            else if (value == 1)
                                value = 'eyes';
                            
                            if (selfRating) {
                                $.ajax({
                                    url: options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/issues/" + issueID + "/reactions/" + selfRating.id,
                                    type: "DELETE",
                                    headers: headers,
                                    success: function (data) {
                                        $.ajax({
                                            url: options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/issues/" + issueID + "/reactions",
                                            type: "POST",
                                            data: JSON.stringify({
                                                'content': value
                                            }),
                                            headers: headers,
                                            success: function (data) {
                                                rateLock = false;
                                                window.location.reload();
                                            },
                                            error: function(err) {
                                                console.log(err);
                                            }
                                        })
                                    },
                                    error: function(err) {
                                        console.log(err);
                                    }
                                })
                            } else {
                                $.ajax({
                                    url: options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/issues/" + issueID + "/reactions",
                                    type: "POST",
                                    data: JSON.stringify({
                                        'content': value
                                    }),
                                    headers: headers,
                                    success: function (data) {
                                        rateLock = false;
                                        window.location.reload();
                                    },
                                    error: function(err) {
                                        console.log(err);
                                    }
                                })
                            }
                        }
                    });
                };

                $.ajax({
                    url: options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/issues",
                    type: "GET",
                    data: {
                        'labels': this.course_code
                    },
                    headers: headers,
                    success: function (data) {
                        if (data) {
                            var issueID = data[0].number;
                            var users = new Set();
                            var reactions = {
                                'hooray': 0,
                                'laugh': 0,
                                'rocket': 0,
                                'confused': 0,
                                'eyes': 0
                            };
                            var selfRating = undefined;
                            var page = 1;

                            loadRatingPage = function (issueID, users, reactions, page) {
                                $.ajax({
                                    url: options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/issues/" + issueID + "/reactions",
                                    type: "GET",
                                    data: {
                                        'per_page': 100,
                                        'page': page,
                                        't': Date.now()
                                    },
                                    headers: headers,
                                    success: function (data) {
                                        if (data) {
                                            for (var i = 0; i < data.length; i++) {
                                                if (users.has(data[i].user.login)) continue;
                                                users.add(data[i].user.login);
                                                if (data[i].user.login == cardComponent.userInfo.login)
                                                    selfRating = data[i];
                                                reactions[data[i].content] += 1;
                                            }

                                            if (data.length < 100) {
                                                var r = [reactions.hooray, reactions.laugh, reactions.rocket, reactions.confused, reactions.eyes];
                                                renderRating(r, selfRating, issueID);
                                            } else {
                                                loadRatingPage(issueID, users, reactions, page+1);
                                            }
                                        } else {
                                            console.log('data error:', data);
                                        }
                                    },
                                    error: function(err) {
                                        console.log(err);
                                    }
                                })
                            }

                            loadRatingPage(issueID, users, reactions, page);
                        
                        } else {
                            console.log('data error:', data);
                        }
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })

            },

            getUserInfo: function (callback) {
                accessToken = options.accessToken || window.localStorage.getItem('GT_ACCESS_TOKEN');
                if (!accessToken) {if (callback) callback();return;};
                $.ajax({
                    url: options.baseURL + "/user",
                    type: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'token ' + accessToken,
                    },
                    success: function (data) {
                        cardComponent.userInfo = data;
                        if (callback) callback();
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            },

            loadFolders: function(element) {
                var semester = element.getAttribute('semester');
                $.ajax({
                    url: options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/courses/" + this.course_code + "/" + semester,
                    type: "GET",
                    data: {
                        'ref': 'file-base'
                    },
                    headers: headers,
                    success: function (data) {
                        if (data) {
                            for (var idx in data) {
                                var file = data[idx];
                                if (file.type == "dir") {
                                    var d = document.createElement('details');
                                    var details = '                                         \
                                        <summary>' + file.name + '</summary>                \
                                        <div class="details-wrapper">                       \
                                        <div class="details-styling">                       \
                                            <i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop" style="margin-right: 10px;"></i> Loading... \
                                        </div>                                              \
                                        </div>                                              \
                                    ';
                                    d.innerHTML = details;
                                    element.appendChild(d);
                                    cardComponent.loadFiles(d, file.url);
                                }
                            }
                            var accordion = new Collapse(element, { accordion: false }).init();
                        } else {
                            console.log('data error:', data);
                        }
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            },

            preprocessURL: function(url) {
                if (url.endsWith(".md") || url.endsWith(".mdx") || url.endsWith(".htmlx")) {
                    return "reader?url="+ options.proxy + url;
                } else {
                    return options.proxy + url;
                }
            },

            loadFiles: function(element, path) {
                $.ajax({
                    url: path,
                    type: "GET",
                    headers: headers,
                    success: function (data) {
                        if (data) {
                            var normal_contents = new Array();
                            var reader_contents = new Array();
                            for (var idx in data) {
                                var file = data[idx];
                                if (file.type == "file") {
                                    var url = file.download_url;

                                    if (url.endsWith(".md") || url.endsWith(".mdx") || url.endsWith(".htmlx")) {
                                        url = "reader?url="+ options.proxy + url;
                                        reader_contents.push('                        \
                                        <a href="' + url + '">' + file.name.replace(/(.md$)|(.mdx$)|(.htmlx$)/,'') + '</a>   \
                                        ');
                                    } else {
                                        url = options.proxy + url;
                                        if (url.endsWith(".pdf")) {
                                            url = "https://mozilla.github.io/pdf.js/web/viewer.html?file=" + url;
                                        } else if (url.endsWith(".doc") || url.endsWith(".docx") || url.endsWith(".ppt") || url.endsWith(".pptx") || url.endsWith(".xls") || url.endsWith(".xlsx")) {
                                            url = "http://view.officeapps.live.com/op/view.aspx?src=" + url;
                                        }
                                        normal_contents.push('                        \
                                        <a href=&quot;' + url + '&quot;>' + file.name + '</a>   \
                                        ');
                                    }
                                }
                            }
                            if (normal_contents.length > 0) {
                                var message = "javascript:layui.use('layer', function(){  var layer = layui.layer;  layer.open({area: '50%', title: '文件信息',content: '"+ normal_contents.join("<hr>") +"'}); });"
                                reader_contents.push('                        \
                                <a href="'+message+'">浏览文件...</a>   \
                                ');
                            }
                            element.children[1].children[0].innerHTML = reader_contents.join("<hr>");
                        } else {
                            console.log('data error:', data);
                            element.children[1].children[0].innerHTML = "Loading failed. Please try again.";
                        }
                    },
                    error: function(err) {
                        console.log(err);
                        element.children[1].children[0].innerHTML = "Loading failed. Please try again.";
                    }
                })
            },

            render: function(container){
                var index = layer.load(2, {
                    content:"<p style='position: relative; left: -10px;'><br><br>Loading...</p>",
                    shade:0
                });
                cardComponent.construct(function(){
                    cardComponent.getUserInfo(function(){
                        cardComponent.getPeople(function(){
                            cardComponent.render_(container);
                            layer.close(index);
                        })
                    })
                });
            }
        }

        return cardComponent;
    });
    exports('semester_card', semester_card);
});

