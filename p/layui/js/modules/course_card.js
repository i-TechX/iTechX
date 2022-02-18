layui.define(['jquery', 'util', 'layer', 'proxy', 'form', 'avatar'], function(exports){

    var $ = layui.jquery,
        util = layui.util,
        layer = layui.layer,
        proxy = layui.proxy({});

    var course_card = (function(options){
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

            config: function(options_) {
                options = assign(options, options_);
            },

            render_: function(container){
                node = window.document.getElementById(container);
                this.loadFolders(node);
            },

            loadFolders: function(element) {
                var index = layer.load(2, {
                    content:"<p style='position: relative; left: -10px;'><br><br>Loading...</p>",
                    shade:0
                });
                $.ajax({
                    url: proxy.parse(options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/courses"),
                    type: "GET",
                    data: {
                        'ref': 'file-base'
                    },
                    headers: headers,
                    success: function (data) {
                        if (data) {
                            var d = document.createElement('div');
                            d.className = 'layui-row';
                            var d1 = document.createElement('div');
                            d1.className = 'layui-col-sm9';
                            d1.innerHTML = '&nbsp;';
                            var d2 = document.createElement('div');
                            d2.className = 'layui-col-sm3';
                            d.appendChild(d1);
                            d.appendChild(d2);
                            element.appendChild(d);

                            for (var idx in data) {
                                var file = data[idx];
                                if (file.type == "dir") {
                                    var d = document.createElement('div');
                                    cardComponent.loadDetails(d, file.name);
                                    d1.appendChild(d);
                                }
                            }

                            var d = document.createElement('div');
                            cardComponent.addEmptyCard(d);
                            d1.appendChild(d);

                            var d = document.createElement('div');
                            d.innerHTML = '<div style="margin: 2em;"><blockquote class="layui-elem-quote"><p>欢迎来到您的个人空间。点击<a href="https://i-techx.github.io">这里</a>返回主页。</p></blockquote></div><div style="margin: 2em;"><blockquote class="layui-elem-quote"><p>小贴士：想要将你的贡献分享给所有人？立即<a href="merge">合并至主站</a>。</p></blockquote></div>';
                            d2.appendChild(d);

                            layer.close(index);
                        } else {
                            console.log('data error:', data);
                        }
                    },
                    error: function(err) {
                        console.log(err);
                        layer.close(index);
                        element.innerHTML = '<div style="text-align: center;">\
                            <h1 style="text-align: center; font-size: 5em; line-height: 1.3em; margin: 1rem 0 0 0; padding: 0; text-shadow: 0 0 1rem #fefefe; font-family: Quicksand, Arial; color: #b4b4b4;">404 ERROR...</h1>\
                            <div style="margin:auto; max-width:600px;"><p style="text-align: left; font-size: 1em; line-height: 1.3em; margin-bottom: 6px; padding: 0; text-shadow: 0 0 1rem #fefefe; font-family: Quicksand, Arial; color: #b4b4b4;">There are several possible reasons:</p></div>\
                            <div style="margin:auto; max-width:600px;"><p style="text-align: left; font-size: 1em; line-height: 1.3em; padding: 0; text-shadow: 0 0 1rem #fefefe; font-family: Quicksand, Arial; color: #b4b4b4;">1. You have not logged in and have reached github\'s request rate limit. If so, please log in to continue. See <a href="help">Help</a> for more information.</p></div>\
                            <div style="margin:auto; max-width:600px;"><p style="text-align: left; font-size: 1em; line-height: 1.3em; padding: 0; text-shadow: 0 0 1rem #fefefe; font-family: Quicksand, Arial; color: #b4b4b4; margin-bottom: 3rem;">2. You are in restricted area and blocked by something else. If so, please <a href="settings">set the proper proxy</a> of API.</p></div>\
                            <div style="position: relative;width: 200px;height: 200px; margin:auto;">\
                                <svg viewBox="0 0 120 120" style="overflow: visible"> <defs> <path id="a" d="M0 4.21585531V.05647427h4.15889198v4.15938104H0z"></path> </defs> <g fill="none" fill-rule="evenodd"> <g class="stars animated"> <path d="M32.9862439 29.2981615c.1110863.8208744-.4626987 1.5770446-1.2847376 1.6881041-.8210729.1110595-1.5764599-.4635526-1.6875462-1.2844271-.1120523-.8208744.4626987-1.5760789 1.2837716-1.6881041.8220388-.1110595 1.5774259.4635526 1.6885122 1.2844271" fill="#D0E7FB"></path> <path d="M100.94858 6.8876353c-.214287.79954375-1.0363503 1.27471744-1.8366061 1.06131608-.7983596-.21340136-1.2743411-1.03570792-1.0610028-1.83620012.2142866-.80049221 1.0363503-1.2756659 1.8366062-1.06131609.8002557.21434981 1.2752897 1.03570792 1.0610027 1.83620013" fill="#D0E7FB"></path> <g transform="translate(0 69)"> <mask id="b" fill="#fff"> <use xlink:href="#a"></use> </mask> <path d="M4.0876 2.6727c-.296 1.109-1.436 1.769-2.545 1.472-1.109-.297-1.768-1.436-1.472-2.546.297-1.109 1.436-1.768 2.546-1.471 1.11.296 1.768 1.436 1.471 2.545" fill="#A1D2F8" mask="url(#b)"></path> </g> <path d="M106.948688 111.887537c-.212978.799632-1.035129 1.275692-1.835888 1.060907-.80076-.213855-1.276008-1.035802-1.06117-1.835434.212978-.799632 1.036059-1.275692 1.835888-1.061837.80076.213855 1.275078 1.036732 1.06117 1.836364" fill="#A1D2F8"></path> <path d="M54.2354557 18.9014571c-1.5953959-.4199186-2.556853-2.0704598-2.1369062-3.6657486.4209514-1.5962933 2.0705988-2.5576859 3.6659948-2.1367627 1.5953959.4209232 2.556853 2.0704598 2.1369062 3.6657486-.4209514 1.5952888-2.0695942 2.5566813-3.6659948 2.1367627z" stroke="#A1D2F8" stroke-width="2"></path> <path d="M16.9721415 7.59675618c.2239612 1.64109572-.9269786 3.15263122-2.5690262 3.37559532-1.640039.222964-3.1515262-.9270082-3.3754875-2.56810392-.2229569-1.64210006.9279829-3.1536356 2.5690262-3.37659964 1.6410433-.22296405 3.1525306.92700817 3.3754875 2.56910824" fill="#A1D2F8"></path> <path d="M49.2357085 117.901451c-1.5962933-.419947-2.5576859-2.070599-2.1367627-3.665995.4209232-1.595396 2.0704598-2.556853 3.6657486-2.136907 1.5952888.420952 2.5566813 2.070599 2.1367627 3.665995-.4209231 1.595396-2.0694552 2.556853-3.6657486 2.136907z" stroke="#A1D2F8" stroke-width="2"></path> </g> <g class="rocket animated"> <path fill="#F2F9FE" d="M53.9118329 92L44 81.3510365 50.0881671 76 60 86.6489635z"></path> <path stroke="#A1D2F8" stroke-width="2" stroke-linejoin="round" d="M53.9118329 92L44 81.3510365 50.0881671 76 60 86.6489635z"></path> <path fill="#FFF" d="M57 47.0157449L49.8317064 42 24 60.6301909 49.2570499 62z"></path> <path fill="#F2F9FE" d="M87.754216 81L92 88.7814042 71 113l1.16221-25.7194181z"></path> <path d="M108.233532 59.9703727c10.579453-16.2472813 10.22216-27.2231872 9.399093-31.6550767v-.0029805c-.413027-5.3975467-5.752516-6.357243-5.752516-6.357243-4.3323-1.2656865-15.2362027-2.7350352-32.5037006 6.126757-22.9294458 11.767705-28.5485982 30.6029873-28.5485982 30.6029873s-4.8199707 15.3392457 1.1942938 22.6243939c.0288621.0387455.0467766.0824584.0806149.1192169.0338383.0377521.0716576.0695432.1054959.1072953.0328431.037752.0627005.0784845.0965388.1162365.0328431.0357651.0746433.0596084.1104722.0923931 6.6512212 6.7099265 22.4268471 3.4771606 22.4268471 3.4771606s19.3415882-3.6718816 33.3914591-25.2511404" fill="#FFF"></path> <path d="M108.214668 59.904736c10.318007-15.8150644 10.338974-26.7477325 9.407418-31.913642-.442314-5.0236555-4.362238-6.8839002-6.034646-7.4529163-.310519-.105447-.646997-.2198471-.998452-.2795341-.309521-.0885357-.642005-.1750818-.993461-.2586436.726874 5.517068.100844 16.050828-9.569167 30.8730987-13.9234193 21.3450646-32.8900212 25.1550846-33.6897816 25.3062916-.5082122.1044523-10.6714593 2.1099353-18.3365784-.7391239.5171983 1.9637021 1.3359293 3.8090251 2.610953 5.3509392l.1936998.233774 1.710349-1.3658374-1.5745595 1.5259975.2546054.2397428c7.1129749 7.0052638 22.6978186 3.9154669 23.3298389 3.7861451.8007589-.151207 19.7663623-3.961227 33.6897814-25.3062916" fill="#F2F9FE"></path> <g> <path d="M77.0779 50.9007l4.331 4.795-8.215 7.421c-.817.738-.623 1.045.429.688l17.561-6.405c1.053-.358 1.261-1.362.463-2.245l-4.331-4.795 8.215-7.421c.818-.738.623-1.045-.43-.69l-17.56 6.407c-1.054.356-1.261 1.362-.463 2.245" fill="#FFF"></path> <path d="M77.0779 50.9007l4.331 4.795-8.215 7.421c-.817.738-.623 1.045.429.688l17.561-6.405c1.053-.358 1.261-1.362.463-2.245l-4.331-4.795 8.215-7.421c.818-.738.623-1.045-.43-.69l-17.56 6.407c-1.054.356-1.261 1.362-.463 2.245" stroke="#A1D2F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> <path d="M108.233532 59.9703727c10.579453-16.2472813 10.22216-27.2231872 9.399093-31.6550767v-.0029805c-.413027-5.3975467-5.752516-6.357243-5.752516-6.357243-4.3323-1.2656865-15.2362027-2.7350352-32.5037006 6.126757-22.9294458 11.767705-28.5485982 30.6029873-28.5485982 30.6029873s-4.8199707 15.3392457 1.1942938 22.6243939c.0288621.0387455.0467766.0824584.0806149.1192169.0338383.0377521.0716576.0695432.1054959.1072953.0328431.037752.0627005.0784845.0965388.1162365.0328431.0357651.0746433.0596084.1104722.0923931 6.6512212 6.7099265 22.4268471 3.4771606 22.4268471 3.4771606s19.3415882-3.6718816 33.3914591-25.2511404z" stroke="#A1D2F8" stroke-width="2"></path> <path stroke="#A1D2F8" stroke-width="2" stroke-linejoin="round" d="M57 47.0157449L49.8317064 42 24 60.6301909 49.2570499 62z"></path> <path d="M65 72l-31 28" stroke="#A1D2F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M110.154443 64.7093112c1.02326.8964969 1.133632 2.4760391.244468 3.5099781l-5.959048 6.9262459c-.888132 1.033939-2.452937 1.1453504-3.476197.2478122l-.117593-.1030815c-1.0242917-.896497-1.133632-2.4760392-.2455-3.508937l5.96008-6.9272871c.888132-1.033939 2.452937-1.1443091 3.476197-.2478122l.117593.1030816z" fill="#FFF"></path> <path d="M110.154443 64.7093112c1.02326.8964969 1.133632 2.4760391.244468 3.5099781l-5.959048 6.9262459c-.888132 1.033939-2.452937 1.1453504-3.476197.2478122l-.117593-.1030815c-1.0242917-.896497-1.133632-2.4760392-.2455-3.508937l5.96008-6.9272871c.888132-1.033939 2.452937-1.1443091 3.476197-.2478122l.117593.1030816z" stroke="#A1D2F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path fill="#D0E7FB" d="M91 85.8362964L88.1804586 81l-15.890329 5.9908294L72 93z"></path> <path stroke="#A1D2F8" stroke-width="2" stroke-linejoin="round" d="M87.754216 81L92 88.7814042 71 113l1.16221-25.7194181z"></path></g></g></svg>\
                            </div>\
                        </div>';
                    }
                })
            },

            addEmptyCard: function(element) {
                var d = document.createElement('div');
                d.classList.add("card-shadow");
                d.innerHTML = '<div class="layui-card" style="border-radius: 10px; margin-bottom: 15px;cursor: pointer;">    <div class="layui-card-body" style="min-height: 170px; display: flex; justify-content: center; align-items: center;">        <i class="fa fa-plus-square-o fa-5x" aria-hidden="true"></i>        <p style="font-size: x-large; margin: 2rem;">添加更多课程...</p>    </div></div>';
                element.appendChild(d);

                let elems = [
                    {
                        "code": 'B612',
                        "cover": 'http://5b0988e595225.cdn.sohucs.com/images/20200306/ee733d4707d44f4191cbf1aa42262f98.jpeg',
                        "name": 'Le Petit Prince',
                    },{
                        "code": 'CS999',
                        "cover": 'https://picsum.photos/501/286',
                        "name": 'Introduction to Fish Touching',
                    }
                ];

                let index = Math.random() < 0.1 ? 0 : 1;
                var elem = elems[index];

                var ctl_d = {
                    active: false,
                    code: elem.code,
                    name: elem.name,
                    init: function(){
                        var cardHTML = '<div class="layui-card" style="border-radius: 10px; margin-bottom: 15px;"><div class="layui-card-body"><div class="layui-row"><div class="layui-col-md3" style="display: flex; justify-content: center;"><a href="javascript:;"><img class="shadow" src="'+ elem.cover +'"style="max-height:15em; max-width:100%"></a></div><div class="layui-col-md9"><div style="margin: 5px 1em;"><div style="font-family: Quicksand; font-weight: bold; text-align: left; font-size: 2em; min-height: 1em;"><a href="javascript:;">'+ elem.name +'</a></div><div class="layui-row layui-col-space5"><div class="layui-col-md8"><p class="layui-hide" style="padding-top: 1%; text-align: left; font-family: Quicksand; font-weight: bold; font-size: 1.2em; margin-bottom: 0.2em; color:#8FBC8F;">ACTIVATE</p><p style="padding-top: 14%; text-align: left; font-size: 1.2em; margin-bottom: 0.2em;">'+ elem.code +'</p><p style="text-align: left; font-size: 1.2em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">'+ 'semesters here...' +'</p></div><div class="layui-col-md4" style="padding-top: 12%; text-align: center; min-width: 150px;"><a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-primary-violet" title="设置" style="font-weight: normal; padding: 0 7px;"><i class="fa fa-cog icon-gear" aria-hidden="true"></i></a><a href="javascript:;" class="layui-btn layui-btn-lg layui-btn-violet layui-btn-disabled" style="font-weight: normal;">查看课程</a></div></div></div></div></div></div></div>';
                        d.innerHTML = cardHTML;
                        var tgt = d.firstChild.firstChild.firstChild.children[1].firstChild.children[1].children[1].firstChild;
                        tgt.onclick = ctl_d.showcfg;
                        ctl_d.showcfg();
                    },
                    activate: function(){
                        d.classList.add("activate");
                        d.firstChild.style["margin-bottom"] = '';
                        // d.firstChild.style["padding-bottom"] = '15px';
                        var tgt = d.firstChild.firstChild.firstChild.children[1].firstChild.children[1].firstChild;
                        tgt.firstChild.classList.remove('layui-hide');
                        tgt.children[1].style["padding-top"] = '7%';
                        ctl_d.active = true;
                    },
                    deactivate: function(){
                        d.classList.remove("activate");
                        // d.firstChild.style["padding-bottom"] = '';
                        d.firstChild.style["margin-bottom"] = '15px';
                        var tgt = d.firstChild.firstChild.firstChild.children[1].firstChild.children[1].firstChild;
                        tgt.firstChild.classList.add('layui-hide');
                        tgt.children[1].style["padding-top"] = '14%';
                        ctl_d.active = false;
                    },
                    changeimg: function(url){
                        var tgt = d.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild;
                        tgt.src = url;
                        ctl_d.imgurl = url;
                    },
                    changecode: function(code){
                        var tgt = d.firstChild.firstChild.firstChild.children[1].firstChild.children[1].firstChild;
                        tgt.children[1].innerText = code;
                        ctl_d.code = code;
                    },
                    changename: function(name){
                        var tgt = d.firstChild.firstChild.firstChild.children[1].firstChild.firstChild.firstChild;
                        tgt.innerText = name;
                        ctl_d.name = name;
                    },
                    showcfg: function(){
                        var d_cfg = document.createElement('div');
                        d_cfg.innerHTML = '<hr><form class="layui-form" action="" lay-filter="form-empty" style="padding-top: 15px;">    <div class="layui-form-item">        <div class="layui-inline">          <label class="layui-form-label">课程代码</label>          <div class="layui-input-inline">            <input type="text" name="course-code" lay-verify="required" autocomplete="off" class="layui-input">          </div>        </div>        <div class="layui-inline">          <label class="layui-form-label">课程名称</label>          <div class="layui-input-inline">            <input type="text" name="course-name" lay-verify="required" autocomplete="off" class="layui-input">          </div>        </div>    </div>    <div class="layui-form-item">        <div class="layui-inline">            <label class="layui-form-label">ACTIVE</label>            <div class="layui-input-block" style="min-width: 200px;">            <input lay-filter="switch-empty" type="checkbox" ' + (ctl_d.active?'checked=""':'') + ' name="active" lay-skin="switch" lay-text="ON|OFF">            </div>        </div>        <div class="layui-inline">            <label class="layui-form-label">添加封面</label>            <button type="button" class="layui-btn layui-btn-primary-violet" id="uploadAvatar-empty">                <i class="layui-icon layui-icon-upload"></i>上传图片            </button>        </div>    </div>        <div class="layui-form-item">    <div class="layui-input-block">      <button type="submit" class="layui-btn layui-btn-violet" lay-submit="" lay-filter="submit-empty">确定</button>      <button type="reset" class="layui-btn layui-btn-primary-violet layui-btn-disabled">重置</button>    </div>  </div></form>';
                        d.children[0].children[0].appendChild(d_cfg);

                        layui.form.val('form-empty', {
                            "course-code": ctl_d.code
                            ,"course-name": ctl_d.name
                        });

                        layui.form.render('checkbox', 'form-empty');
                        var switch_item = d_cfg.getElementsByClassName('layui-form-switch')[0];
                        if (switch_item.childElementCount == 1) {
                            switch_item.innerHTML += '<i></i>';
                        }

                        var tgt = d_cfg.children[1].children[0].children[0].children[1].children[0];
                        
                        tgt.oninput = function(){
                            ctl_d.changecode(d_cfg.children[1].children[0].children[0].children[1].children[0].value);
                        }

                        var tgt = d_cfg.children[1].children[0].children[1].children[1].children[0];

                        tgt.oninput = function(){
                            ctl_d.changename(d_cfg.children[1].children[0].children[1].children[1].children[0].value);
                        }

                        layui.form.on('switch(switch-empty)', function(data){
                            if (data.elem.checked)
                                ctl_d.activate();
                            else
                                ctl_d.deactivate();
                        });

                        layui.form.on('submit(submit-empty)', function(){
                            let metajs = {};
                            if (!ctl_d.imgurl) {
                                layer.alert("嗯...添加一个合适的封面如何？");
                                return false;
                            }
                            if (ctl_d.active) metajs.status = "activate";
                            metajs.code = ctl_d.code;
                            metajs.name = ctl_d.name;
                            let updated_content = JSON.stringify(metajs, null, 4);

                            let tgt = d_cfg.children[1].children[2].children[0];
                            let d_hint = document.createElement('div');
                            d_hint.style.display = 'inline';
                            d_hint.style.paddingLeft = '1em';
                            d_hint.innerHTML = '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i>';
                            tgt.children[0].classList.add('layui-btn-disabled');
                            tgt.appendChild(d_hint);

                            cardComponent.uploadFile({
                                path: "/contents/courses/" + ctl_d.code + "/meta.json",
                                content: window.btoa(unescape(encodeURIComponent(updated_content))),
                                message: 'Upload ' + ctl_d.code + ' course meta data',
                            }).done(function() {

                            cardComponent.uploadFile({
                                path: "/contents/courses/" + ctl_d.code + "/cover.jpg",
                                content: ctl_d.imgurl.replace(/data.+?;base64,/, ""),
                                message: 'Upload ' + ctl_d.code + ' cover',
                            }).done(function(){
                                d_hint.innerHTML = '<p style="color: green; display: inline;"><i class="layui-icon layui-icon-ok-circle"></i>添加成功！刷新以继续</p>';
                                setTimeout(function(){
                                    tgt.children[0].classList.remove('layui-btn-disabled');
                                    tgt.children[2].remove();
                                }, 3000);
                            });

                            });

                            return false;
                        });

                        layui.avatar.render({
                            elem: '#uploadAvatar-empty',
                            ratio: 501/286,
                            preview: 'square',
                            success: function (base64, size) {
                                ctl_d.changeimg(base64);
                            }
                        });

                        var tgt = d.firstChild.firstChild.firstChild.children[1].firstChild.children[1].children[1].firstChild;
                        tgt.onclick = ctl_d.hidecfg;
                    },
                    hidecfg: function() {
                        d.children[0].children[0].children[1].remove();

                        var tgt = d.firstChild.firstChild.firstChild.children[1].firstChild.children[1].children[1].firstChild;
                        tgt.onclick = ctl_d.showcfg;
                    }
                }

                d.firstChild.onclick = ctl_d.init;
            },

            loadDetails: function(element, course_code) {
                $.ajax({
                    url: proxy.parse(options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/courses/" + course_code + "/meta.json"),
                    type: "GET",
                    data: {
                        'ref': 'file-base'
                    },
                    headers: headers,
                    success: function (data) {
                        if (data) {
                            if (data && data.content) {
                                let string = decodeURIComponent(escape(window.atob(data.content.replace(/[\r\n]/g,""))));
                                var elem = JSON.parse(string);

                                var semester_strings = new Array();
                                for (idx in elem.semesters) {
                                    const e = elem.semesters[idx];
                                    semester_strings.push(e.season + ' ' + e.year);
                                }
                                
                                var d = document.createElement('div');
                                elem.cover = elem.cover || options.proxy + 'https://raw.githubusercontent.com/' + options.owner + '/' + options.repo + '/file-base/courses/' + course_code + '/cover.jpg';
                                elem.cover = proxy.parse(elem.cover);
                                d.classList.add("card-shadow");
                                d.setAttribute('course-code', elem.code);

                                var ctl_d = {
                                    active: false,
                                    init: function(){
                                        var cardHTML = '<div class="layui-card" style="border-radius: 10px; margin-bottom: 15px;"><div class="layui-card-body"><div class="layui-row"><div class="layui-col-md3" style="display: flex; justify-content: center;"><a href="courses?course_code='+ elem.code +'"><img class="shadow" src="'+ elem.cover +'"style="max-height:15em; max-width:100%"></a></div><div class="layui-col-md9"><div style="margin: 5px 1em;"><div style="font-family: Quicksand; font-weight: bold; text-align: left; font-size: 2em; min-height: 1em;"><a href="courses?course_code='+ elem.code +'">'+ elem.name +'</a></div><div class="layui-row layui-col-space5"><div class="layui-col-md8"><p class="layui-hide" style="padding-top: 1%; text-align: left; font-family: Quicksand; font-weight: bold; font-size: 1.2em; margin-bottom: 0.2em; color:#8FBC8F;">ACTIVATE</p><p style="padding-top: 14%; text-align: left; font-size: 1.2em; margin-bottom: 0.2em;">'+ elem.code +'</p><p style="text-align: left; font-size: 1.2em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">'+ semester_strings.join(', ') +'</p></div><div class="layui-col-md4" style="padding-top: 12%; text-align: center; min-width: 150px;"><a href="javascript:;" class="layui-btn layui-btn-sm layui-btn-primary-violet" title="设置" style="font-weight: normal; padding: 0 7px;"><i class="fa fa-cog icon-gear" aria-hidden="true"></i></a><a href="courses?course_code='+ elem.code +'" class="layui-btn layui-btn-lg layui-btn-violet" style="font-weight: normal;">查看课程</a></div></div></div></div></div></div></div>';
                                        d.innerHTML = cardHTML;
                                        var tgt = d.firstChild.firstChild.firstChild.children[1].firstChild.children[1].children[1].firstChild;
                                        tgt.onclick = ctl_d.showcfg;
                                    },
                                    activate: function(){
                                        d.classList.add("activate");
                                        d.firstChild.style["margin-bottom"] = '';
                                        // d.firstChild.style["padding-bottom"] = '15px';
                                        var tgt = d.firstChild.firstChild.firstChild.children[1].firstChild.children[1].firstChild;
                                        tgt.firstChild.classList.remove('layui-hide');
                                        tgt.children[1].style["padding-top"] = '7%';
                                        ctl_d.active = true;
                                    },
                                    deactivate: function(){
                                        d.classList.remove("activate");
                                        // d.firstChild.style["padding-bottom"] = '';
                                        d.firstChild.style["margin-bottom"] = '15px';
                                        var tgt = d.firstChild.firstChild.firstChild.children[1].firstChild.children[1].firstChild;
                                        tgt.firstChild.classList.add('layui-hide');
                                        tgt.children[1].style["padding-top"] = '14%';
                                        ctl_d.active = false;
                                    },
                                    changeimg: function(url){
                                        var tgt = d.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild;
                                        tgt.src = url;
                                        ctl_d.imgurl = url;
                                    },
                                    showcfg: function(){
                                        var d_cfg = document.createElement('div');
                                        d_cfg.innerHTML = '<hr><form class="layui-form" action="" lay-filter="form-'+ elem.code +'" style="padding-top: 15px;">    <div class="layui-form-item">        <div class="layui-inline">            <label class="layui-form-label">ACTIVE</label>            <div class="layui-input-block" style="min-width: 200px;">            <input lay-filter="switch-'+ elem.code +'" type="checkbox" ' + (ctl_d.active?'checked=""':'') + ' name="active" lay-skin="switch" lay-text="ON|OFF">            </div>        </div>        <div class="layui-inline">            <label class="layui-form-label">更换封面</label>            <button type="button" class="layui-btn layui-btn-primary-violet" id="uploadAvatar-'+ elem.code +'">                <i class="layui-icon layui-icon-upload"></i>上传图片            </button>        </div>    </div>        <div class="layui-form-item">    <div class="layui-input-block">      <button type="submit" class="layui-btn layui-btn-violet" lay-submit="" lay-filter="submit-'+ elem.code +'">修改</button>      <button type="reset" class="layui-btn layui-btn-primary-violet layui-btn-disabled">重置</button>    </div>  </div></form>';
                                        d.children[0].children[0].appendChild(d_cfg);

                                        layui.form.render('checkbox', 'form-'+elem.code);
                                        var switch_item = d_cfg.getElementsByClassName('layui-form-switch')[0];
                                        if (switch_item.childElementCount == 1) {
                                            switch_item.innerHTML += '<i></i>';
                                        }

                                        layui.form.on('switch(switch-'+ elem.code +')', function(data){
                                            if (data.elem.checked)
                                                ctl_d.activate();
                                            else
                                                ctl_d.deactivate();
                                        });

                                        layui.form.on('submit(submit-'+ elem.code +')', function(){
                                            
                                            let metajs = JSON.parse(string);
                                            if (ctl_d.active) metajs.status = "activate";
                                            else if (metajs.status) delete metajs.status;
                                            let updated_content = JSON.stringify(metajs, null, 4);

                                            let tgt = d_cfg.children[1].children[1].children[0];
                                            let d_hint = document.createElement('div');
                                            d_hint.style.display = 'inline';
                                            d_hint.style.paddingLeft = '1em';
                                            d_hint.innerHTML = '<i class="fa fa-refresh fa-spin fa-lg fa-fw"></i>';
                                            tgt.children[0].classList.add('layui-btn-disabled');
                                            tgt.appendChild(d_hint);

                                            if (ctl_d.imgurl) {
                                                /* Upload image. */
                                                cardComponent.loadContent({
                                                    path: "/contents/courses/" + elem.code + "/cover.jpg"
                                                }).done(function(old_cover){

                                                cardComponent.uploadFile({
                                                    path: "/contents/courses/" + elem.code + "/meta.json",
                                                    content: window.btoa(unescape(encodeURIComponent(updated_content))),
                                                    message: 'Update ' + elem.code + ' course meta data',
                                                    sha: data.sha,
                                                }).done(function() {

                                                cardComponent.uploadFile({
                                                    path: "/contents/courses/" + elem.code + "/cover.jpg",
                                                    content: ctl_d.imgurl.replace(/data.+?;base64,/, ""),
                                                    message: 'Update ' + elem.code + ' cover',
                                                    sha: old_cover.sha,
                                                }).done(function(){
                                                    d_hint.innerHTML = '<p style="color: green; display: inline;"><i class="layui-icon layui-icon-ok-circle"></i>修改成功！</p>';
                                                    setTimeout(function(){
                                                        tgt.children[0].classList.remove('layui-btn-disabled');
                                                        tgt.children[2].remove();
                                                    }, 3000);
                                                });

                                                })
                                                    
                                                })
                                            } else {
                                                $.when(
                                                    cardComponent.uploadFile({
                                                        path: "/contents/courses/" + elem.code + "/meta.json",
                                                        content: window.btoa(unescape(encodeURIComponent(updated_content))),
                                                        message: 'Upload ' + elem.code + ' course meta data',
                                                        sha: data.sha,
                                                    })
                                                ).done(function(){
                                                    d_hint.innerHTML = '<p style="color: green; display: inline;"><i class="layui-icon layui-icon-ok-circle"></i>修改成功！</p>';
                                                    setTimeout(function(){
                                                        tgt.children[0].classList.remove('layui-btn-disabled');
                                                        tgt.children[2].remove();
                                                    }, 3000);
                                                });
                                            }

                                            return false;
                                        });

                                        layui.avatar.render({
                                            elem: '#uploadAvatar-'+ elem.code,
                                            ratio: 501/286,
                                            preview: 'square',
                                            success: function (base64, size) {
                                                ctl_d.changeimg(base64);
                                            }
                                        });

                                        var tgt = d.firstChild.firstChild.firstChild.children[1].firstChild.children[1].children[1].firstChild;
                                        tgt.onclick = ctl_d.hidecfg;
                                    },
                                    hidecfg: function() {
                                        d.children[0].children[0].children[1].remove();

                                        var tgt = d.firstChild.firstChild.firstChild.children[1].firstChild.children[1].children[1].firstChild;
                                        tgt.onclick = ctl_d.showcfg;
                                    }
                                }

                                ctl_d.init();
                                if (elem.hasOwnProperty("status") && elem.status == "activate")
                                    ctl_d.activate();
                                
                                element.appendChild(d);

                            } else {
                                console.log('data error:', data);
                            }
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
                cardComponent.render_(container);
            }
        }

        return cardComponent;
    });
    exports('course_card', course_card);
});

