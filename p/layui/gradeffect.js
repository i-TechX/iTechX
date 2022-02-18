layui.use(['layer', 'form', 'element', 'laytpl', 'laydate', 'util', 'laypage'], function(){

    layui.$.getScript('https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js',function(){
        var clipboard = new ClipboardJS('.pwd-copy-btn', {
            target: function(trigger) {
                return trigger.parentElement.previousElementSibling.firstElementChild;
            }
        });
        clipboard.on('success', function(e) {
            target = e.trigger.parentElement.nextElementSibling;
            target.style.display = 'inline';
            setTimeout(() => {
                target.style.display = 'none';
            }, 3000);
        });
        clipboard.on('error', function(e) {
            target = e.trigger.parentElement.nextElementSibling.nextElementSibling;
            target.style.display = 'inline';
            setTimeout(() => {
                target.style.display = 'none';
            }, 3000);
        });
    });

    function answerParse(questionName, type, json){
        if (type === 'checkbox') {
            var answer = [];
            for (const key in json) {
                if (json.hasOwnProperty(key)) {
                    if (key.indexOf(questionName) != -1) {
                        answer.push( key.replace(questionName+'-', '') );
                    }
                }
            }
            return answer.join('');
        } else if (type === 'radio' || type === 'text-no-eval') {
            return json[questionName];
        } else if (type === 'text' || type === 'text-no-repetition' || type === 'text-include') {
            try{
                return eval(json[questionName]);
            } catch (err) {
                return json[questionName];
            }
        }
    }

    function scoreStore() {
        var total = 0
            ,cur = 0;
        for (const problem in answers) {
            if (answers.hasOwnProperty(problem)) {
                total += answers[problem][0];
                cur += form.scores[problem] ? form.scores[problem] : 0;
            }
        }
        key = [courseInfo.code, courseInfo.semester, courseInfo.category, courseInfo.title, 'curScore'].join('.').replace(/ /g,'');
        localStorage.setItem(key, cur);
        key = [courseInfo.code, courseInfo.semester, courseInfo.category, courseInfo.title, 'totalScore'].join('.').replace(/ /g,'');
        localStorage.setItem(key, total);
    }

    var layer = layui.layer
    ,form = layui.form
    ,element = layui.element
    ,laytpl = layui.laytpl
    ,laydate = layui.laydate
    ,$ = layui.$
    ,laypage = layui.laypage;

    var courseHeaderTpl = lay('#courseHeader')[0].innerHTML;
    lay('#courseHeader').html(layui.laytpl(courseHeaderTpl).render({}))
    .removeClass('layui-hide');

    var breadcrumbTpl = lay('#breadcrumb')[0].innerHTML;
    lay('#breadcrumb').html(layui.laytpl(breadcrumbTpl).render({}))
    .removeClass('layui-hide');

    var courseBenchTpl = lay('#courseBench')[0].innerHTML;
    lay('#courseBench').html(layui.laytpl(courseBenchTpl).render({
        "url": "https://www.coursebench.net/course/"+(courseInfo.hasOwnProperty("coursebench") ? courseInfo.coursebench : courseInfo.code)+"/"
    }))
    .removeClass('layui-hide');

    if (typeof answers != "undefined")
    for (const id in answers) {
        if (answers.hasOwnProperty(id)) {
            const totalScore = answers[id][0];
            $('#'+id)[0].innerHTML = '0/' + totalScore + ' point (graded)';
        }
    }

    var icons = {
        "book": '<i class="fa fa-book" aria-hidden="true"></i>'
        ,"video": '<i class="fa fa-film" aria-hidden="true"></i>'
        ,"question": '<i class="fa fa-pencil-square-o" aria-hidden="true"></i>'
        ,"passed": ' <i class="fa fa-check-circle" aria-hidden="true" style="color: green"></i>'
    };
    var i = 1;
    laypage.types = [];
    laypage.lastPage = 0;
    while ($('#page-'+i)[0]) {
        key = [courseInfo.code, courseInfo.semester, courseInfo.category, courseInfo.title, i-1].join('.').replace(/ /g,'');
        if (localStorage.getItem(key) === 'visited') {
            laypage.types.push([$('#page-'+i).attr('page-type'), 'passed']);
        } else {
            laypage.types.push([$('#page-'+i).attr('page-type')]);
        }
        i++;
    }
    
    var pageRender1 = function(curr){
        if (laypage.lastPage != 0)
        if (laypage.types[laypage.lastPage-1].indexOf('question')==-1 &&
            laypage.types[laypage.lastPage-1].indexOf('passed')==-1) {
            key = [courseInfo.code, courseInfo.semester, courseInfo.category, courseInfo.title, laypage.lastPage-1].join('.').replace(/ /g,'');
            localStorage.setItem(key, 'visited');
            laypage.types[laypage.lastPage-1].push('passed');
        }
        laypage.render({
            elem: 'content'
            ,groups: 100
            ,prev: '<i class="fa fa-chevron-left" aria-hidden="true">&nbsp;&nbsp;</i>上一个'
            ,next: '下一个&nbsp;&nbsp;<i class="fa fa-chevron-right" aria-hidden="true"></i>'
            ,limit: 1
            ,theme: '#9364f0'
            ,curr: curr
            ,hash: 'page' //自定义hash值
            ,count: laypage.types.length
            ,layout: ['prev', 'page', 'next', 'refresh']
            ,types: function(){
                var list = [];
                laypage.types.forEach(elemList => {
                    var str = '';
                    elemList.forEach(elem => {
                        str += icons[elem];
                    });
                    list.push(str);
                });
                return list;
            }
            ,jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。

                var i = 1;
                while ($('#page-'+i)[0]) {
                    if (!$('#page-'+i).hasClass("layui-hide"))
                        $('#page-'+i).addClass("layui-hide");
                    i++;
                }
                $('#page-'+obj.curr).removeClass("layui-hide");

                //首次不执行
                laypage.lastPage = obj.curr;
                if(!first){
                    pageRender2(obj.curr);
                    MathJax.Hub.Queue(["Reprocess",MathJax.Hub]);
                }
            }
        });
    }

    var pageRender2 = function(curr){
        if (laypage.lastPage != 0)
        if (laypage.types[laypage.lastPage-1].indexOf('question')==-1 &&
            laypage.types[laypage.lastPage-1].indexOf('passed')==-1) {
            key = [courseInfo.code, courseInfo.semester, courseInfo.category, courseInfo.title, laypage.lastPage-1].join('.').replace(/ /g,'');
            localStorage.setItem(key, 'visited');
            laypage.types[laypage.lastPage-1].push('passed');
        }
        laypage.render({
            elem: 'successor'
            ,groups: 100
            ,prev: '<i class="fa fa-chevron-left" aria-hidden="true">&nbsp;&nbsp;</i>上一个'
            ,next: '下一个&nbsp;&nbsp;<i class="fa fa-chevron-right" aria-hidden="true"></i>'
            ,limit: 1
            ,theme: '#9364f0'
            ,curr: curr
            ,hash: 'page' //自定义hash值
            ,count: laypage.types.length
            ,layout: ['prev', 'next']
            ,types: function(){
                var list = [];
                laypage.types.forEach(elemList => {
                    var str = '';
                    elemList.forEach(elem => {
                        str += icons[elem];
                    });
                    list.push(str);
                });
                return list;
            }
            ,jump: function(obj, first){
                //首次不执行
                if(!first){
                    pageRender1(obj.curr);
                    MathJax.Hub.Queue(["Reprocess",MathJax.Hub]);
                    $("html,body").animate({scrollTop:"0px"},500);
                }
                obj.lastPage = obj.curr;
            }
        });
    }

    pageRender1(location.hash.replace('#!page=', ''));
    pageRender2(location.hash.replace('#!page=', ''));
            
    form.scores = {};
    form.on('checkbox', function(data){
        var t = data.elem.parentElement.children;
        for (const key in t) {
            if (t.hasOwnProperty(key)) {
                const element = t[key];
                $(element.nextElementSibling).removeClass("layui-form-true");
                $(element.nextElementSibling).removeClass("layui-form-false");
            }
        }
    });
    form.on('radio', function(data){
        var t = data.elem.parentElement.children;
        for (const key in t) {
            if (t.hasOwnProperty(key)) {
                const element = t[key];
                $(element.nextElementSibling).removeClass("layui-form-true");
                $(element.nextElementSibling).removeClass("layui-form-false");
            }
        }
    });
    form.on('submit', update = function(data){
        var problem = $(data.form).attr("lay-filter");
        var myScore = 0;
        for (const index in data.form.firstElementChild.children) {
            if (data.form.firstElementChild.children.hasOwnProperty(index)) {
                const questionElement = data.form.firstElementChild.children[index];
                if ($(questionElement).hasClass('question')) {
                    var questionName = questionElement.classList[1];
                    var type = questionElement.classList[2].replace(/q-/, '');

                    for (const key in questionElement.children) {
                        if (questionElement.children.hasOwnProperty(key)) {
                            const element = questionElement.children[key];
                            $(element).removeClass("layui-form-input-true");
                            $(element).removeClass("layui-form-input-false");
                            $(element.nextElementSibling).removeClass("layui-form-true");
                            $(element.nextElementSibling).removeClass("layui-form-false");
                        }
                    }

                    var myAnswer = answerParse(questionName, type, data.field);
                    var score = !answers[problem][1][questionName][1][myAnswer] ? 0 : answers[problem][1][questionName][1][myAnswer];
                    if (type === 'text-include') {
                        for (const key in answers[problem][1][questionName][1]) {
                            if (answers[problem][1][questionName][1].hasOwnProperty(key)) {
                                const cur_value = answers[problem][1][questionName][1][key];
                                if (myAnswer && myAnswer.toString().indexOf(key)!=-1 && cur_value>score) {
                                    score = cur_value;
                                }
                            }
                        }                        
                    }
                    var totalScore = answers[problem][1][questionName][0];
                    var correct = 0;
                    if (score === totalScore) {
                        correct = 1;
                    } else if (score > 0) {
                        correct = -1;
                    }

                    if (type === 'text-no-repetition'){
                        for (const q in data.field) {
                            if (data.field.hasOwnProperty(q) && q != questionName) {
                                const a = answerParse(q, 'text', data.field);
                                if (a == myAnswer) {
                                    score = 0;
                                    correct = -2;
                                }
                            }
                        }
                    }
                    myScore += score;

                    if (type === 'checkbox') {
                        for (const key in data.field) {
                            if (data.field.hasOwnProperty(key) && key.indexOf(questionName)!=-1) {
                                if (correct == 1) {
                                    $(questionElement.children[key].nextElementSibling).addClass("layui-form-true");
                                } else {
                                    $(questionElement.children[key].nextElementSibling).addClass("layui-form-false");
                                }
                            }
                        }
                    } else if (type === 'radio') {
                        var key = data.field[questionName];
                        for (const elem in questionElement.children) {
                            if (questionElement.children.hasOwnProperty(elem)) {
                                const element = questionElement.children[elem];
                                if (element.value === key) {
                                    if (correct == 1) {
                                        $(element.nextElementSibling).addClass("layui-form-true");
                                    } else {
                                        $(element.nextElementSibling).addClass("layui-form-false");
                                    }
                                }
                            }
                        }
                    } else if (type === 'text' || type === 'text-no-repetition' || type === 'text-no-eval' || type === 'text-include') {
                        for (const elem in questionElement.children) {
                            if (questionElement.children.hasOwnProperty(elem)) {
                                const element = questionElement.children[elem];
                                if (element.name === questionName) {
                                    if (correct == 1) {
                                        $(element).addClass("layui-form-input-true");
                                    } else {
                                        $(element).addClass("layui-form-input-false");
                                    }
                                }
                            }
                        }
                    }

                    var msg = '';
                    if (correct == 1) {
                        msg = '<i class="fa fa-check" aria-hidden="true" style="color: green;" label="这个回答是正确的。" onmouseover="show_tips(this)" onmouseout="close_tips()"></i>';
                    } else if (correct == 0) {
                        msg = '<i class="fa fa-times" aria-hidden="true" style="color: rgb(190, 0, 0);" label="这个回答是错误的。" onmouseover="show_tips(this)" onmouseout="close_tips()"></i>';
                    } else if (correct == -1){
                        msg = '<i class="fa fa-circle-o" aria-hidden="true" style="color: green;" label="这个回答不完全正确。" onmouseover="show_tips(this)" onmouseout="close_tips()"></i>';
                    } else if (correct == -2){
                        msg = '<i class="fa fa-times" aria-hidden="true" style="color: rgb(190, 0, 0);" label="这个回答是错误的。" onmouseover="show_tips(this)" onmouseout="close_tips()"><div class="layui-form-mid layui-word-aux" style="font-size: small;">该问题被设置为答案不可重复。请修改答案后重试。</div></i>';
                    }
                    for (const elem in questionElement.children) {
                        if (questionElement.children.hasOwnProperty(elem)) {
                            const element = questionElement.children[elem];
                            if ($(element).hasClass('tick-label')) {
                                element.innerHTML = msg;
                                break;
                            }
                        }
                    }
                    
                }
            }
        }

        var totalScore = answers[problem][0];
        myScore = myScore > totalScore ? totalScore : myScore;
        $('#'+problem)[0].innerText = myScore + '/' + totalScore + ' point (graded)';

        if (myScore == totalScore) {
            for (const elem in data.form.children[0].children) {
                if (data.form.children[0].children.hasOwnProperty(elem)) {
                    const element = data.form.children[0].children[elem];
                    if ($(element).hasClass('q-explanation')) {
                        $(element).removeClass('layui-hide');
                    }
                }
            }
        }

        form.scores[problem] ? form.scores[problem] < myScore ? form.scores[problem] = myScore : 0 : form.scores[problem] = myScore;
        var curPage = Number($(data.form.parentElement.parentElement).attr('id').replace('page-','')),
            pagePassed = true;

        for (const elem in $('#page-'+curPage).children()) {
            if ($('#page-'+curPage).children().hasOwnProperty(elem)) {
                const child = $($('#page-'+curPage).children()[elem]);
                if (child.hasClass("problem")) {
                    for (const probElem in child.children()) {
                        if (child.children().hasOwnProperty(probElem)) {
                            if ($(child.children()[probElem]).hasClass("problem-grade")){
                                problemID = child.children()[probElem].id;
                                curScore = form.scores[problemID] ? form.scores[problemID] : 0;
                                totalScore = answers[problemID][0];
                                curScore == totalScore ? 0 : pagePassed = false;
                                break;
                            }
                        }
                    }
                }
            }
        }

        if (pagePassed && laypage.types[curPage-1].indexOf('passed')==-1) {
            laypage.types[curPage-1].push('passed');
            document.getElementsByClassName('layui-laypage-refresh')[0].click();
        }

        var key = [courseInfo.code, courseInfo.semester, courseInfo.category, courseInfo.title, problem].join('.').replace(/ /g,'');
        localStorage.setItem(key, JSON.stringify(data.field));
        scoreStore();

        return false;
    });

    if (typeof answers != "undefined")
    for (const problem in answers) {
        if (answers.hasOwnProperty(problem)) {
            var key = [courseInfo.code, courseInfo.semester, courseInfo.category, courseInfo.title, problem].join('.').replace(/ /g,'');
            if (localStorage.hasOwnProperty(key)) {
                var data = {"field": $.parseJSON(localStorage.getItem(key))};
                for (const elem in document.getElementsByTagName("form")) {
                    if (document.getElementsByTagName("form").hasOwnProperty(elem)) {
                        const formElem = document.getElementsByTagName("form")[elem];
                        if ($(formElem).attr('lay-filter') == problem) {
                            data.form = formElem;
                        }
                    }
                }
                form.val(problem, data.field);
                update(data);
            }
        }
    }

    layui.$.getScript("https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML", function() {
        MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\\(','\\\)']], displayMath: [['$$','$$'], ["\\\[","\\\]"]]}});
        var math = document.getElementsByClassName("main-content")[0];
        MathJax.Hub.Queue(["Typeset",MathJax.Hub,math]);
    });
});