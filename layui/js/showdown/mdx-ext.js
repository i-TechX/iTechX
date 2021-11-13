var mdxext = function () {
    
    var _counter = 0;
    var myext = {
      type: 'lang',
      filter: function (text, converter) {
        var convert = function(text) {
            ++_counter;
            text = _counter <= 1 ? converter.makeHtml(text) : text;
            --_counter;
            return text;
        };

        var parser = {
            _probCnt: 0,
            parse: function(s){
                if (_counter > 0) return s;
                // read in the test case and remove comments
                test = {};
                var main_document = [];
                vars = {};
                raw_lines = s.split('\n');
                test['__raw_lines__'] = raw_lines;
                test['path'] = self.path;
                test['pages'] = [];
                lines = raw_lines;
                new_lines = [];
                var i = 0;
                // read a property in each loop cycle
                while(i < lines.length) {
                    // skip blank lines
                    if (/^\s*$/.test(lines[i])) {
                        i += 1;
                        continue;
                    }
                    // Find title
                    m = /^#\s*([^#]*?)\s*$/.exec(lines[i]);
                    if (m) {
                        main_document.push('<h1 style=\"font-family: Quicksand; font-weight: bold; text-align: left;\">');
                        main_document.push(m[1]);
                        main_document.push('</h1><hr>');
                        i += 1;
                        continue;
                    }
                    // Find page number
                    m = /^##\s*[Pp][Aa][Gg][Ee]\s*(\d*?)\s*\(([^()]*)\)\s*$/.exec(lines[i]);
                    if (m) {
                        test['pages'].push([m[1], m[2], i]);
                        i += 1;
                        continue;
                    }
                    // Find vars
                    if (/^\s*---\s*$/.test(lines[i])) {
                        i += 1;
                        break;
                    }
                    // meta data
                    if (/^\s*«««\s*$/.test(lines[i])) {
                        while(!/^\s*»»»\s*$/.test(lines[i]) && i < lines.length) {
                            main_document.push(lines[i]);
                            i += 1;
                        }
                        main_document.push(lines[i]);
                        i += 1;
                        continue;
                    }
                    i += 1;
                }
    
                new_lines = lines.slice(0, i-1);
                
                // Find vars
                while(i < lines.length) {
                    i += 1;
                    m = /^([^"]*?):\s*"([^"]*)"\s*$/.exec(lines[i]);
                    if (m) {
                        vars[m[1]] = m[2];
                        continue;
                    }
                }
                lines = new_lines;
                
                // deal with pages
                for (var i=0; i<test['pages'].length; i++) {
    
                    // Wirte main_document
                    main_document.push('<div class=\"layui-hide\" id=\"page-' + test['pages'][i][0] + '\" page-type=\"' + test['pages'][i][1] + '\">');
                
                    start = test['pages'][i][2];
                    if (i+1 < test['pages'].length)
                        end = test['pages'][i+1][2];
                    else 
                        end = lines.length;
                    
                    page_lines = lines.slice(start, end);
                    res = parser.parsePage(page_lines);
    
                    for (var j = 0; j<res.length; j++) {
                        start = res[j][1];
                        end = j+1 < res.length ? res[j+1][1] : page_lines.length;
                        part_lines = page_lines.slice(start+1, end);
                        content_type = res[j][0].trim().toLowerCase();
                        if (content_type == 'table') {
                            main_document.push(parser.parseTable(part_lines));
                        } else if (content_type.includes('table')) {
                            main_document.push(parser.parseTable(part_lines, content_type.split('-')[1].trim()));
                        } else if (content_type == 'video') {
                            main_document.push(parser.parseVideo(part_lines));
                        } else if (content_type == 'reading') {
                            main_document.push(parser.parseReading(part_lines));
                        } else if (content_type.includes('problem')) {
                            main_document.push(parser.parseProblem(part_lines, content_type.split('-')[1].trim()));
                        } else {
                            throw TypeError(content_type + ' is not supported.');
                        }
                    }
                    main_document.push('</div>');
                }
    
                return main_document.join('\n');
    
            },
    
            parsePage: function(lines) {
                var page = [];
                var i = 0;
                while (i < lines.length) {
                    // skip blank lines
                    if (/^\s*$/.test(lines[i])) {
                        i += 1;
                        continue;
                    }
                    // partition
                    m = /^@\s*(.*)\s*$/.exec(lines[i]);
                    if (m) {
                        page.push([m[1], i]);
                        i += 1;
                        continue;
                    }
                    i += 1;
                }
                return page;
            },
    
            parseTable: function(raw_lines, margin) {
                margin = margin || "10%"
                header = '<div class=\"reading-content\"><div class=\"layui-form\" style=\"margin: 0 ' + margin + ';\">';
                tail = '</div></div>';

                html_code = header + convert(raw_lines.join('')) + tail;
                return html_code;
            },

            parseVideo: function(raw_lines) {
                pwd_template = '<div class="layui-form layui-form-pane" style="font-family: Quicksand; margin: 1.5em; width: 100%; padding-left:1em;"><div class="layui-form-item"><label class="layui-form-label" style="display: block; opacity: inherit; position: relative; width:fit-content;"><b>Password</b> 密码</label><div class="layui-input-inline"><input readonly type="text" class="layui-input" style="height: 38px;" value="{}"></div><div class="layui-btn-group"><button type="button" class="layui-btn layui-btn-violet pwd-copy-btn"><i class="fa fa-copy"></i> 复制</button></div><div style="display: none; padding-left: 10px; color:green;"><i class="fa fa-check-circle"></i> 复制成功！</div><div style="display: none; padding-left: 10px; color:rgb(190, 0, 0);"><i class="fa fa-times-circle"></i> 复制失败，请重试。</div></div></div>';
                lines = [];
                pwd = null;
                for (var i=0; i<raw_lines.length; i++) {
                    // skip blank lines
                    if (/^\s*$/.test(raw_lines[i]))
                        continue;
                    // parse password
                    m = /^([^"]*?):\s*"([^"]*)"\s*$/.exec(raw_lines[i]);
                    if (m && ['passwords', 'password', 'pwd'].includes(m[1].trim().toLowerCase())) {
                        pwd = m[2];
                        continue;
                    }
                    lines.push(line);
                }
                if (pwd) {
                    document = [pwd_template.replace('{}',pwd), '<center>'].concat(lines, ['</center>']);
                } else {
                    document = ['<center>'].concat(lines, ['</center>']);
                }
                html_code = document.join('');
                return html_code;
            },

            parseReading: function(raw_lines) {
                return '<div class="reading-content" style="margin: 1em; line-height: 1.4em;">' + convert(raw_lines.join('\n')) + "</div>";
            },

            parseProblem: function(raw_lines, problem_type) {
                properties = {};

                var i = 0;
                // read a property in each loop cycle
                while(i < raw_lines.length) {
                    // skip blank lines
                    if (raw_lines[i].match(/^\s*$/)) {
                        i += 1;
                        continue;
                    }
                    m = /^([^"]*?):\s*"([^"]*)"\s*$/.exec(raw_lines[i])
                    if (m) {
                        properties[m[1].trim().toLowerCase()] = m[2];
                        i += 1;
                        continue;
                    }
                    m = /^([^"]*?):\s*"""\s*$/.exec(raw_lines[i])
                    if (m) {
                        msg = [];
                        i += 1;
                        while(!raw_lines[i].match(/\s*"""\s*/)) {
                            msg.push(raw_lines[i]);
                            i += 1;
                        }
                        properties[m[1].trim().toLowerCase()] = msg;
                        i += 1;
                        continue;
                    }
                    throw Error('Problem parsing error - syntex not matched');
                }
                question_id = 'Question' + (++this._probCnt).toString();
                explanation_template = '<blockquote class="layui-elem-quote q-explanation layui-hide" style="margin: 2em; margin-bottom: 1em;">\n<p><b>Explanation</b></p>\n<p>{}<br></p>\n</blockquote>';
                whole_template = '<div class="problem">\n<hr>\n<div class="problem-title">{0mAGiccOde}</div>\n<div class="problem-grade" id="{2mAGiccOde}">?/? point (graded)</div>\n<div class="problem-content">{1mAGiccOde}</div>\n<form class="layui-form" action="" lay-filter="{2mAGiccOde}">\n    <div class="layui-form-item">\n        <div class="question q1 q-{5mAGiccOde}" answer="{6mAGiccOde}">{3mAGiccOde}<p class="tick-label"></p>\n        </div>{4mAGiccOde}\n        <button class="layui-btn layui-btn-lg layui-btn-violet" lay-submit>提交</button>\n    </div>\n</form>\n</div>';
                if (problem_type == 'radio') {
                    choices_template = '<input type="radio" name="q1" value="{0}" title="{1}">';
                } else if (problem_type == 'checkbox') {
                    choices_template = '<input type="checkbox" name="q1-{0}" title="{1}">';
                } else if (problem_type == 'text') {
                    whole_template = '<div class="problem">\n<hr>\n<div class="problem-title">{0mAGiccOde}</div>\n<div class="problem-grade" id="{2mAGiccOde}">?/? point (graded)</div>\n<div class="problem-content">{1mAGiccOde}</div>\n<form class="layui-form" action="" lay-filter="{2mAGiccOde}">\n    <div class="layui-form-item">\n        <div class="question q1 q-{5mAGiccOde}" answer="{6mAGiccOde}">{3mAGiccOde}<p class="tick-label" style="display: inline;"></p>\n        </div>{4mAGiccOde}\n        <button class="layui-btn layui-btn-lg layui-btn-violet" lay-submit>提交</button>\n    </div>\n</form>\n</div>';
                    choices_template = '<input type="text" name="q1" placeholder="" class="layui-input" style="display: inline;">';
                }
                content = (typeof(properties['content']) == 'string') ? properties['content'] : properties['content'].join('\n');
                content = convert(content);
                if (['radio', 'checkbox'].includes(problem_type)) {
                    choices_list = [];
                    choice_value = 'A';
                    for (j=0; j<properties['choice'].length; j++) {
                        choice = properties['choice'][j];
                        choices_list.push(choices_template.replace('{0}', choice_value).replace('{1}', choice));
                        choice_value = String.fromCharCode(choice_value.charCodeAt()+1);
                    }
                    choices_code = choices_list.join('\n');
                } else {
                    choices_code = choices_template;
                }
                if (properties.hasOwnProperty('explanation')) {
                    explanation_code = (typeof(properties['explanation']) == 'string') ? properties['explanation'] : properties['explanation'].join('\n');
                    explanation_code = explanation_template.replace('{}', convert(explanation_code));
                } else {
                    explanation_code = '';
                }

                var answer = "";
                if (['radio', 'text'].includes(problem_type)) {
                    answer = "{'" + properties['answer'] + "':" + properties['points'] + "}";
                } else if (problem_type == "checkbox") {
                    answer = "{";

                    function checkboxAnswerGen(i) {
                        if (i >= properties['answer'].length) return [""];
                        var s1 = checkboxAnswerGen(i+1);
                        var s2 = checkboxAnswerGen(i+1);
                        for (j=0; j<s2.length; j++) {
                            s2[j] = properties['answer'][i] + s2[j];
                        }
                        return s1.concat(s2);
                    }

                    var candidates = checkboxAnswerGen(0).slice(1,-1);
                    for (var i=0; i<candidates.length; i++) {
                        answer += "'" + candidates[i] + "':" + parseFloat(properties['points'])/2 + ",";
                    }
                    answer += "'" + properties['answer'] + "':" + properties['points'] + "}";
                }
                html_code = whole_template.replace('{0mAGiccOde}', properties['title']).replace('{1mAGiccOde}', content).replaceAll('{2mAGiccOde}', question_id).replace('{3mAGiccOde}', choices_code).replace('{4mAGiccOde}', explanation_code).replace('{5mAGiccOde}', problem_type).replace('{6mAGiccOde}', answer);

                return html_code;
            }
        };

        return parser.parse(text);
      }
    };
    return [myext];
};

var mdext = function () {
    var myext1 = {
      type: 'output',
      regex: /<table>/g,
      replace: '<table class=\"layui-table\">'
    };
    return [myext1];
};