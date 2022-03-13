layui.define(['jquery', 'util', 'element', 'proxy', 'tagsInputAutoComplete', 'avatar', 'github_upload'], function(exports){

    var $ = layui.jquery,
        util = layui.util,
        proxy = layui.proxy({});

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

        const randomString = (len = 32) => {
            var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';
            var maxPos = chars.length;
            var pwd = '';
            for (i = 0; i < len; i++) {
                pwd += chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        }

        options = assign({
            proxy: '',
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
                        url: proxy.parse(options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/courses/" + query.course_code + "/meta.json"),
                        type: "GET",
                        data: {
                            'ref': 'file-base',
                            t: Date.now()
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
                    url: proxy.parse(options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/people/meta.json"),
                    type: "GET",
                    data: {
                        'ref': 'file-base',
                        t: Date.now()
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
                        <div style="margin:auto; max-width:600px;"><p style="text-align: left; font-size: 1em; line-height: 1.3em; margin-bottom: 6px; padding: 0; text-shadow: 0 0 1rem #fefefe; font-family: Quicksand, Arial; color: #b4b4b4;">There are several possible reasons:</p></div>\
                        <div style="margin:auto; max-width:600px;"><p style="text-align: left; font-size: 1em; line-height: 1.3em; padding: 0; text-shadow: 0 0 1rem #fefefe; font-family: Quicksand, Arial; color: #b4b4b4;">1. The course code is missing or does not exist. If so, start from <a href="index">the entry</a> and visit again;</p></div>\
                        <div style="margin:auto; max-width:600px;"><p style="text-align: left; font-size: 1em; line-height: 1.3em; padding: 0; text-shadow: 0 0 1rem #fefefe; font-family: Quicksand, Arial; color: #b4b4b4;">2. You have not logged in and have reached github\'s request rate limit. If so, please log in to continue. See <a href="help">Help</a> for more information.</p></div>\
                        <div style="margin:auto; max-width:600px;"><p style="text-align: left; font-size: 1em; line-height: 1.3em; padding: 0; text-shadow: 0 0 1rem #fefefe; font-family: Quicksand, Arial; color: #b4b4b4; margin-bottom: 3rem;">3. You are in restricted area and blocked by something else. If so, please <a href="settings">set the proper proxy</a> of API.</p></div>\
                        <div style="position: relative;width: 200px;height: 200px; margin:auto;">\
                            <svg viewBox="0 0 120 120" style="overflow: visible"> <defs> <path id="a" d="M0 4.21585531V.05647427h4.15889198v4.15938104H0z"></path> </defs> <g fill="none" fill-rule="evenodd"> <g class="stars animated"> <path d="M32.9862439 29.2981615c.1110863.8208744-.4626987 1.5770446-1.2847376 1.6881041-.8210729.1110595-1.5764599-.4635526-1.6875462-1.2844271-.1120523-.8208744.4626987-1.5760789 1.2837716-1.6881041.8220388-.1110595 1.5774259.4635526 1.6885122 1.2844271" fill="#D0E7FB"></path> <path d="M100.94858 6.8876353c-.214287.79954375-1.0363503 1.27471744-1.8366061 1.06131608-.7983596-.21340136-1.2743411-1.03570792-1.0610028-1.83620012.2142866-.80049221 1.0363503-1.2756659 1.8366062-1.06131609.8002557.21434981 1.2752897 1.03570792 1.0610027 1.83620013" fill="#D0E7FB"></path> <g transform="translate(0 69)"> <mask id="b" fill="#fff"> <use xlink:href="#a"></use> </mask> <path d="M4.0876 2.6727c-.296 1.109-1.436 1.769-2.545 1.472-1.109-.297-1.768-1.436-1.472-2.546.297-1.109 1.436-1.768 2.546-1.471 1.11.296 1.768 1.436 1.471 2.545" fill="#A1D2F8" mask="url(#b)"></path> </g> <path d="M106.948688 111.887537c-.212978.799632-1.035129 1.275692-1.835888 1.060907-.80076-.213855-1.276008-1.035802-1.06117-1.835434.212978-.799632 1.036059-1.275692 1.835888-1.061837.80076.213855 1.275078 1.036732 1.06117 1.836364" fill="#A1D2F8"></path> <path d="M54.2354557 18.9014571c-1.5953959-.4199186-2.556853-2.0704598-2.1369062-3.6657486.4209514-1.5962933 2.0705988-2.5576859 3.6659948-2.1367627 1.5953959.4209232 2.556853 2.0704598 2.1369062 3.6657486-.4209514 1.5952888-2.0695942 2.5566813-3.6659948 2.1367627z" stroke="#A1D2F8" stroke-width="2"></path> <path d="M16.9721415 7.59675618c.2239612 1.64109572-.9269786 3.15263122-2.5690262 3.37559532-1.640039.222964-3.1515262-.9270082-3.3754875-2.56810392-.2229569-1.64210006.9279829-3.1536356 2.5690262-3.37659964 1.6410433-.22296405 3.1525306.92700817 3.3754875 2.56910824" fill="#A1D2F8"></path> <path d="M49.2357085 117.901451c-1.5962933-.419947-2.5576859-2.070599-2.1367627-3.665995.4209232-1.595396 2.0704598-2.556853 3.6657486-2.136907 1.5952888.420952 2.5566813 2.070599 2.1367627 3.665995-.4209231 1.595396-2.0694552 2.556853-3.6657486 2.136907z" stroke="#A1D2F8" stroke-width="2"></path> </g> <g class="rocket animated"> <path fill="#F2F9FE" d="M53.9118329 92L44 81.3510365 50.0881671 76 60 86.6489635z"></path> <path stroke="#A1D2F8" stroke-width="2" stroke-linejoin="round" d="M53.9118329 92L44 81.3510365 50.0881671 76 60 86.6489635z"></path> <path fill="#FFF" d="M57 47.0157449L49.8317064 42 24 60.6301909 49.2570499 62z"></path> <path fill="#F2F9FE" d="M87.754216 81L92 88.7814042 71 113l1.16221-25.7194181z"></path> <path d="M108.233532 59.9703727c10.579453-16.2472813 10.22216-27.2231872 9.399093-31.6550767v-.0029805c-.413027-5.3975467-5.752516-6.357243-5.752516-6.357243-4.3323-1.2656865-15.2362027-2.7350352-32.5037006 6.126757-22.9294458 11.767705-28.5485982 30.6029873-28.5485982 30.6029873s-4.8199707 15.3392457 1.1942938 22.6243939c.0288621.0387455.0467766.0824584.0806149.1192169.0338383.0377521.0716576.0695432.1054959.1072953.0328431.037752.0627005.0784845.0965388.1162365.0328431.0357651.0746433.0596084.1104722.0923931 6.6512212 6.7099265 22.4268471 3.4771606 22.4268471 3.4771606s19.3415882-3.6718816 33.3914591-25.2511404" fill="#FFF"></path> <path d="M108.214668 59.904736c10.318007-15.8150644 10.338974-26.7477325 9.407418-31.913642-.442314-5.0236555-4.362238-6.8839002-6.034646-7.4529163-.310519-.105447-.646997-.2198471-.998452-.2795341-.309521-.0885357-.642005-.1750818-.993461-.2586436.726874 5.517068.100844 16.050828-9.569167 30.8730987-13.9234193 21.3450646-32.8900212 25.1550846-33.6897816 25.3062916-.5082122.1044523-10.6714593 2.1099353-18.3365784-.7391239.5171983 1.9637021 1.3359293 3.8090251 2.610953 5.3509392l.1936998.233774 1.710349-1.3658374-1.5745595 1.5259975.2546054.2397428c7.1129749 7.0052638 22.6978186 3.9154669 23.3298389 3.7861451.8007589-.151207 19.7663623-3.961227 33.6897814-25.3062916" fill="#F2F9FE"></path> <g> <path d="M77.0779 50.9007l4.331 4.795-8.215 7.421c-.817.738-.623 1.045.429.688l17.561-6.405c1.053-.358 1.261-1.362.463-2.245l-4.331-4.795 8.215-7.421c.818-.738.623-1.045-.43-.69l-17.56 6.407c-1.054.356-1.261 1.362-.463 2.245" fill="#FFF"></path> <path d="M77.0779 50.9007l4.331 4.795-8.215 7.421c-.817.738-.623 1.045.429.688l17.561-6.405c1.053-.358 1.261-1.362.463-2.245l-4.331-4.795 8.215-7.421c.818-.738.623-1.045-.43-.69l-17.56 6.407c-1.054.356-1.261 1.362-.463 2.245" stroke="#A1D2F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> <path d="M108.233532 59.9703727c10.579453-16.2472813 10.22216-27.2231872 9.399093-31.6550767v-.0029805c-.413027-5.3975467-5.752516-6.357243-5.752516-6.357243-4.3323-1.2656865-15.2362027-2.7350352-32.5037006 6.126757-22.9294458 11.767705-28.5485982 30.6029873-28.5485982 30.6029873s-4.8199707 15.3392457 1.1942938 22.6243939c.0288621.0387455.0467766.0824584.0806149.1192169.0338383.0377521.0716576.0695432.1054959.1072953.0328431.037752.0627005.0784845.0965388.1162365.0328431.0357651.0746433.0596084.1104722.0923931 6.6512212 6.7099265 22.4268471 3.4771606 22.4268471 3.4771606s19.3415882-3.6718816 33.3914591-25.2511404z" stroke="#A1D2F8" stroke-width="2"></path> <path stroke="#A1D2F8" stroke-width="2" stroke-linejoin="round" d="M57 47.0157449L49.8317064 42 24 60.6301909 49.2570499 62z"></path> <path d="M65 72l-31 28" stroke="#A1D2F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M110.154443 64.7093112c1.02326.8964969 1.133632 2.4760391.244468 3.5099781l-5.959048 6.9262459c-.888132 1.033939-2.452937 1.1453504-3.476197.2478122l-.117593-.1030815c-1.0242917-.896497-1.133632-2.4760392-.2455-3.508937l5.96008-6.9272871c.888132-1.033939 2.452937-1.1443091 3.476197-.2478122l.117593.1030816z" fill="#FFF"></path> <path d="M110.154443 64.7093112c1.02326.8964969 1.133632 2.4760391.244468 3.5099781l-5.959048 6.9262459c-.888132 1.033939-2.452937 1.1453504-3.476197.2478122l-.117593-.1030815c-1.0242917-.896497-1.133632-2.4760392-.2455-3.508937l5.96008-6.9272871c.888132-1.033939 2.452937-1.1443091 3.476197-.2478122l.117593.1030816z" stroke="#A1D2F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path fill="#D0E7FB" d="M91 85.8362964L88.1804586 81l-15.890329 5.9908294L72 93z"></path> <path stroke="#A1D2F8" stroke-width="2" stroke-linejoin="round" d="M87.754216 81L92 88.7814042 71 113l1.16221-25.7194181z"></path></g></g></svg>\
                        </div>\
                    </div>\
                    <div class="layui-footer" style="margin:2em;">                                                                                              \
                        <!-- 底部固定区域 -->                                                                                                \
                        <p style="display:flex; justify-content: center;">© 2020-2022 iTechX - MIT license.</p>                             \
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
                    <div class="menu card-shadow" semester="' + key + '" style="margin-bottom:1.5em;">                                           \
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

                    var getImage = function(url, pid) {
                        if (url == true) {
                            url = "https://raw.githubusercontent.com/" + options.owner + "/" + options.repo + "/file-base/people/images/" + pid + ".jpg";
                        } else if (!url) {
                            url = "layui/images/teacher.jpg";
                        }
                        return proxy.parse(url);
                    };

                    var elemPerRow = function(width) {
                        /*if (width >= 2313) return 7;
                        else if (width >= 2015) return 6;
                        else if (width >= 1719) return 5;
                        else*/ if (width >= 1421) return 4;
                        else if (width >= 1124) return 3;
                        else if (width >= 992) return 2;
                        else if (width >= 889) return 4;
                        else if (width >= 768) return 3;
                        else if (width >= 706) return 4;
                        else if (width >= 582) return 3;
                        else if (width >= 458) return 2;
                        else return 1;
                    };

                    var threshold = Math.max(1, Math.floor(elemPerRow(window.innerWidth)/2)) * 2 - 1;
                    var cnt = 0, clsid = randomString(8);
                    if (semester.teacher.length <= threshold + 1) { cnt = -2; }
                    for (const pid in semester.teacher) {
                        if (Object.hasOwnProperty.call(this.people, semester.teacher[pid])) {
                            const pinfo = this.people[semester.teacher[pid]];
                            cards += '                                          \
                            <div class="instructor'+(cnt<threshold?'':(' layui-hide '+clsid))+'">                            \
                                <a href="people?pid='+semester.teacher[pid]+'">                         \
                                <div><img src="' + getImage(pinfo.image, semester.teacher[pid]) + '" style="border-radius: 50%; width: 60px; height: 60px;"></div> \
                                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + pinfo.name + '</div>                   \
                                </a>                                            \
                            </div>                                              \
                            ';
                            cnt++;
                        }
                    }
                    if (cnt>threshold) {
                        var clsidmore = randomString(8);
                        cards += '\
                            <div class="instructor '+clsidmore+'">\
                                <a href="javascript: document.getElementsByClassName(\''+clsidmore+'\')[0].classList.add(\'layui-hide\'); Array.prototype.forEach.call(document.getElementsByClassName(\''+clsid+'\'), function (element) { element.classList.remove(\'layui-hide\'); });"><div><div style="border-radius:50%;border: 1px solid #d6d1e0; width: 60px; height: 60px; line-height: 60px; margin: auto;">更多...</div></div><div>&nbsp;</div></a>\
                            </div>\
                        ';
                    }
                    
                    cards += '                                  \
                        </div>                                  \
                        <div class="layui-col-md8">             \
                        <div style="margin: 5px;">              \
                            <b>Teaching Assistant 助教：</b>    \
                        </div>                                  \
                    ';

                    threshold = elemPerRow(window.innerWidth) * 2 - 1;
                    cnt = 0, clsid = randomString(8);
                    if (semester.ta.length <= threshold + 1) { cnt = -2; }
                    for (const pid in semester.ta) {
                        if (Object.hasOwnProperty.call(this.people, semester.ta[pid])) {
                            const pinfo = this.people[semester.ta[pid]];
                            cards += '                                          \
                            <div class="instructor'+(cnt<threshold?'':(' layui-hide '+clsid))+'">                            \
                                <a href="people?pid='+semester.ta[pid]+'">                         \
                                <div><img src="' + getImage(pinfo.image, semester.ta[pid]) + '" style="border-radius: 50%; width: 60px; height: 60px;"></div> \
                                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + pinfo.name + '</div>                   \
                                </a>                                            \
                            </div>                                              \
                            ';
                            cnt++;
                        }
                    }
                    if (cnt>threshold) {
                        var clsidmore = randomString(8);
                        cards += '\
                            <div class="instructor '+clsidmore+'">\
                                <a href="javascript: document.getElementsByClassName(\''+clsidmore+'\')[0].classList.add(\'layui-hide\'); Array.prototype.forEach.call(document.getElementsByClassName(\''+clsid+'\'), function (element) { element.classList.remove(\'layui-hide\'); });"><div><div style="border-radius:50%;border: 1px solid #d6d1e0; width: 60px; height: 60px; line-height: 60px; margin: auto;">更多...</div></div><div>&nbsp;</div></a>\
                            </div>\
                        ';
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
                                                <div class="layui-col-md12">                                             \
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

                cards += '<div class="card-shadow" id="new-semester" style="margin-bottom:1.5em;"></div>';

                cards += '                                                                                                                  \
                        </div>                                                                                                              \
                        <div class="layui-col-sm3">                                                                                         \
                            <div style="margin: 2em;">                                                                                      \
                                <p><b>重要课程日期</b></p>                                                                                   \
                                <blockquote class="layui-elem-quote" style="font-weight: bold; margin-bottom: 0;">' + util.toDateString(new Date(), '今天是 yyyy年MM月dd日 HH:mm UTC+8') + '</blockquote>   \
                                <blockquote class="layui-grey-quote">                                                                       \
                                    ' + (cardComponent.hasOwnProperty('userInfo') ? '您拥有完全的访问许可。您正在访问个人空间，评分模块与评论模块将不会加载。' : '您拥有受限制的访问许可。登录以获取完全的访问许可。') + '\
                                </blockquote>                                                                                               \
                            </div>                                                                                                          \
                        </div>                                                                                                              \
                    </div>                                                                                                                  \
                    <div id="gitalk-container"></div>\
                    <div class="layui-footer" style="margin:2em;">                                                                          \
                        <!-- 底部固定区域 -->                                                                                                \
                        <p style="display:flex; justify-content: center;">© 2020-2022 iTechX - MIT license.</p>                             \
                    </div>                                                                                                                  \
                ';

                node.innerHTML = cards;
                var card_elements = node.getElementsByClassName("menu");

                for (let idx = 0; idx < card_elements.length; idx++) {
                    var e = card_elements[idx];
                    this.loadFolders(idx, e);
                    this.renderConfig(idx, e);
                }

                this.renderNewSemester(document.getElementById("new-semester"));
            },

            getUserInfo: function (callback) {
                accessToken = options.accessToken || window.localStorage.getItem('GT_ACCESS_TOKEN');
                if (!accessToken) {if (callback) callback();return;};
                $.ajax({
                    url: proxy.parse(options.baseURL + "/user"),
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

            renderNewSemester: function(element) {
                var d = document.createElement('div');
                element.innerHTML = '<div class="layui-card" style="border-radius: 10px; margin-bottom: 15px;cursor: pointer;">    <div class="layui-card-body" style="min-height: 170px; display: flex; justify-content: center; align-items: center;"></div></div>';
                d.innerHTML = '<i class="fa fa-plus-square-o fa-5x" aria-hidden="true"></i>        <p style="font-size: x-large; margin: 2rem;">添加新学期...</p>';
                d.style.display = 'flex';
                d.style.alignItems = 'center';
                element.children[0].children[0].appendChild(d);
                var d_cfg = document.createElement('div');
                element.children[0].children[0].appendChild(d_cfg);

                var semester = {
                    season: "Fall",
                    year: "2113",
                    course_id: cardComponent.content.code + ".01",
                    department: "信息科学与技术学院",
                    credit: "4",
                    hours: "64",
                    prerequisite: "未知",
                    evaluation: "未知",
                    teacher: ["unknown"],
                    ta: ["unknown"]
                };

                var ctl_d = {
                    render: function(){
                        d.style.display = '';
                        d.style.alignItems = '';
                        d.parentElement.style.display = '';
                        d.parentElement.style.alignItems = '';
                        d.parentElement.style.justifyContent = '';
                        element.onclick = function(){};

                        var cards = '<div class="layui-row" style="padding-top: 1em; padding-bottom: 1em;"><div class="layui-col-md2"><div class="semester"><div class="semester_season">' + semester.season + '</div><div class="semester_year">' + semester.year + '</div></div></div><div class="layui-col-md10"><div style="margin: 5px 1em;"><div class="layui-row" style="font-family: Quicksand;"><div class="layui-col-md4"><div style="margin: 5px;"><b>Instructor 教师：</b></div>';

                        var getImage = function(url, pid) {
                            if (url == true) {
                                url = "https://raw.githubusercontent.com/" + options.owner + "/" + options.repo + "/file-base/people/images/" + pid + ".jpg";
                            } else if (!url) {
                                url = "layui/images/teacher.jpg";
                            }
                            return proxy.parse(url);
                        };

                        for (const pid in semester.teacher) {
                            if (Object.hasOwnProperty.call(cardComponent.people, semester.teacher[pid])) {
                                const pinfo = cardComponent.people[semester.teacher[pid]];
                                cards += '<div class="instructor"><a href="people?pid='+semester.teacher[pid]+'"><div><img src="' + getImage(pinfo.image, semester.teacher[pid]) + '" style="border-radius: 50%; width: 60px; height: 60px;"></div><div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + pinfo.name + '</div></a></div>';
                            }
                        }
                        
                        cards += '</div><div class="layui-col-md8"><div style="margin: 5px;"><b>Teaching Assistant 助教：</b></div>';

                        for (const pid in semester.ta) {
                            if (Object.hasOwnProperty.call(cardComponent.people, semester.ta[pid])) {
                                const pinfo = cardComponent.people[semester.ta[pid]];
                                cards += '<div class="instructor"><a href="people?pid='+semester.ta[pid]+'"><div><img src="' + getImage(pinfo.image, semester.ta[pid]) + '" style="border-radius: 50%; width: 60px; height: 60px;"></div><div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + pinfo.name + '</div></a></div>';
                            }
                        }                    
                        cards += '</div><div class="layui-col-md12" style="margin: 0.5em 0;"></div><div class="layui-col-md6"><b>课程编号：</b>' + semester.course_id + '</div><div class="layui-col-md6"><b>开课单位：</b>' + semester.department + '</div><div class="layui-col-md6"><b>学分：</b>' + semester.credit + '</div><div class="layui-col-md6"><b>学时：</b>' + semester.hours + '</div><div class="layui-col-md12"><b>先修课程：</b>' + semester.prerequisite + '</div><div class="layui-col-md12"><b>评分标准：</b>' + semester.evaluation + '</div></div><div class="layui-row" style="padding-top: 1em;">';
                        if (semester.mainpage)
                            cards += '<a href="'+semester.mainpage+'" class="layui-btn layui-btn-lg layui-btn-violet" style="font-weight: normal; float: right;">查看主页</a>';
                        else
                            cards += '<a href="javascript:;" class="layui-btn layui-btn-lg layui-btn-violet layui-btn-disabled" style="font-weight: normal; float: right;">查看主页</a>';
                        cards += '</div></div></div></div>';
                        d.innerHTML = cards;

                        let btn_e = d.getElementsByClassName("layui-btn")[0];
                        let cfgbtn_e = document.createElement('div');
                        btn_e.style['float'] = '';
                        cfgbtn_e.style['display'] = 'inline';
                        cfgbtn_e.style['margin'] = '10px';
                        cfgbtn_e.innerHTML = '<a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-primary-violet" title="设置" style="font-weight: normal; padding: 0 7px;"><i class="fa fa-cog icon-gear" aria-hidden="true"></i></a>';
                        btn_e.parentElement.style['float'] = 'right';
                        btn_e.parentElement.insertBefore(cfgbtn_e, btn_e);

                        {
                            function show() {
                                cfgbtn_e.onclick = hide;
                                d_cfg.classList.remove('layui-hide');
                            }
        
                            function hide() {
                                cfgbtn_e.onclick = show;
                                d_cfg.classList.add('layui-hide');
                            }
        
                            if (d_cfg.classList.contains('layui-hide'))
                                hide();
                            else 
                                show();
                        }
                    },
                    showcfg: function(){
                        d_cfg.innerHTML = '<hr><form class="layui-form" action="" lay-filter="form-new-semester" style="padding-top: 15px;">    <div class="layui-form-item">        <div class="layui-inline">            <label class="layui-form-label">季节</label>            <div class="layui-input-inline">              <input type="text" name="season" lay-verify="required" autocomplete="off" class="layui-input">            </div>        </div>        <div class="layui-inline">          <label class="layui-form-label">学年</label>          <div class="layui-input-inline">            <input type="text" name="year" lay-verify="required" autocomplete="off" class="layui-input">          </div>        </div>        <div class="layui-inline">            <label class="layui-form-label">课程编号</label>            <div class="layui-input-inline">              <input type="text" name="course_id" lay-verify="required" autocomplete="off" class="layui-input">            </div>        </div>        <div class="layui-inline">          <label class="layui-form-label">开课单位</label>          <div class="layui-input-inline">            <input type="text" name="department" lay-verify="required" autocomplete="off" class="layui-input">          </div>        </div>        <div class="layui-inline">          <label class="layui-form-label">学分</label>          <div class="layui-input-inline">            <input type="text" name="credit" lay-verify="required" autocomplete="off" class="layui-input">          </div>        </div>        <div class="layui-inline">            <label class="layui-form-label">学时</label>            <div class="layui-input-inline">              <input type="text" name="hours" lay-verify="required" autocomplete="off" class="layui-input">            </div>        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">先修课程</label>        <div class="layui-input-block">            <input style="width: 95%" type="text" name="prerequisite" lay-verify="required" autocomplete="off" class="layui-input">        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">评分标准</label>        <div class="layui-input-block">            <input style="width: 95%" type="text" name="evaluation" lay-verify="required" autocomplete="off" class="layui-input">        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">首页</label>        <div class="layui-input-block">            <input style="width: 95%" type="text" name="mainpage" placeholder="例：https://example.com。不填即无首页。" autocomplete="off" class="layui-input">        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">教师</label>        <div id="teacher-new-semester" style="width:95%"></div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">助教</label>        <div id="ta-new-semester" style="width:95%"></div>    </div>    <div class="layui-row" style="margin-left: 110px; margin-bottom: 1rem;">        <p style="font-size:12px; margin-bottom:0; text-shadow: 0 0 1rem #fefefe; color: #b4b4b4;">提示：单击人物ID以查看详情。</p>        <a href="javascript:;" style="font-size:12px; font-weight: normal;">没有找到？点这里添加人物</a>    </div>        <div class="layui-form-item">    <div class="layui-input-block">      <button type="button" class="layui-btn layui-btn-violet" lay-submit="" lay-filter="submit-new-semester">添加</button>      <button type="reset" class="layui-btn layui-btn-primary-violet layui-btn-disabled">重置</button>    </div>  </div></form>';
                        d_cfg.classList.add('layui-hide');

                        layui.form.val('form-new-semester', {
                            "season": semester.season,
                            "year": semester.year,
                            "course_id": semester.course_id,
                            "department": semester.department,
                            "credit": semester.credit,
                            "hours": semester.hours,
                            "prerequisite": semester.prerequisite,
                            "evaluation": semester.evaluation,
                            "mainpage": (semester.mainpage ? semester.mainpage : ""),
                        });

                        let teacherTagIns = layui.tagsInputAutoComplete.render({
                            elem: '#teacher-new-semester',
                            inputValue: semester.teacher,
                            autoCompleteData: [{"name": "unknown", "info": "未知 (unknown)"}],
                            listTemplate: '<p style="display: none;">{{d.name}}</p><p>{{d.info}}</p>',
                            inputchange: function (val, allVal, event) {
        
                                let autoCompleteData = [];
                                
                                for (const pid in cardComponent.people) {
                                    if (Object.hasOwnProperty.call(cardComponent.people, pid)) {
                                        const p = cardComponent.people[pid];
                                        const s = p.name + ' (' + pid + ')';
                                        if (s.includes(val)) autoCompleteData.push({ name: pid, info: s});
                                        if (autoCompleteData.length >= 6) break;
                                    }
                                }
        
                                teacherTagIns.reload({
                                  autoCompleteData: autoCompleteData
                                })
                            },
                            tagClick: function (val, allVal, event) {
                                cardComponent.modifyPeople(val);
                            },
                            tagRemove: updateSemester,
                            enter: updateSemester,
                            select: updateSemester
                        });
                        let taTagIns = layui.tagsInputAutoComplete.render({
                            elem: '#ta-new-semester',
                            inputValue: semester.ta,
                            autoCompleteData: [{"name": "unknown", "info": "未知 (unknown)"}],
                            listTemplate: '<p style="display: none;">{{d.name}}</p><p>{{d.info}}</p>',
                            inputchange: function (val, allVal, event) {
        
                                let autoCompleteData = [];
                                
                                for (const pid in cardComponent.people) {
                                    if (Object.hasOwnProperty.call(cardComponent.people, pid)) {
                                        const p = cardComponent.people[pid];
                                        const s = p.name + ' (' + pid + ')';
                                        if (s.includes(val)) autoCompleteData.push({ name: pid, info: s});
                                        if (autoCompleteData.length >= 6) break;
                                    }
                                }
        
                                taTagIns.reload({
                                  autoCompleteData: autoCompleteData
                                })
                            },
                            tagClick: function (val, allVal, event) {
                                cardComponent.modifyPeople(val);
                            },
                            tagRemove: updateSemester,
                            enter: updateSemester,
                            select: updateSemester
                        });

                        function updateSemester() {
                            let data = layui.form.val('form-new-semester');
                            semester.season = data.season;
                            semester.year = data.year;
                            semester.course_id = data.course_id;
                            semester.department = data.department;
                            semester.credit = data.credit;
                            semester.hours = data.hours;
                            semester.prerequisite = data.prerequisite;
                            semester.evaluation = data.evaluation;
                            semester.mainpage = data.mainpage;
                            if (data.mainpage == "") delete semester.mainpage;
                            semester.teacher = teacherTagIns.getInputValue();
                            semester.ta = taTagIns.getInputValue();

                            ctl_d.render();
                        }

                        var tgt = d_cfg.children[1].children[0].children[0].children[1].children[0];
                        tgt.oninput = updateSemester;

                        var tgt = d_cfg.children[1].children[0].children[1].children[1].children[0];
                        tgt.oninput = updateSemester;

                        var tgt = d_cfg.children[1].children[0].children[2].children[1].children[0];
                        tgt.oninput = updateSemester;
        
                        var tgt = d_cfg.children[1].children[0].children[3].children[1].children[0];
                        tgt.oninput = updateSemester;
        
                        var tgt = d_cfg.children[1].children[0].children[4].children[1].children[0];
                        tgt.oninput = updateSemester;
        
                        var tgt = d_cfg.children[1].children[0].children[5].children[1].children[0];
                        tgt.oninput = updateSemester;
        
                        var tgt = d_cfg.children[1].children[1].children[1].children[0];
                        tgt.oninput = updateSemester;
        
                        var tgt = d_cfg.children[1].children[2].children[1].children[0];
                        tgt.oninput = updateSemester;
        
                        var tgt = d_cfg.children[1].children[3].children[1].children[0];
                        tgt.oninput = updateSemester;
        
                        var tgt = d_cfg.children[1].children[6].children[1];
                        tgt.onclick = cardComponent.addPeople;

                        layui.form.on('submit(submit-new-semester)', function(data){
                            let tgt = d_cfg.children[1].children[7].children[0];
                            let d_hint = document.createElement('div');
                            d_hint.style.display = 'inline';
                            d_hint.style.paddingLeft = '1em';
                            d_hint.innerHTML = '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i>';
                            tgt.children[0].classList.add('layui-btn-disabled');
                            tgt.appendChild(d_hint);
        
                            /* Modify teacher / ta list. */
                            var people = cardComponent.people;
                            var cmpItem = function(item1, item2) {
                                // return 1 if item1 < item2 (item1 newer), 0 if equal.
                                var seq = ['Winter', 'Spring', 'Summer', 'Fall'];
                                if (item1[1] != item2[1])
                                    return item1[1] > item2[1] ? 1 : -1;
                                if (seq.indexOf(item1[0]) != seq.indexOf(item2[0]))
                                    return seq.indexOf(item1[0]) > seq.indexOf(item2[0]) ? 1 : -1;
                                if (item1[0] != item2[0])
                                    return item1[0] < item2[0] ? 1 : -1;
                                if (item1[2] != item2[2])
                                    return item1[2] < item2[2] ? 1 : -1;
                                if (item1[3] != item2[3])
                                    return item1[3] < item2[3] ? 1 : -1;
                                return 0;
                            };
                            var addAs = function(pid, role) {
                                let item = [semester.season, semester.year, cardComponent.content.code, cardComponent.content.name];
                                role += '-courses';
        
                                if (people[pid] == undefined || pid == 'unknown') return;
        
                                if (people[pid][role] == undefined) {
                                    people[pid][role] = [item];
                                    return;
                                }
                                
                                let clist = people[pid][role];
                                let insert_idx = clist.length;
                                for (let i = 0; i < clist.length; i++) {
                                    const item2 = clist[i];
                                    if (cmpItem(item, item2) == 0) return;
                                    if (cmpItem(item, item2) == 1) {insert_idx = i; break;}
                                }
                                clist.splice(insert_idx, 0, item);
                            }
                            
                            teacherTagIns.getInputValue().forEach(e => {
                                addAs(e, 'teach');
                            });
                            taTagIns.getInputValue().forEach(e => {
                                addAs(e, 'ta');
                            });
        
                            let slist = cardComponent.content.semesters;
                            let insert_idx = slist.length;
                            for (let i = 0; i < slist.length; i++) {
                                const item1 = [semester.season, semester.year, semester.course_id, ''];
                                const item2 = [slist[i].season, slist[i].year, slist[i].course_id, ''];
                                if (cmpItem(item1, item2) == 0) return;
                                if (cmpItem(item1, item2) == 1) {insert_idx = i; break;}
                            }
                            slist.splice(insert_idx, 0, semester);
        
                            cardComponent.loadContent({
                                path: "/contents/people/meta.json"
                            }).done(function(data){
                            
                            cardComponent.uploadFile({
                                path: "/contents/people/meta.json",
                                sha: data.sha,
                                content: window.btoa(unescape(encodeURIComponent(JSON.stringify(cardComponent.people, null, 4)))),
                                message: "update course "+cardComponent.content.code,
                            }).done(function(){
        
                                cardComponent.loadContent({
                                    path: "/contents/courses/" + cardComponent.content.code + "/meta.json"
                                }).done(function(data){
                                
                                cardComponent.uploadFile({
                                    path: "/contents/courses/" + cardComponent.content.code + "/meta.json",
                                    sha: data.sha,
                                    content: window.btoa(unescape(encodeURIComponent(JSON.stringify(cardComponent.content, null, 4)))),
                                    message: "update course "+cardComponent.content.code,
                                }).done(function(){
        
                                    d_hint.innerHTML = '<p style="color: green; display: inline;"><i class="layui-icon layui-icon-ok-circle"></i>添加成功！</p>';
                                    setTimeout(function(){
                                        tgt.children[0].classList.remove('layui-btn-disabled');
                                        tgt.children[2].remove();
                                    }, 3000);
            
                                });});
        
                            });});
                            
                        });
                    }
                }

                element.onclick = ctl_d.render;
                ctl_d.showcfg();
            },

            renderConfig: function (idx, element) {
                const semester_data = content.semesters[idx];

                let btn_e = element.getElementsByClassName("layui-btn")[0];
                let cfgbtn_e = document.createElement('div');
                btn_e.style['float'] = '';
                cfgbtn_e.style['display'] = 'inline';
                cfgbtn_e.style['margin'] = '10px';
                cfgbtn_e.innerHTML = '<a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-primary-violet" title="设置" style="font-weight: normal; padding: 0 7px;"><i class="fa fa-cog icon-gear" aria-hidden="true"></i></a>';
                btn_e.parentElement.style['float'] = 'right';
                btn_e.parentElement.insertBefore(cfgbtn_e, btn_e);
                
                let semester = element.getAttribute('semester');
                let cfg_e = document.createElement('div');
                cfg_e.innerHTML = '<hr><form class="layui-form" action="" lay-filter="form-'+ semester +'" style="padding-top: 15px;">    <div class="layui-form-item">        <div class="layui-inline">            <label class="layui-form-label">季节</label>            <div class="layui-input-inline">              <input type="text" name="season" disabled readonly class="layui-input layui-disabled">            </div>        </div>        <div class="layui-inline">          <label class="layui-form-label">学年</label>          <div class="layui-input-inline">            <input type="text" name="year" disabled readonly class="layui-input layui-disabled">          </div>        </div>        <div class="layui-inline">            <label class="layui-form-label">课程编号</label>            <div class="layui-input-inline">              <input type="text" name="course_id" disabled readonly class="layui-input layui-disabled">            </div>        </div>        <div class="layui-inline">          <label class="layui-form-label">开课单位</label>          <div class="layui-input-inline">            <input type="text" name="department" lay-verify="required" autocomplete="off" class="layui-input">          </div>        </div>        <div class="layui-inline">          <label class="layui-form-label">学分</label>          <div class="layui-input-inline">            <input type="text" name="credit" lay-verify="required" autocomplete="off" class="layui-input">          </div>        </div>        <div class="layui-inline">            <label class="layui-form-label">学时</label>            <div class="layui-input-inline">              <input type="text" name="hours" lay-verify="required" autocomplete="off" class="layui-input">            </div>        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">先修课程</label>        <div class="layui-input-block">            <input style="width: 95%" type="text" name="prerequisite" lay-verify="required" autocomplete="off" class="layui-input">        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">评分标准</label>        <div class="layui-input-block">            <input style="width: 95%" type="text" name="evaluation" lay-verify="required" autocomplete="off" class="layui-input">        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">首页</label>        <div class="layui-input-block">            <input style="width: 95%" type="text" name="mainpage" placeholder="例：https://example.com。不填即无首页。" autocomplete="off" class="layui-input">        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">教师</label>        <div id="teacher-'+ semester.replace('.','-') +'" style="width:95%"></div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">助教</label>        <div id="ta-'+ semester.replace('.','-') +'" style="width:95%"></div>    </div>    <div class="layui-row" style="margin-left: 110px; margin-bottom: 1rem;">        <p style="font-size:12px; margin-bottom:0; text-shadow: 0 0 1rem #fefefe; color: #b4b4b4;">提示：教师、助教将不会在上方联动显示。单击人物ID以查看详情。</p>        <a href="javascript:;" style="font-size:12px; font-weight: normal;">没有找到？点这里添加人物</a>    </div>        <div class="layui-form-item">    <div class="layui-input-block">      <button type="button" class="layui-btn layui-btn-violet" lay-submit="" lay-filter="submit-'+ semester +'">修改</button>      <button type="reset" class="layui-btn layui-btn-primary-violet layui-btn-disabled">重置</button>    </div>  </div></form>';
                element.children[0].children[0].appendChild(cfg_e);

                {
                    function show() {
                        cfgbtn_e.onclick = hide;
                        cfg_e.classList.remove('layui-hide');
                    }

                    function hide() {
                        cfgbtn_e.onclick = show;
                        cfg_e.classList.add('layui-hide');
                    }

                    hide();
                }

                layui.form.val('form-'+ semester, {
                    "season": semester_data.season,
                    "year": semester_data.year,
                    "course_id": semester_data.course_id,
                    "department": semester_data.department,
                    "credit": semester_data.credit,
                    "hours": semester_data.hours,
                    "prerequisite": semester_data.prerequisite,
                    "evaluation": semester_data.evaluation,
                    "mainpage": (semester_data.mainpage ? semester_data.mainpage : ""),
                });

                var tgt = cfg_e.children[1].children[0].children[3].children[1].children[0];
                tgt.oninput = function(){
                    let tgt = element.children[0].children[0].children[0].children[1].children[0].children[0].children[4];
                    tgt.innerHTML = '<b>开课单位：</b>' + (cfg_e.children[1].children[0].children[3].children[1].children[0].value);
                }

                var tgt = cfg_e.children[1].children[0].children[4].children[1].children[0];
                tgt.oninput = function(){
                    let tgt = element.children[0].children[0].children[0].children[1].children[0].children[0].children[5];
                    tgt.innerHTML = '<b>学分：</b>' + (cfg_e.children[1].children[0].children[4].children[1].children[0].value);
                }

                var tgt = cfg_e.children[1].children[0].children[5].children[1].children[0];
                tgt.oninput = function(){
                    let tgt = element.children[0].children[0].children[0].children[1].children[0].children[0].children[6];
                    tgt.innerHTML = '<b>学时：</b>' + (cfg_e.children[1].children[0].children[5].children[1].children[0].value);
                }

                var tgt = cfg_e.children[1].children[1].children[1].children[0];
                tgt.oninput = function(){
                    let tgt = element.children[0].children[0].children[0].children[1].children[0].children[0].children[7];
                    tgt.innerHTML = '<b>先修课程：</b>' + (cfg_e.children[1].children[1].children[1].children[0].value);
                }

                var tgt = cfg_e.children[1].children[2].children[1].children[0];
                tgt.oninput = function(){
                    let tgt = element.children[0].children[0].children[0].children[1].children[0].children[0].children[8];
                    tgt.innerHTML = '<b>评分标准：</b>' + (cfg_e.children[1].children[2].children[1].children[0].value);
                }

                var tgt = cfg_e.children[1].children[3].children[1].children[0];
                tgt.oninput = function(){
                    if (cfg_e.children[1].children[3].children[1].children[0].value) {
                        btn_e.href = cfg_e.children[1].children[3].children[1].children[0].value;
                        btn_e.classList.remove("layui-btn-disabled");
                    } else {
                        btn_e.href = "javascript:;";
                        btn_e.classList.add("layui-btn-disabled");
                    }
                }

                var tgt = cfg_e.children[1].children[6].children[1];
                tgt.onclick = cardComponent.addPeople;

                let teacherTagIns = layui.tagsInputAutoComplete.render({
                    elem: '#teacher-'+ semester.replace('.','-'),
                    inputValue: semester_data.teacher,
                    autoCompleteData: [{"name": "unknown", "info": "未知 (unknown)"}],
                    listTemplate: '<p style="display: none;">{{d.name}}</p><p>{{d.info}}</p>',
                    inputchange: function (val, allVal, event) {

                        let autoCompleteData = [];
                        
                        for (const pid in cardComponent.people) {
                            if (Object.hasOwnProperty.call(cardComponent.people, pid)) {
                                const p = cardComponent.people[pid];
                                const s = p.name + ' (' + pid + ')';
                                if (s.includes(val)) autoCompleteData.push({ name: pid, info: s});
                                if (autoCompleteData.length >= 6) break;
                            }
                        }

                        teacherTagIns.reload({
                          autoCompleteData: autoCompleteData
                        })
                    },
                    tagClick: function (val, allVal, event) {
                        cardComponent.modifyPeople(val);
                    },
                });
                let taTagIns = layui.tagsInputAutoComplete.render({
                    elem: '#ta-'+ semester.replace('.','-'),
                    inputValue: semester_data.ta,
                    autoCompleteData: [{"name": "unknown", "info": "未知 (unknown)"}],
                    listTemplate: '<p style="display: none;">{{d.name}}</p><p>{{d.info}}</p>',
                    inputchange: function (val, allVal, event) {

                        let autoCompleteData = [];
                        
                        for (const pid in cardComponent.people) {
                            if (Object.hasOwnProperty.call(cardComponent.people, pid)) {
                                const p = cardComponent.people[pid];
                                const s = p.name + ' (' + pid + ')';
                                if (s.includes(val)) autoCompleteData.push({ name: pid, info: s});
                                if (autoCompleteData.length >= 6) break;
                            }
                        }

                        taTagIns.reload({
                          autoCompleteData: autoCompleteData
                        })
                    },
                    tagClick: function (val, allVal, event) {
                        cardComponent.modifyPeople(val);
                    },
                });

                layui.form.on('submit(submit-'+ semester +')', function(data){
                    let tgt = cfg_e.children[1].children[7].children[0];
                    let d_hint = document.createElement('div');
                    d_hint.style.display = 'inline';
                    d_hint.style.paddingLeft = '1em';
                    d_hint.innerHTML = '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i>';
                    tgt.children[0].classList.add('layui-btn-disabled');
                    tgt.appendChild(d_hint);

                    /* Modify teacher / ta list. */
                    var people = cardComponent.people;
                    var cmpItem = function(item1, item2) {
                        // return 1 if item1 < item2 (item1 newer), 0 if equal.
                        var seq = ['Winter', 'Spring', 'Summer', 'Fall'];
                        if (item1[1] != item2[1])
                            return item1[1] > item2[1] ? 1 : -1;
                        if (seq.indexOf(item1[0]) != seq.indexOf(item2[0]))
                            return seq.indexOf(item1[0]) > seq.indexOf(item2[0]) ? 1 : -1;
                        if (item1[0] != item2[0])
                            return item1[0] < item2[0] ? 1 : -1;
                        if (item1[2] != item2[2])
                            return item1[2] < item2[2] ? 1 : -1;
                        if (item1[3] != item2[3])
                            return item1[3] < item2[3] ? 1 : -1;
                        return 0;
                    };
                    var addAs = function(pid, role) {
                        let item = [semester_data.season, semester_data.year, cardComponent.content.code, cardComponent.content.name];
                        role += '-courses';

                        if (people[pid] == undefined || pid == 'unknown') return;

                        if (people[pid][role] == undefined) {
                            people[pid][role] = [item];
                            return;
                        }
                        
                        let clist = people[pid][role];
                        let insert_idx = clist.length;
                        for (let i = 0; i < clist.length; i++) {
                            const item2 = clist[i];
                            if (cmpItem(item, item2) == 0) return;
                            if (cmpItem(item, item2) == 1) {insert_idx = i; break;}
                        }
                        clist.splice(insert_idx, 0, item);
                    }
                    var rmAs = function(pid, role) {
                        let item = [semester_data.season, semester_data.year, cardComponent.content.code, cardComponent.content.name];
                        role += '-courses';

                        if (people[pid] == undefined || pid == 'unknown') return;

                        if (people[pid][role] == undefined) return;

                        for (const idx_ in cardComponent.content.semesters) {
                            const that = cardComponent.content.semesters[idx_];
                            if (that.season == semester_data.season &&
                                that.year == semester_data.year &&
                                that.course_id != semester_data.course_id &&
                                (role == 'teach' && that.teacher.includes(pid) ||
                                role == 'ta' && that.ta.includes(pid)))
                                return;
                        }
                        
                        let clist = people[pid][role];
                        for (let i = 0; i < clist.length; i++) {
                            const item2 = clist[i];
                            if (cmpItem(item, item2) == 0) clist.splice(i, 1);
                        }
                    }
                    
                    semester_data.teacher.forEach(e => {
                        rmAs(e, 'teach');
                    });
                    teacherTagIns.getInputValue().forEach(e => {
                        addAs(e, 'teach');
                    });
                    semester_data.ta.forEach(e => {
                        rmAs(e, 'ta');
                    });
                    taTagIns.getInputValue().forEach(e => {
                        addAs(e, 'ta');
                    });

                    content.semesters[idx].department = data.field.department;
                    content.semesters[idx].credit = data.field.credit;
                    content.semesters[idx].hours = data.field.hours;
                    content.semesters[idx].prerequisite = data.field.prerequisite;
                    content.semesters[idx].evaluation = data.field.evaluation;
                    content.semesters[idx].mainpage = data.field.mainpage;
                    if (data.field.mainpage == "") delete content.semesters[idx].mainpage;
                    content.semesters[idx].teacher = teacherTagIns.getInputValue();
                    content.semesters[idx].ta = taTagIns.getInputValue();

                    cardComponent.loadContent({
                        path: "/contents/people/meta.json"
                    }).done(function(data){
                    
                    cardComponent.uploadFile({
                        path: "/contents/people/meta.json",
                        sha: data.sha,
                        content: window.btoa(unescape(encodeURIComponent(JSON.stringify(cardComponent.people, null, 4)))),
                        message: "update course "+cardComponent.content.code,
                    }).done(function(){

                        cardComponent.loadContent({
                            path: "/contents/courses/" + cardComponent.content.code + "/meta.json"
                        }).done(function(data){
                        
                        cardComponent.uploadFile({
                            path: "/contents/courses/" + cardComponent.content.code + "/meta.json",
                            sha: data.sha,
                            content: window.btoa(unescape(encodeURIComponent(JSON.stringify(cardComponent.content, null, 4)))),
                            message: "update course "+cardComponent.content.code,
                        }).done(function(){

                            d_hint.innerHTML = '<p style="color: green; display: inline;"><i class="layui-icon layui-icon-ok-circle"></i>修改成功！</p>';
                            setTimeout(function(){
                                tgt.children[0].classList.remove('layui-btn-disabled');
                                tgt.children[2].remove();
                            }, 3000);
    
                        });});

                    });});
                    
                });

            },

            modifyPeople: function(pid) {
                var p = cardComponent.people[pid];

                function stringToEntity(str,radix){
                    let arr=str.split('')
                    radix=radix||0
                    let tmp=arr.map(item=>
                    `&#${(Math.random()>0.5?'x'+item.charCodeAt(0).toString(16):item.charCodeAt(0))};`).join('')
                    return tmp
                }
                function entityToString(entity){
                    let entities=entity.split(';')
                    entities.pop()
                    let tmp=entities.map(item=>String.fromCharCode(
                    item[2]==='x'?parseInt(item.slice(3),16):parseInt(item.slice(2)))).join('')
                    return tmp
                }

                function makeHTML() {
                    if (!p) return '<p>人物不存在...再检查一下ID是否正确？</p>';

                    let getImage = function(url, pid) {
                        if (url == true) {
                            url = "https://raw.githubusercontent.com/" + options.owner + "/" + options.repo + "/file-base/people/images/" + pid + ".jpg";
                        } else if (!url) {
                            url = "layui/images/teacher.jpg";
                        }
                        return proxy.parse(url);
                    }
                    
                    let html = '<div style="margin-bottom: 10px; text-align: center;">\
                        <img src="'+getImage(p.image, pid)+'" style="border-radius: 50%; width: 100px; height: 100px;">\
                    </div>\
                    <h1 style="text-align: center;">\
                        <span style="font-family: \'等线 Light\', Helvetica, \'Hiragino Sans GB\', \'Microsoft Yahei\', \'微软雅黑\', Arial, sans-serif;">'+p.name+'</span>\
                    </h1>\
                    ';

                    if (p.info) {
                        html += '<ul class="plain" style="margin-bottom: 2em;">';
                        for (let i = 0; i < p.info.length; i++) {
                            const e = p.info[i];
                            html += '<li style="margin-bottom: 1rem; padding-left: 0.325rem; font-size: 16px; font-family: Quicksand, Arial, sans-serif; text-overflow: ellipsis; white-space:nowrap; overflow:hidden;"><a href="'+e[2]+'"><i class="fa fa-'+e[0]+'" aria-hidden="true" style="border-radius: 4px; color: #5956ff; display: inline-block; margin-right: 1rem; text-align: center; font-size: 18px;"></i>'+e[1]+'</a></li>';
                        }
                        html += '</ul>';
                    }

                    return html;
                }

                if (!document.getElementById('m_pinfo')) {
                    var d = document.createElement('div'),
                        d1 = document.createElement('div'),
                        d2 = document.createElement('div');
                    d.setAttribute('id', 'm_pinfo');
                    d.style.display = 'none';
                    d.style.margin = '2rem';
                    d1.innerHTML = makeHTML();
                    d.appendChild(d1);
                    d.appendChild(d2);
                    $('body').append(d);
                } else {
                    var d = document.getElementById('m_pinfo'),
                        d1 = d.children[0],
                        d2 = d.children[1];
                    d1.innerHTML = makeHTML();
                    d2.innerHTML = '';
                }

                if (!p || pid == 'unknown') {
                    var layer_idx = layer.open({
                        type:1
                        ,content: $(d)
                        ,title: pid
                        ,maxWidth: 1000
                    });
                    return;
                }

                p = JSON.parse(JSON.stringify(p));

                let cfg_html = '<hr><form class="layui-form" action="" lay-filter="form-'+ pid +'" style="padding-top: 15px;">    <div class="layui-form-item">        <label class="layui-form-label">ID</label>        <div class="layui-input-block">            <input style="width: 95%" type="text" name="pid" disabled readonly class="layui-input layui-disabled">        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">姓名</label>        <div class="layui-input-block">            <input style="width: 95%" type="text" name="name" lay-verify="required" autocomplete="off" class="layui-input">        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">头像</label>        <button type="button" class="layui-btn layui-btn-primary-violet" id="uploadAvatar-'+ pid +'">            <i class="layui-icon layui-icon-upload"></i>上传图片        </button>    </div>        <table class="layui-table" id="table" lay-filter="table">        <thead>            <tr>                <td style="width: 150px;">图标 <p style="font-size:12px; text-shadow: 0 0 1rem #fefefe; color: #b4b4b4; margin-left: 0.5rem; display: inline;">fontawesome图标ID</p></td>                <td style="width: 150px;">文本 <p style="font-size:12px; width: 150px; text-shadow: 0 0 1rem #fefefe; color: #b4b4b4; margin-left: 0.5rem; display: inline;">要显示的文本</p></td>                <td style="width: 150px;">链接 <p style="font-size:12px; width: 150px; text-shadow: 0 0 1rem #fefefe; color: #b4b4b4; margin-left: 0.5rem; display: inline;">要转向的链接</p></td>                <td><a class="layui-btn layui-btn-xs add">添加</a></td>            </tr>        </thead>        <tbody>        </tbody>    </table>      <div class="layui-form-item">        <div class="layui-input-block">            <button type="button" class="layui-btn layui-btn-violet" lay-submit="" lay-filter="submit-'+ pid +'">修改</button>            <button type="reset" class="layui-btn layui-btn-primary-violet layui-btn-disabled">重置</button>            </div>    </div></form>';

                d2.innerHTML = cfg_html;

                var idx = 0;
                function addLine(icon, text, link) {
                    var html = '<tr>'+
                            '<td><input style="width:150px;" type="text" class="layui-input" name="icon-' + (idx) + '"></td>'+
                            '<td><input style="width:150px;" type="text" class="layui-input" name="text-' + (idx) + '"></td>'+
                            '<td><input style="width:150px;" type="text" class="layui-input" name="link-' + (idx) + '"></td>'+
                            '<td>'+
                                '<a class="layui-btn layui-btn-danger layui-btn-xs del">删除</a>'+
                            '</td>'+
                        '</tr>';
                    $(html).appendTo($('#table tbody:last'));
                    layui.form.render();
                    var data = {};
                    data["icon-" + idx] = icon;
                    data["text-" + idx] = text;
                    data["link-" + idx] = link;
                    layui.form.val('form-'+ pid, data);

                    var tgt = $('[name=icon-' + idx + ']')[0];
                    tgt.oninput = function(){
                        var idx = $('#table tbody tr').index($(this).closest('tr'));
                        var tgt = $('[name=icon-' + idx + ']')[0];
                        p.info[idx][0] = tgt.value;
                        d1.innerHTML = makeHTML();
                    }

                    var tgt = $('[name=text-' + idx + ']')[0];
                    tgt.oninput = function(){
                        var idx = $('#table tbody tr').index($(this).closest('tr'));
                        var tgt = $('[name=text-' + idx + ']')[0];
                        p.info[idx][1] = tgt.value;
                        if (p.info[idx][0] == 'envelope') {
                            p.info[idx][1] = stringToEntity(tgt.value);
                        }
                        d1.innerHTML = makeHTML();
                    }

                    var tgt = $('[name=link-' + idx + ']')[0];
                    tgt.oninput = function(){
                        var idx = $('#table tbody tr').index($(this).closest('tr'));
                        var tgt = $('[name=link-' + idx + ']')[0];
                        p.info[idx][2] = tgt.value;
                        if (p.info[idx][0] == 'envelope') {
                            p.info[idx][2] = 'mailto:'+stringToEntity(tgt.value.split('mailto:').pop());
                        }
                        d1.innerHTML = makeHTML();
                    }

                    idx++;
                }

                $('body').off('click', '.add');
                $('body').on('click', '.add', function() {
                    if (p.info) {
                        p.info.push(['', '', '']);
                    } else {
                        p.info = [['', '', '']]
                    }
                    addLine('', '', '');
                });

                $('body').off('click', '.del');
                $('body').on('click', '.del', function() {
                    var idx = $('#table tbody tr').index($(this).closest('tr'));
                    p.info.splice(idx, 1);
                    $(this).closest('tr').remove();
                    d1.innerHTML = makeHTML();
                });

                /* Default values. */
                layui.form.val('form-'+ pid, {
                    pid: pid,
                    name: p.name
                });

                if (p.info) {
                    for (let i = 0; i < p.info.length; i++) {
                        const e = p.info[i];
                        if (e[0] == 'envelope') {
                            addLine(e[0], entityToString(e[1]), 'mailto:'+entityToString(e[2].split('mailto:').pop()));
                        } else {
                            addLine(e[0], e[1], e[2]);
                        }
                    }
                }

                var tgt = d2.children[1].children[1].children[1].children[0];
                tgt.oninput = function(){
                    var tgt = d2.children[1].children[1].children[1].children[0];
                    p.name = tgt.value;
                    d1.innerHTML = makeHTML();
                }

                layui.avatar.render({
                    elem: '#uploadAvatar-' + pid,
                    ratio: 1,
                    success: function (base64, size) {
                        p.image = base64;
                        d1.innerHTML = makeHTML();
                    }
                });

                $('.tailoring-container').css('z-index', '20000612');

                var layer_idx = layer.open({
                    type:1
                    ,content: $(d)
                    ,title: pid
                    ,maxWidth: 1000
                });

                layui.form.on('submit(submit-'+ pid +')', function(data){
                    let tgt = d2.children[1].children[4].children[0];
                    let d_hint = document.createElement('div');
                    d_hint.style.display = 'inline';
                    d_hint.style.paddingLeft = '1em';
                    d_hint.innerHTML = '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i>';
                    tgt.children[0].classList.add('layui-btn-disabled');
                    tgt.appendChild(d_hint);

                    // 1. update people
                    cardComponent.people[pid].name = p.name;
                    cardComponent.people[pid].info = p.info;
                    var img_buffer = cardComponent.people[pid].image;
                    if (typeof(p.image) == 'string' && p.image.slice(0,4) == 'data')
                        cardComponent.people[pid].image = true;

                    cardComponent.loadContent({
                        path: "/contents/people/meta.json"
                    }).done(function(data){
                    
                    cardComponent.uploadFile({
                        path: "/contents/people/meta.json",
                        sha: data.sha,
                        content: window.btoa(unescape(encodeURIComponent(JSON.stringify(cardComponent.people, null, 4)))),
                        message: "update people "+pid,
                    }).done(function(){

                    // 2. check image
                    if (typeof(p.image) == 'string' && p.image.slice(0,4) == 'data' && img_buffer) {
                        cardComponent.loadContent({
                            path: "/contents/people/images/" + pid + ".jpg"
                        }).done(function(data){
                        
                        cardComponent.uploadFile({
                            path: "/contents/people/images/" + pid + ".jpg",
                            sha: data.sha,
                            content: p.image.replace(/data.+?;base64,/, ""),
                            message: "update image for "+pid,
                        }).done(function(){
                            d_hint.innerHTML = '<p style="color: green; display: inline;"><i class="layui-icon layui-icon-ok-circle"></i>修改成功！</p>';
                            setTimeout(function(){
                                tgt.children[0].classList.remove('layui-btn-disabled');
                                tgt.children[2].remove();
                                layer.close(layer_idx);
                            }, 3000);
                        });});
                    } else if (typeof(p.image) == 'string' && p.image.slice(0,4) == 'data' && !img_buffer) {
                        cardComponent.uploadFile({
                            path: "/contents/people/images/" + pid + ".jpg",
                            content: p.image.replace(/data.+?;base64,/, ""),
                            message: "update image for "+pid,
                        }).done(function(){
                            d_hint.innerHTML = '<p style="color: green; display: inline;"><i class="layui-icon layui-icon-ok-circle"></i>修改成功！</p>';
                            setTimeout(function(){
                                tgt.children[0].classList.remove('layui-btn-disabled');
                                tgt.children[2].remove();
                                layer.close(layer_idx);
                            }, 3000);
                        });
                    }
                    else {
                        d_hint.innerHTML = '<p style="color: green; display: inline;"><i class="layui-icon layui-icon-ok-circle"></i>修改成功！</p>';
                        setTimeout(function(){
                            tgt.children[0].classList.remove('layui-btn-disabled');
                            tgt.children[2].remove();
                            layer.close(layer_idx);
                        }, 3000);
                    }
                    
                    });});
                    return false;
                });
                
            },

            addPeople: function() {
                var pid = "wums1";
                var p = {"name": "无名氏"};

                function stringToEntity(str,radix){
                    let arr=str.split('')
                    radix=radix||0
                    let tmp=arr.map(item=>
                    `&#${(Math.random()>0.5?'x'+item.charCodeAt(0).toString(16):item.charCodeAt(0))};`).join('')
                    return tmp
                }
                function entityToString(entity){
                    let entities=entity.split(';')
                    entities.pop()
                    let tmp=entities.map(item=>String.fromCharCode(
                    item[2]==='x'?parseInt(item.slice(3),16):parseInt(item.slice(2)))).join('')
                    return tmp
                }

                function makeHTML() {
                    if (!p) return '<p>人物不存在...再检查一下ID是否正确？</p>';

                    let getImage = function(url, pid) {
                        if (url == true) {
                            url = "https://raw.githubusercontent.com/" + options.owner + "/" + options.repo + "/file-base/people/images/" + pid + ".jpg";
                        } else if (!url) {
                            url = "layui/images/teacher.jpg";
                        }
                        return proxy.parse(url);
                    }
                    
                    let html = '<div style="margin-bottom: 10px; text-align: center;">\
                        <img src="'+getImage(p.image, pid)+'" style="border-radius: 50%; width: 100px; height: 100px;">\
                    </div>\
                    <h1 style="text-align: center;">\
                        <span style="font-family: \'等线 Light\', Helvetica, \'Hiragino Sans GB\', \'Microsoft Yahei\', \'微软雅黑\', Arial, sans-serif;">'+p.name+'</span>\
                    </h1>\
                    ';

                    if (p.info) {
                        html += '<ul class="plain" style="margin-bottom: 2em;">';
                        for (let i = 0; i < p.info.length; i++) {
                            const e = p.info[i];
                            html += '<li style="margin-bottom: 1rem; padding-left: 0.325rem; font-size: 16px; font-family: Quicksand, Arial, sans-serif; text-overflow: ellipsis; white-space:nowrap; overflow:hidden;"><a href="'+e[2]+'"><i class="fa fa-'+e[0]+'" aria-hidden="true" style="border-radius: 4px; color: #5956ff; display: inline-block; margin-right: 1rem; text-align: center; font-size: 18px;"></i>'+e[1]+'</a></li>';
                        }
                        html += '</ul>';
                    }

                    return html;
                }

                if (!document.getElementById('m_pinfo')) {
                    var d = document.createElement('div'),
                        d1 = document.createElement('div'),
                        d2 = document.createElement('div');
                    d.setAttribute('id', 'm_pinfo');
                    d.style.display = 'none';
                    d.style.margin = '2rem';
                    d1.innerHTML = makeHTML();
                    d.appendChild(d1);
                    d.appendChild(d2);
                    $('body').append(d);
                } else {
                    var d = document.getElementById('m_pinfo'),
                        d1 = d.children[0],
                        d2 = d.children[1];
                    d1.innerHTML = makeHTML();
                    d2.innerHTML = '';
                }

                if (!p || pid == 'unknown') {
                    var layer_idx = layer.open({
                        type:1
                        ,content: $(d)
                        ,title: pid
                        ,maxWidth: 1000
                    });
                    return;
                }

                p = JSON.parse(JSON.stringify(p));

                layui.form.verify({
                    uniquepid: function(value, item){ //value：表单的值、item：表单的DOM对象
                      if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                        return 'ID不能有特殊字符';
                      }
                      if(!new RegExp("^[a-z0-9_]+$").test(value)){
                        return 'ID仅允许小写字符、数字、下划线，优先使用邮箱前缀或姓名缩写';
                      }
                      if(value in cardComponent.people){
                        return 'ID在数据库中已存在';
                      }
                    }
                });

                let cfg_html = '<hr><form class="layui-form" action="" lay-filter="form-new-people" style="padding-top: 15px;">    <div class="layui-form-item">        <label class="layui-form-label">ID</label>        <div class="layui-input-block">            <input style="width: 95%" type="text" name="pid" lay-verify="required|uniquepid" autocomplete="off" class="layui-input">        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">姓名</label>        <div class="layui-input-block">            <input style="width: 95%" type="text" name="name" lay-verify="required" autocomplete="off" class="layui-input">        </div>    </div>    <div class="layui-form-item">        <label class="layui-form-label">头像</label>        <button type="button" class="layui-btn layui-btn-primary-violet" id="uploadAvatar-new-people">            <i class="layui-icon layui-icon-upload"></i>上传图片        </button>    </div>        <table class="layui-table" id="table" lay-filter="table">        <thead>            <tr>                <td style="width: 150px;">图标 <p style="font-size:12px; text-shadow: 0 0 1rem #fefefe; color: #b4b4b4; margin-left: 0.5rem; display: inline;">fontawesome图标ID</p></td>                <td style="width: 150px;">文本 <p style="font-size:12px; width: 150px; text-shadow: 0 0 1rem #fefefe; color: #b4b4b4; margin-left: 0.5rem; display: inline;">要显示的文本</p></td>                <td style="width: 150px;">链接 <p style="font-size:12px; width: 150px; text-shadow: 0 0 1rem #fefefe; color: #b4b4b4; margin-left: 0.5rem; display: inline;">要转向的链接</p></td>                <td><a class="layui-btn layui-btn-xs add">添加</a></td>            </tr>        </thead>        <tbody>        </tbody>    </table>      <div class="layui-form-item">        <div class="layui-input-block">            <button type="button" class="layui-btn layui-btn-violet" lay-submit="" lay-filter="submit-new-people">修改</button>            <button type="reset" class="layui-btn layui-btn-primary-violet layui-btn-disabled">重置</button>            </div>    </div></form>';

                d2.innerHTML = cfg_html;

                var idx = 0;
                function addLine(icon, text, link) {
                    var html = '<tr>'+
                            '<td><input style="width:150px;" type="text" class="layui-input" name="icon-' + (idx) + '"></td>'+
                            '<td><input style="width:150px;" type="text" class="layui-input" name="text-' + (idx) + '"></td>'+
                            '<td><input style="width:150px;" type="text" class="layui-input" name="link-' + (idx) + '"></td>'+
                            '<td>'+
                                '<a class="layui-btn layui-btn-danger layui-btn-xs del">删除</a>'+
                            '</td>'+
                        '</tr>';
                    $(html).appendTo($('#table tbody:last'));
                    layui.form.render();
                    var data = {};
                    data["icon-" + idx] = icon;
                    data["text-" + idx] = text;
                    data["link-" + idx] = link;
                    layui.form.val('form-new-people', data);

                    var tgt = $('[name=icon-' + idx + ']')[0];
                    tgt.oninput = function(){
                        var idx = $('#table tbody tr').index($(this).closest('tr'));
                        var tgt = $('[name=icon-' + idx + ']')[0];
                        p.info[idx][0] = tgt.value;
                        d1.innerHTML = makeHTML();
                    }

                    var tgt = $('[name=text-' + idx + ']')[0];
                    tgt.oninput = function(){
                        var idx = $('#table tbody tr').index($(this).closest('tr'));
                        var tgt = $('[name=text-' + idx + ']')[0];
                        p.info[idx][1] = tgt.value;
                        if (p.info[idx][0] == 'envelope') {
                            p.info[idx][1] = stringToEntity(tgt.value);
                        }
                        d1.innerHTML = makeHTML();
                    }

                    var tgt = $('[name=link-' + idx + ']')[0];
                    tgt.oninput = function(){
                        var idx = $('#table tbody tr').index($(this).closest('tr'));
                        var tgt = $('[name=link-' + idx + ']')[0];
                        p.info[idx][2] = tgt.value;
                        if (p.info[idx][0] == 'envelope') {
                            p.info[idx][2] = 'mailto:'+stringToEntity(tgt.value.split('mailto:').pop());
                        }
                        d1.innerHTML = makeHTML();
                    }

                    idx++;
                }

                $('body').off('click', '.add');
                $('body').on('click', '.add', function() {
                    if (p.info) {
                        p.info.push(['', '', '']);
                    } else {
                        p.info = [['', '', '']]
                    }
                    addLine('', '', '');
                });

                $('body').off('click', '.del');
                $('body').on('click', '.del', function() {
                    var idx = $('#table tbody tr').index($(this).closest('tr'));
                    p.info.splice(idx, 1);
                    $(this).closest('tr').remove();
                    d1.innerHTML = makeHTML();
                });

                /* Default values. */
                layui.form.val('form-new-people', {
                    pid: pid,
                    name: p.name
                });

                if (p.info) {
                    for (let i = 0; i < p.info.length; i++) {
                        const e = p.info[i];
                        if (e[0] == 'envelope') {
                            addLine(e[0], entityToString(e[1]), 'mailto:'+entityToString(e[2].split('mailto:').pop()));
                        } else {
                            addLine(e[0], e[1], e[2]);
                        }
                    }
                }

                var tgt = d2.children[1].children[0].children[1].children[0];
                tgt.oninput = function(){
                    var tgt = d2.children[1].children[0].children[1].children[0];
                    pid = tgt.value;
                    d1.innerHTML = makeHTML();
                }

                var tgt = d2.children[1].children[1].children[1].children[0];
                tgt.oninput = function(){
                    var tgt = d2.children[1].children[1].children[1].children[0];
                    p.name = tgt.value;
                    d1.innerHTML = makeHTML();
                }

                layui.avatar.render({
                    elem: '#uploadAvatar-new-people',
                    ratio: 1,
                    success: function (base64, size) {
                        p.image = base64;
                        d1.innerHTML = makeHTML();
                    }
                });

                $('.tailoring-container').css('z-index', '20000612');

                var layer_idx = layer.open({
                    type:1
                    ,content: $(d)
                    ,title: '新增人物'
                    ,maxWidth: 1000
                });

                layui.form.on('submit(submit-new-people)', function(data){
                    let tgt = d2.children[1].children[4].children[0];
                    let d_hint = document.createElement('div');
                    d_hint.style.display = 'inline';
                    d_hint.style.paddingLeft = '1em';
                    d_hint.innerHTML = '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i>';
                    tgt.children[0].classList.add('layui-btn-disabled');
                    tgt.appendChild(d_hint);

                    // 1. update people
                    cardComponent.people[pid] = {};
                    cardComponent.people[pid].name = p.name;
                    cardComponent.people[pid].info = p.info;
                    if (typeof(p.image) == 'string' && p.image.slice(0,4) == 'data')
                        cardComponent.people[pid].image = true;

                    cardComponent.loadContent({
                        path: "/contents/people/meta.json"
                    }).done(function(data){
                    
                    cardComponent.uploadFile({
                        path: "/contents/people/meta.json",
                        sha: data.sha,
                        content: window.btoa(unescape(encodeURIComponent(JSON.stringify(cardComponent.people, null, 4)))),
                        message: "add people "+pid,
                    }).done(function(){

                    // 2. check image
                    if (typeof(p.image) == 'string' && p.image.slice(0,4) == 'data') {
                        cardComponent.uploadFile({
                            path: "/contents/people/images/" + pid + ".jpg",
                            content: p.image.replace(/data.+?;base64,/, ""),
                            message: "add image for "+pid,
                        }).done(function(){
                            d_hint.innerHTML = '<p style="color: green; display: inline;"><i class="layui-icon layui-icon-ok-circle"></i>添加成功！</p>';
                            setTimeout(function(){
                                tgt.children[0].classList.remove('layui-btn-disabled');
                                tgt.children[2].remove();
                                layer.close(layer_idx);
                            }, 3000);
                        });
                    } else {
                        d_hint.innerHTML = '<p style="color: green; display: inline;"><i class="layui-icon layui-icon-ok-circle"></i>添加成功！</p>';
                        setTimeout(function(){
                            tgt.children[0].classList.remove('layui-btn-disabled');
                            tgt.children[2].remove();
                            layer.close(layer_idx);
                        }, 3000);
                    }
                    
                    });});
                    return false;
                });
                
            },

            loadFolders: function(idx_, element) {
                var semester = element.getAttribute('semester');

                function addFolder() {
                    /** add dir... */
                    var d = document.createElement('div');
                    d.classList.add('layui-card');
                    d.style.borderRadius = '0 0 10px 10px';
                    var details = '<div class="layui-card-body"><a href="javascript:;"><i class="fa fa-folder-open-o" aria-hidden="true"></i> 新建文件夹</a></div>';
                    d.innerHTML = details;
                    element.appendChild(d);

                    $('body').append('<form class="layui-form" action="" lay-filter="form-new-folder-' + idx_ + '" style="margin: 1rem; display: none;"><div class="layui-form-item"><label class="layui-form-label">文件夹名称</label><div class="layui-input-block">    <div id="form-new-folder-' + idx_ + '" ></div></div></div></div>');

                    let folderIns = layui.tagsInputAutoComplete.render({
                        elem: "#form-new-folder-" + idx_,
                        inputMode: 'text',
                        autoCompleteData: [{"name": "Lecture Slides 教学课件"}],
                        inputchange: function (val, allVal, event) {

                            const DEFAULT_FOLDERS = [
                                "Discussion 讨论课",
                                "Exam 考试",
                                "Homework 作业",
                                "Homework Solution 作业答案",
                                "Labs 实验",
                                "Lecture Notes 教学笔记",
                                "Lecture Slides 教学课件",
                                "Project 课程设计",
                                "Quiz 随堂测验",
                                "Quiz Solution 随堂测验答案",
                                "Readings 文献阅读",
                                "Resources 课程资源",
                                "Schedule 教学安排",
                                "Tutorials 习题课",
                                "[Community] Cheat sheet [社区] 速查清单"
                            ];
    
                            let autoCompleteData = [];
                            
                            for (const f_idx in DEFAULT_FOLDERS) {
                                const f_name = DEFAULT_FOLDERS[f_idx];
                                if (f_name.toLowerCase().includes(val.toLowerCase())) autoCompleteData.push({ name: f_name});
                                if (autoCompleteData.length >= 6) break;
                            }
    
                            folderIns.reload({
                              autoCompleteData: autoCompleteData
                            })
                        }
                    });

                    $('.tagsInputAutoComplete-dropdown').css('z-index', '20000612');

                    d.children[0].children[0].onclick = function() {
                        layer.open({
                            type:1
                            ,area: '450px'
                            ,title: '新建文件夹'
                            ,content: $("[lay-filter='form-new-folder-" + idx_ + "']")
                            ,btn: ['提交', '取消']
                            ,btn1: function(index, layero){
                                var folder = folderIns.getInputValue();
                                
                                var detail_d = document.createElement('details');
                                var details = '                                         \
                                            <summary>' + folder + '</summary>                \
                                            <div class="details-wrapper">                       \
                                            <div class="details-styling">                       \
                                            </div>                                              \
                                            </div>                                              \
                                        ';
                                detail_d.innerHTML = details
                                element.insertBefore(detail_d, d);
                                var btn_d = document.createElement('div');
                                detail_d.children[1].children[0].appendChild(btn_d);
                                var accordion = new Collapse(element, { accordion: false }).init();

                                /** render */
                                var args = {
                                    code: cardComponent.course_code,
                                    semester: semester,
                                    folder: folder
                                };
                                var id_s = (args.semester + '-' + args.folder).replaceAll('.', '-').replaceAll(' ', '-');
                                var link = "https://github.com/" + options.owner + "/" + options.repo + "/upload/file-base/courses/" + args.code + "/" + args.semester + '/' + args.folder;
                                btn_d.innerHTML = '<div class="layui-upload" style="display: inline;"><a href="javascript:;" id="' + id_s + '"><i class="fa fa-upload" aria-hidden="true"></i> 上传文件</a><div style="width: 95px; display: inline-block; margin: 4px 1rem;" class="layui-hide">  <div class="layui-progress" lay-filter="' + id_s + '">    <div class="layui-progress-bar" lay-percent=""></div>  </div></div></div><span style="margin: auto 0.5rem;">或</span><a style="font-weight: normal;" href="' + link + '">一次上传多个文件</a>';

                                var upload = layui.github_upload;
    
                                var uploadInst = upload.render({
                                    elem: '#' + id_s //绑定元素
                                    ,url: 'https://httpbin.org/put' //上传接口
                                    ,accept: 'file'
                                    ,data: {
                                        'branch': 'file-base',
                                        'message': 'upload file for ' + args.code
                                    }
                                    ,field: 'content'
                                    ,headers: headers
                                    ,choose: function(obj){
                                        obj.preview(function(index, file, result){
                                            uploadInst.config.url = proxy.parse(options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/courses/" + args.code + "/" + args.semester + '/' + args.folder + '/' + file.name);
                                        });
                                    }
                                    ,before: function(){
                                        $("[lay-filter='" + id_s + "']")[0].parentElement.classList.remove('layui-hide');
                                    }
                                    ,error: function(){
                                        $("[lay-filter='" + id_s + "']")[0].parentElement.classList.add('layui-hide');
                                        layer.msg('上传失败', {icon: 5});
                                    }
                                    ,progress: function(n, elem, e){
                                        layui.element.progress(id_s, n + '%'); //可配合 layui 进度条元素使用
                                        if(n == 100){
                                            $("[lay-filter='" + id_s + "']")[0].parentElement.classList.add('layui-hide');
                                            layer.msg('上传完毕，请稍后刷新页面', {icon: 1});
                                            layui.element.progress(id_s, '0%');
                                        }
                                    }
                                });
                                layer.close(index);
                            },
                            btn2: function(index, layero){
                                layer.close(index);
                            },
                        });
                    }
                }

                $.ajax({
                    url: proxy.parse(options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/courses/" + this.course_code + "/" + semester),
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
                                    var args = {
                                        code: cardComponent.course_code,
                                        semester: semester,
                                        folder: file.name
                                    };
                                    cardComponent.loadFiles(d, file.url, args);
                                }
                            }
                            var accordion = new Collapse(element, { accordion: false }).init();
                            addFolder();
                        } else {
                            console.log('data error:', data);
                        }
                    },
                    error: function(err) {
                        console.log(err);
                        addFolder();
                    }
                })
            },

            loadFiles: function(element, path, args) {
                $.ajax({
                    url: proxy.parse(path),
                    type: "GET",
                    headers: headers,
                    success: function (data) {
                        if (data) {
                            var normal_contents = new Array();
                            var reader_contents = new Array();
                            for (var idx in data) {
                                var file = data[idx];
                                if (file.type == "file") {
                                    var url = proxy.parse(file.download_url);

                                    if (url.endsWith(".md") || url.endsWith(".mdx") || url.endsWith(".htmlx")) {
                                        url = "reader?url="+ url;
                                        reader_contents.push('                        \
                                        <a href="' + url + '">' + file.name.replace(/(.md$)|(.mdx$)|(.htmlx$)/,'') + '</a>   \
                                        ');
                                    } else {
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
                            
                            element.children[1].children[0].innerHTML += '<hr>';
                            var d = document.createElement('div');
                            element.children[1].children[0].appendChild(d);

                            /** render */
                            var id_s = (args.semester + '-' + args.folder).replaceAll('.', '-').replaceAll(' ', '-');
                            var link = "https://github.com/" + options.owner + "/" + options.repo + "/upload/file-base/courses/" + args.code + "/" + args.semester + '/' + args.folder;
                            d.innerHTML = '<div class="layui-upload" style="display: inline;"><a href="javascript:;" id="' + id_s + '"><i class="fa fa-upload" aria-hidden="true"></i> 上传文件</a><div style="width: 95px; display: inline-block; margin: 4px 1rem;" class="layui-hide">  <div class="layui-progress" lay-filter="' + id_s + '">    <div class="layui-progress-bar" lay-percent=""></div>  </div></div></div><span style="margin: auto 0.5rem;">或</span><a style="font-weight: normal;" href="' + link + '">一次上传多个文件</a>';

                            var upload = layui.github_upload;
   
                            var uploadInst = upload.render({
                                elem: '#' + id_s //绑定元素
                                ,url: 'https://httpbin.org/put' //上传接口
                                ,accept: 'file'
                                ,data: {
                                    'branch': 'file-base',
                                    'message': 'upload file for ' + args.code
                                }
                                ,field: 'content'
                                ,headers: headers
                                ,choose: function(obj){
                                    obj.preview(function(index, file, result){
                                        uploadInst.config.url = proxy.parse(options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/courses/" + args.code + "/" + args.semester + '/' + args.folder + '/' + file.name);
                                    });
                                }
                                ,before: function(){
                                    $("[lay-filter='" + id_s + "']")[0].parentElement.classList.remove('layui-hide');
                                }
                                ,error: function(){
                                    $("[lay-filter='" + id_s + "']")[0].parentElement.classList.add('layui-hide');
                                    layer.msg('上传失败', {icon: 5});
                                }
                                ,progress: function(n, elem, e){
                                    layui.element.progress(id_s, n + '%'); //可配合 layui 进度条元素使用
                                    if(n == 100){
                                        $("[lay-filter='" + id_s + "']")[0].parentElement.classList.add('layui-hide');
                                        layer.msg('上传完毕，请稍后刷新页面', {icon: 1});
                                        layui.element.progress(id_s, '0%');
                                    }
                                }
                            });

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

            uploadFile: function(args) {
                /* options: path, content, message, sha, success, error */
                return $.ajax({
                    url: proxy.parse(options.baseURL + "/repos/" + options.owner + "/" + options.repo + args.path),
                    type: "PUT",
                    data: args.sha ? (
                        JSON.stringify({
                            'branch': 'file-base',
                            'message': args.message,
                            'content': args.content,
                            'sha': args.sha
                        })
                    ) : (
                        JSON.stringify({
                            'branch': 'file-base',
                            'message': args.message,
                            'content': args.content
                        })
                    ),
                    headers: headers,
                    contentType: false,
                    processData: false,
                    dataType: 'json',
                    success: args.success,
                    error: args.error
                });
            },

            loadContent: function(args) {
                /* options: path, success, error */
                return $.ajax({
                    url: proxy.parse(options.baseURL + "/repos/" + options.owner + "/" + options.repo + args.path),
                    type: "GET",
                    data: {
                        ref: 'file-base',
                        t: Date.now()
                    },
                    headers: headers,
                    success: args.success,
                    error: args.error
                });
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

