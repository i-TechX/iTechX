layui.define(['jquery', 'form', 'layer'], function(exports){

    var $ = layui.jquery,
        layer = layui.layer,
        form = layui.form;

    var proxy = (function(options){
        var assign = function(defaultValue, value){
            output = {};
            for (var k in defaultValue)
                output[k] = defaultValue[k];
            for (var k in value)
                output[k] = value[k];
            return output;
        };

        options = assign({
            page: 'none',
        }, options);

        const RULE_OPTIONS = [
            [
                'Reader', 
                '加载阅读文件，如在线试题，文档，视频等，对raw.githubusercontent.com进行代理', 
                "^https?://raw.githubusercontent.com(/([^/]*)/([^/]*)/([^/]*)(.*\\.(?:(?:mdx)|(?:md)|(?:htmlx)|(?:json))))$", 
                {
                    "jsdelivr": ["https://cdn.jsdelivr.net/gh/$2/$3@$4/$5", "jsDelivr 代理（默认）"],
                    "itechx": ["https://githubraw.itechx.workers.dev$1", "iTechX 临时代理"],
                    "none": ["$&", "无代理"],
                }
            ],[
                'Microsoft', 
                '加载PPT, DOC, EXCEL文件，可在线预览，对raw.githubusercontent.com进行代理', 
                "^https?://raw.githubusercontent.com(/([^/]*)/([^/]*)/([^/]*)(.*\\.(?:(?:ppt)|(?:pptx)|(?:doc)|(?:docx)|(?:xls)|(?:xlsx))))$", 
                {
                    "preview": ["http://view.officeapps.live.com/op/view.aspx?src=$&", "无代理-在线预览（默认）"],
                    "ghproxy": ["https://ghproxy.com/$&", "ghproxy 代理-下载"],
                    "fastgit": ["https://raw.fastgit.org$1", "FastGit 代理-下载"],
                    "itechx": ["https://githubraw.itechx.workers.dev$1", "iTechX 临时代理-下载"],
                    "none": ["$&", "无代理-下载"],
                }
            ],[
                'PDF', 
                '加载PDF文件，可在线预览，对raw.githubusercontent.com进行代理', 
                "^https?://raw.githubusercontent.com(/([^/]*)/([^/]*)/([^/]*)(.*\\.(?:(?:pdf))))$", 
                {
                    "plain-preview": ["https://mozilla.github.io/pdf.js/web/viewer.html?file=$&", "无代理-在线预览"],
                    "itechx-preview": ["https://mozilla.github.io/pdf.js/web/viewer.html?file=https://githubraw.itechx.workers.dev$1", "iTechX 临时代理-在线预览（默认）"],
                    "ghproxy": ["https://ghproxy.com/$&", "ghproxy 代理-下载"],
                    "fastgit": ["https://raw.fastgit.org$1", "FastGit 代理-下载"],
                    "itechx": ["https://githubraw.itechx.workers.dev$1", "iTechX 临时代理-下载"],
                    "none": ["$&", "无代理-下载"],
                }
            ],[
                'Files', 
                '加载其他文件，如压缩包，LATEX等，对raw.githubusercontent.com进行代理', 
                "^https?://raw.githubusercontent.com(/([^/]*)/([^/]*)/([^/]*)(.*))$", 
                {
                    "ghproxy": ["https://ghproxy.com/$&", "ghproxy 代理（默认）"],
                    "fastgit": ["https://raw.fastgit.org$1", "FastGit 代理"],
                    "itechx": ["https://githubraw.itechx.workers.dev$1", "iTechX 临时代理"],
                    "none": ["$&", "无代理"],
                }
            ],[
                'API', 
                '加载网页所使用的Github API，对api.github.com进行代理', 
                "^https?://api.github.com(.*)$", 
                {
                    "itechx": ["https://githubapi.itechx.workers.dev$1", "iTechX 临时代理"],
                    "none": ["$&", "无代理（默认）"],
                }
            ],
        ];

        const DEFAULT_RULE = {
            'Reader': 'jsdelivr',
            'Microsoft': 'preview',
            'PDF': 'itechx-preview',
            'Files': 'ghproxy',
            'API': 'none'
        };

        /* Init */
        if (window.localStorage.getItem('ITECHX_PROXY_SETTING') == null) {
            window.localStorage.setItem('ITECHX_PROXY_SETTING', JSON.stringify(DEFAULT_RULE));
        }

        const rule = JSON.parse(window.localStorage.getItem('ITECHX_PROXY_SETTING'));

        var proxyComponent = {
            parse: function(url){
                // iterate RULE_OPTIONS
                for (var i = 0; i < RULE_OPTIONS.length; i++) {
                    var rule_name = RULE_OPTIONS[i][0];
                    var rule_regex = new RegExp(RULE_OPTIONS[i][2]);
                    var rule_options = RULE_OPTIONS[i][3];

                    if (rule_regex.test(url)) {
                        var rule_option = rule[rule_name] || DEFAULT_RULE[rule_name];
                        var rule_option_url = rule_options[rule_option][0];
                        return url.replace(rule_regex, rule_option_url);
                    }
                }
                return url;
            },

            render: function(container){
                
                var node = window.document.getElementById(container);
                var content = '\
                <div class="layui-row">\
                    <div class="layui-fluid">\
                        <div class="layui-card">\
                            <div class="layui-card-body" style="padding-top: 40px;">\
                                <h1 style="font-family: Quicksand; font-size: 2em;">Proxy Settings 代理设置</h1>\
                                <hr>\
                                <form class="layui-form" style="margin: 0 auto;max-width: 460px;padding-top: 40px;">\
                ';

                for (var i = 0; i < RULE_OPTIONS.length; i++) {
                    var rule_name = RULE_OPTIONS[i][0];
                    var rule_description = RULE_OPTIONS[i][1];
                    var rule_options = RULE_OPTIONS[i][3];

                    var block = '<label class="layui-form-label">' + rule_name + ' <i class="layui-icon layui-icon-about layui-layer-tips" data-tips="' + rule_description + '"></i></label>';
                    block += '<div class="layui-input-block">';
                    block += '<select name="' + rule_name + '" lay-filter="' + rule_name + '" lay-verify="required">'
                    // iterate rule_options
                    for (var j = 0; j < Object.keys(rule_options).length; j++) {
                        var rule_option = Object.keys(rule_options)[j];
                        var rule_option_description = rule_options[rule_option][1];
                        block += '<option value="' + rule_option + '" ' + (rule[rule_name] == rule_option ? 'selected' : '') + '>' + rule_option_description + '</option>';
                    }
                    block += '</select>';
                    block += '</div>';
                    content += '<div class="layui-form-item">' + block + '</div>';
                }

                content += '\
                                    <div class="layui-row" style="text-shadow: 0 0 1rem #fefefe; color: #b4b4b4;">\
                                        <p style="font-size:12px; margin-bottom:0;">- 如果您处于非受限制地区，建议您将以上所有选项设置为“无代理”。</p>\
                                        <p style="font-size:12px; margin-bottom:20px;">- 如果您处于受限制地区，建议您将以上所有选项设置为默认值。如遇到问题，可将API代理设置为iTechX临时代理。注意：iTechX临时代理存在访问限制，如果您使用iTechX临时代理仍无法访问，请考虑其他代理方式。</p>\
                                    </div>\
                                    <div class="layui-form-item">\
                                        <div class="layui-input-block">\
                                            <button class="layui-btn layui-btn-violet" lay-submit lay-filter="proxy-setting">\
                                                保存\
                                            </button>\
                                            <button type="reset" class="layui-btn layui-btn-primary-violet pre">重置</button>\
                                            <p id="proxy-set-success" class="layui-hide" style="color: green; display: inline; padding-left:1em;"><i class="layui-icon layui-icon-ok-circle"></i>保存成功！</p>\
                                        </div>\
                                    </div>\
                                </form>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
                ';

                node.innerHTML = content;

                layui.link('layui/js/modules/step.css');

                var layerTips = function (obj,close) {
                    var msg = $(obj).attr('data-tips');
                    if(!close && msg){
                        layer.tips(msg, obj, {
                            tipsMore: true,
                            time: 0,
                            tips: 3
                        });
                    }else{
                        layer.close(layer.index);
                    }
                }
                $(document).on('mouseenter', '.layui-layer-tips', function () {
                    layerTips(this,false);
                }).on('mouseleave', '.layui-layer-tips', function () {
                    layerTips(this,true);
                });

                form.on('submit(proxy-setting)', function (data) {
                    document.getElementById('proxy-set-success').classList.remove('layui-hide');
                    window.localStorage.setItem('ITECHX_PROXY_SETTING', JSON.stringify(data.field));
                    return false;
                });

                form.render();
            
            }
        }

        return proxyComponent;
    });
    exports('proxy', proxy);
});
