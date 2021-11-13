layui.define(['jquery', 'form'], function(exports){

    var $ = layui.jquery,
        form = layui.form;

    var select = (function(options){
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

        var selectComponent = {

            config: function(options_) {
                options = assign(options, options_);
            },

            render_: function(container){
                node = window.document.getElementById(container);
                this.loadFolders(node);
            },

            loadCourses: function() {
                $.ajax({
                    url: options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/courses",
                    type: "GET",
                    data: {
                        'ref': 'file-base'
                    },
                    headers: {
                        'Accept': 'application/json',
                    },
                    success: function (data) {
                        if (data) {
                            var courses = new Array();
                            for (var idx in data) {
                                var file = data[idx];
                                if (file.type == "dir") {
                                    courses.push(file.name);
                                }
                            }
                            
                            var e = $("[lay-filter="+options.course_code+"]")[0];
                            var s = '<option value=""></option>';
                            for (idx in courses) {
                                var course = courses[idx];
                                s += '<option value="' + course + '">' + course + '</option>';
                            }
                            e.innerHTML = s;
                            form.render('select');

                            form.on('select(' + options.course_code + ')', function(data){
                                selectComponent.loadIds(data.value);
                            });
                        } else {
                            console.log('data error:', data);
                        }
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            },

            loadIds: function(course_code) {
                $.ajax({
                    url: options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/courses/" + course_code + "/meta.json",
                    type: "GET",
                    data: {
                        'ref': 'file-base'
                    },
                    headers: {
                        'Accept': 'application/json',
                    },
                    success: function (data) {
                        if (data) {
                            if (data && data.content) {
                                var string = decodeURIComponent(escape(window.atob(data.content.replace(/[\r\n]/g,""))));
                                var elem = JSON.parse(string);

                                var s = '<option value=""></option>'
                                for (idx in elem.semesters) {
                                    const e = elem.semesters[idx];
                                    s += '<option value="' + e.course_id + '_' + e.season + '_' + e.year + '">' + e.course_id + ', ' + e.season + ' ' + e.year + '</option>';
                                }
                                
                                var e = $("[lay-filter="+options.course_id+"]")[0];
                                e.innerHTML = s;
                                form.render('select');
                                
                                form.on('select(' + options.course_id + ')', function(data){
                                    selectComponent.loadFolders(course_code, data.value);
                                });
                            } else {
                                console.log('data error:', data);
                            }
                        } else {
                            console.log('data error:', data);
                        }
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            },

            loadFolders: function(course_code, semester) {
                $.ajax({
                    url: options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/contents/courses/" + course_code + "/" + semester,
                    type: "GET",
                    data: {
                        'ref': 'file-base'
                    },
                    headers: {
                        'Accept': 'application/json',
                    },
                    success: function (data) {
                        if (data) {
                            var folders = new Array();
                            for (var idx in data) {
                                var file = data[idx];
                                if (file.type == "dir") {
                                    folders.push(file.name);
                                }
                            }
                            
                            var e = $("[lay-filter="+options.folder+"]")[0];
                            var s = '<option value=""></option>';
                            for (idx in folders) {
                                var folder = folders[idx];
                                s += '<option value="' + folder + '">' + folder + '</option>';
                            }
                            e.innerHTML = s;
                            form.render('select');
                        } else {
                            console.log('data error:', data);
                        }
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            },

            upload: function(field) {
                selectComponent.getUserInfo(function(){
                    selectComponent.getUserRepo(function(){
                        const user = selectComponent.userInfo.login;
                        var url = options.baseURL + "/repos/" + user + "/" + options.repo + "/contents/courses/" + field[options.course_code] + "/" + field[options.course_id] + "/" + field[options.folder] + "/" + field["file_name"];
                        var upload = options.upload;
                        upload.config.url = url;
                        var allDone = upload.config.done;
                        upload.config.done = function(res){
                            console.log(res);
                            
                            var e = $("[lay-filter='hint']")[0];
                            e.innerText = "正在提交请求...";

                            selectComponent.makePullRequest(function(){
                                allDone(res);
                            });
                        }
                        
                        var e = $("[lay-filter='hint']")[0];
                        e.innerText = "正在上传文件...";

                        upload.upload();
                    }, function(err){
                        if (selectComponent.forked == undefined && err.responseJSON.message == "Not Found") {
                            var e = $("[lay-filter='hint']")[0];
                            e.innerText = "正在创建仓库副本...";
                            selectComponent.forkUserRepo(function(){
                                selectComponent.forked = true;
                                setTimeout(function(){
                                    selectComponent.upload(field);
                                }, 2000);
                            });
                        } else if (selectComponent.forked) {
                            setTimeout(function(){
                                selectComponent.upload(field);
                            }, 2000);
                        }
                    });
                });
            },

            getUserInfo: function (callback) {
                accessToken = options.accessToken || window.localStorage.getItem('GT_ACCESS_TOKEN');
                if (!accessToken) return;
                $.ajax({
                    url: options.baseURL + "/user",
                    type: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'token ' + accessToken,
                    },
                    success: function (data) {
                        selectComponent.userInfo = data;
                        if (callback) callback();
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            },

            getUserRepo: function (callback, error) {
                const user = selectComponent.userInfo.login;
                const accessToken = options.accessToken || window.localStorage.getItem('GT_ACCESS_TOKEN');
                $.ajax({
                    url: options.baseURL + "/repos/" + user + "/" + options.repo,
                    type: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'token ' + accessToken,
                    },
                    success: function (data) {
                        console.log(data);
                        if (callback) callback();
                    },
                    error: function(err) {
                        console.log(err);
                        if (error) error(err);
                    }
                })
            },

            forkUserRepo: function (callback) {
                const user = selectComponent.userInfo.login;
                const accessToken = options.accessToken || window.localStorage.getItem('GT_ACCESS_TOKEN');
                $.ajax({
                    url: options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/forks",
                    type: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'token ' + accessToken,
                    },
                    success: function (data) {
                        console.log(data);
                        if (callback) callback();
                    },
                    error: function(err) {
                        console.log(err);
                    }
                })
            },

            makePullRequest: function (callback) {
                const user = selectComponent.userInfo.login;
                const accessToken = options.accessToken || window.localStorage.getItem('GT_ACCESS_TOKEN');
                $.ajax({
                    url: options.baseURL + "/repos/" + options.owner + "/" + options.repo + "/pulls",
                    type: "POST",
                    data: JSON.stringify({
                        "title": "Add new file",
                        "head" : user + ":" + "file-base",
                        "base" : "file-base"
                    }),
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'token ' + accessToken,
                    },
                    success: function (data) {
                        console.log(data);
                        if (callback) callback();
                    },
                    error: function(err) {
                        console.log(err);
                        if (error) error(err);
                    }
                })
            },

            render: function(container){
                selectComponent.render_(container);
            }
        }

        return selectComponent;
    });
    exports('select', select);
});

