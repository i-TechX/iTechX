layui.define(['jquery', 'element', 'layer', 'proxy'], function(exports){

    var $ = layui.jquery,
        element = layui.element,
        layer = layui.layer,
        proxy = layui.proxy({});

    var nav = (function(options){
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
            proxy: 'https://cors-anywhere-36o.pages.dev?https://github.com/login/oauth/access_token',
            baseURL: 'https://api.github.com',
            page: 'none',
        }, options);

        var navComponent = {
            construct: function(callback) {
                const query = queryParse();
                if (query.code) {
                    const code = query.code
                    delete query.code
                    const replacedUrl = `${window.location.origin}${window.location.pathname}${(queryStringify(query) == "") ? "" : "?" + queryStringify(query)}${window.location.hash}`
                    history.replaceState(null, null, replacedUrl)
                    options = assign(options, {
                        url: replacedUrl,
                        id: replacedUrl
                    })

                    $.ajax({
                        url: options.proxy,
                        type: "POST",
                        data: {
                            'code': code,
                            'client_id': options.clientID,
                            'client_secret': options.clientSecret
                        },
                        headers: {
                            'Accept': 'application/json',
                        },
                        success: function (data) {
                            console.log(data);
                            if (data && data.access_token) {
                                window.localStorage.setItem('GT_ACCESS_TOKEN', data.access_token);
                            } else {
                                // no access_token
                                console.log('data error:', data)
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
                        navComponent.userInfo = data;
                        if (callback) callback();
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            },

            getCourseName: function(callback) {
                const query = queryParse();
                var accessToken = options.accessToken || window.localStorage.getItem('GT_ACCESS_TOKEN');
                var headers = {
                    'Accept': 'application/json',
                }
                if (accessToken) {
                    headers['Authorization'] = 'token ' + accessToken;
                }
                if (query.course_code) {
                    $.ajax({
                        url: proxy.parse(options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/courses/" + query.course_code + "/meta.json"),
                        type: "GET",
                        data: {
                            'ref': 'file-base'
                        },
                        headers: headers,
                        success: function (data) {
                            if (data && data.content) {
                                var string = window.atob(data.content.replace(/[\r\n]/g,""));
                                var content = JSON.parse(string);
                                navComponent.course_code = query.course_code;
                                navComponent.course_name = content.name;
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

            config: function(options_) {
                options = assign(options, options_);
            },

            getLoginLink: function() {
                const githubOauthUrl = 'https://github.com/login/oauth/authorize';
                const { clientID } = options;
                const query = {
                    client_id: clientID,
                    redirect_uri: window.location.href,
                    scope: 'public_repo'
                };
                return `${githubOauthUrl}?${queryStringify(query)}`;
            },

            loadPostHog: function() {
                !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
                
                const randomString=[Math.random().toString(36).substring(2,12),Math.random().toString(36).substring(2,12),Math.random().toString(36).substring(2,12)].join("-"),usr_id=window.localStorage.getItem("PH_USR_ID")||randomString;window.localStorage.setItem("PH_USR_ID",usr_id),posthog.init("phc_HJRKBO0WTQG2utZ8KtUWlkLzDJcJNNVpOOO6WOcDJsI",{api_host:"https://app.posthog.com",loaded:function(t){t.identify(usr_id,navComponent.userInfo||{})},persistence: "localStorage"});
            },

            render_: function(container){
                node = window.document.getElementById(container);
                page = options.page;
                tabs = "";

                if (page == "course" && this.course_code && this.course_name) {
                    tabs += '                                                                                                                                       \
                        <li style="font-family:sans-serif; position:relative;display:inline-block;*display:inline;*zoom:1;vertical-align:middle;line-height:60px">   \
                            <div>                                                                                                                             \
                                <span style="color:#fff;">' + this.course_code + '</span>                                                                     \
                                <span style="color:rgba(255,255,255,.7);">' + this.course_name + '</span>                                                   \
                            </div>                                                                                                                                   \
                        </li>                                                                                                                                        \
                    '
                }

                if (page == "dashboard") {
                    tabs += '<li class="layui-nav-item layui-layout-right layui-this" style="position: relative; margin-right: 36em;"><a href="dashboard">课程面板</a></li>';
                } else {
                    tabs += '<li class="layui-nav-item layui-layout-right" style="position: relative; margin-right: 36em;"><a href="dashboard">课程面板</a></li>';
                }

                if (page == "help") {
                    tabs += '<li class="layui-nav-item layui-layout-right layui-this" style="position: relative; margin-right: 30em;"><a href="help">帮助</a></li>';
                } else {
                    tabs += '<li class="layui-nav-item layui-layout-right" style="position: relative; margin-right: 30em;"><a href="help">帮助</a></li>';
                }

                if (page == "settings") {
                    tabs += '<li class="layui-nav-item layui-layout-right layui-this" style="position: relative; margin-right: 24em;"><a href="settings">设置</a></li>';
                } else {
                    tabs += '<li class="layui-nav-item layui-layout-right" style="position: relative; margin-right: 24em;"><a href="settings">设置</a></li>';
                }

                tabs += '<li class="layui-nav-item layui-layout-right" style="position: relative; margin-right: 16em;"><a href="https://i-techx.github.io/dashboard">返回旧版</a></li>';

                tabs += '<li class="layui-nav-item layui-layout-right" style="position: relative; margin-right: 10em;"><a href="https://github.com/i-TechX/iTechX">Github</a></li>';

                if (this.userInfo) {
                    tabs += '<li class="layui-nav-item layui-layout-right" style="position: relative; margin-right: 2em;">                \
                                                                                                        \
                        <a href="javascript:;"><img src="'+this.userInfo.avatar_url+'" class="layui-nav-img"></a>                  \
                        <dl class="layui-nav-child" style="left:auto; right:0; text-align:center;">                                                    \
                            <dd><a href="'+this.userInfo.html_url+'">'+this.userInfo.login+'</a></dd>                                    \
                            <dd><a href="playground">进入个人空间<span class="layui-badge-dot"></span></a></dd>\
                            <dd><a href="https://github.com/'+options.owner+'/'+options.repo+'/discussions/">有话要说</a></dd>\
                            <dd><a href="javascript:window.localStorage.removeItem(\'GT_ACCESS_TOKEN\');window.location.reload();">退出</a></dd>                                    \
                        </dl>                                                                           \
                    </li>'
                } else {
                    tabs += '<li class="layui-nav-item layui-layout-right" style="position: relative; margin-right: 2em;">                \
                        <a href="'+this.getLoginLink()+'">                                                                                \
                            <img src="layui/images/github.svg" class="layui-nav-img">登录</a>                                                      \
                    </li>'
                }

                node.innerHTML = '<div class="layui-header">                                                                                                                        \
                    <ul class="layui-nav" lay-filter="">                                                                                                                            \
                        <a class="logo" href="index">                                                                                                                                    \
                            <img src="layui/images/logo/logo-nav.svg" height="50px" style="position: relative; bottom: -5px; float: left; margin-right: 2%;" alt="iTechX">      \
                        </a>                                                                                                                                                        \
                        ' + tabs + ' \
                    </ul>                                                                                                                                                           \
                </div>';
                element.render('nav');
            },

            render: function(container, callback){
                navComponent.render_(container);
                navComponent.construct(function(){
                    navComponent.getUserInfo(function(){
                        navComponent.getCourseName(function(){
                            navComponent.render_(container);
                            if (callback) callback();
                        });
                        navComponent.loadPostHog();
                    });
                });
            }
        }

        return navComponent;
    });
    exports('nav', nav);
});


