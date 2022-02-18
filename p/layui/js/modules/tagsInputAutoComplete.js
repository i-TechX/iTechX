
/**
 @ Name：layui.tagsInputAutoComplete 
 @ Author：needahouse
 */

 layui.define(['jquery', 'laytpl'], function (exports) {
  var $ = layui.$
    , laytpl = layui.laytpl
    //字符常量
    , MOD_NAME = 'tagsInputAutoComplete'
    , timeId
    , classTimeId
    , show = false
    //外部接口
    , tagsInputAutoComplete = {
      // index: layui.tagsInputAutoComplete ? (layui.tagsInputAutoComplete.index + 10000) : 0

      //设置全局项
      set: function (options) {
        var that = this;
        that.config = $.extend({}, that.config, options);
        return that;
      }

      //事件监听
      , on: function (events, callback) {
        return layui.onevent.call(this, MOD_NAME, events, callback);
      }
    }, findIns = function (id) {
      id = id.indexOf('#') ? '#' + id : id;
      var targetIns = tagsInputAutoComplete[id]
      if (!targetIns) {
        throw new Error('未找到Id对应的实例，请检查Id是否书写正确')
      }
      return targetIns
    }

    //操作当前实例
    , thisIns = function () {
      var that = this
        , options = that.config
        , id = options.id || options.index;

      if (options.inputValue && Array.isArray(options.inputValue)) {
        options.inputValue.forEach(element => {
          this.addTag(element);
        });
      }

      return {
        reload: function (newOptions) {
          for (var key in newOptions) {
            that.config[key] = newOptions[key]
          }
          return that.render(true);
        },
        getInputValue: function () {
          return that.getInputValue();
        }
        , config: options
        , addTag: that.addTag
      }
    }

    //构造器
    , Class = function (options) {
      var that = this;
      that.index = ++tagsInputAutoComplete.index;
      that.config = $.extend({}, that.config, tagsInputAutoComplete.config, options);
    };

  //默认配置
  Class.prototype.config = {
    elem: '#test',//将要渲染元素的id div标签
    inputMode: 'tags',//or text(标签input或普通)
    dropdownMode: 'list',//or group(拉下选择框模式)
    frequency: 0,//input改变触发事件的频率
    tagCloseable: true,//标签项是否有删除标签
    tagClickable: true,//标签项能否点击
    autoComplete: true,//是否开启选择框
    autoCompleteData: [],//选择框的数据 通过reload方法可进行autoComplete更新
    backable: true,//标签是否可被退格键删除
    firstActived: false,//选择框是否第一默认选中
    tagsMode: 'append',
    // append || replace || toggle标签重复的如何处理
    dropdownSelectedStatus: true,//下拉框是否拥有选中状态样式
    placeholder: '',//input的placeholder
    listTemplate: '<p>{{d.name}}</p>',//下拉框每一项模板
    groupTemplate: '<p>{{d.name}}</p>',//dropdownMode:'group'有效 分组下拉框标题
    //不常用属性
    tagClassName: '',//为标签添加className
    textAppend: false,//inputMode text时 选择框选择后是否仍追加字符而不是替换
    dropdownonce: true,//dropdownonce为false时dropdown将不会在选择后消失
    keyboard: true,//是否启用键盘上下操作
    maxHeight: '300px',//下拉框最大高度
    width: 100,//数值100则作为百分比 字符串px
  };
  //初始化
  Class.prototype.init = function () {
    var that = this
      , options = that.config,
      wraper = '<div  tabindex="0" class="' + 'tagsInputAutoComplete-input-wraper"></div>',
      input = '<input type="text" placeholder="' + options.placeholder + '" class="layui-input" style="margin-bottom: 0;">';
    var uuid = options.elem.substr(1);
    $('body .tagsInputAutoComplete-dropdown.' + uuid).remove()
    if (options.autoComplete) {
      var dropdown = $('<div class="tagsInputAutoComplete-dropdown ' + uuid + '" style="max-height:' + options.maxHeight + '"></div>')
      $('body').append(dropdown)
    }
    $(options.elem).append($(wraper).append(input))
    that.events()
    setTimeout(function () {
      that.render()
    }, 0)
  }
  //初始化绑定事件
  Class.prototype.events = function () {
    var that = this
      , options = that.config,
      elem = options.elem,
      tagCloseable = options.tagCloseable,
      tagClickable = options.tagClickable,
      autoComplete = options.autoComplete,
      dropdownMode = options.dropdownMode,
      dropdownonce = options.dropdownonce,
      uuid = options.elem.substr(1),
      activeClass = '.tagsInputAutoComplete-dropdown-item-active',
      itemClass = '.tagsInputAutoComplete-dropdown-item',
      inputWarperClass = '.tagsInputAutoComplete-input-wraper',
      targetInputWarper = elem + ' ' + inputWarperClass,
      tagClassName = $.trim(options.tagClassName),
      targetInput = $(elem + ' input'),
      dropdown = $('.tagsInputAutoComplete-dropdown.' + uuid);
    targetInput.focus();
    var inputEvent = function () {
      show = true
      $(this).parent(inputWarperClass).addClass('tagsInputAutoComplete-input-wraper-focus')
      if (options.autoComplete) {
        clearTimeout(classTimeId);
        var elemdom = $(elem + ' ' + inputWarperClass)[0]
        var left = elemdom.getBoundingClientRect().left + window.scrollX
        var top = elemdom.getBoundingClientRect().top + window.scrollY
        var height = elemdom.offsetHeight
        var width = elemdom.offsetWidth
        var _width = options.width
        if (typeof _width == 'number') {
          width = _width / 100 * width
        } else {
          ~_width.indexOf('px') ? (width = _width.substr(0, _width.length - 2)) : (width = _width)
        }
        dropdown.css('left', left)
        dropdown.css('top', top + height + 2)
        dropdown.css('width', width)
        dropdown.removeClass('tagsInputAutoComplete-dropdown-hidden')
        dropdown.removeClass('tagsInputAutoComplete-dropdown-out')
        dropdown.addClass('tagsInputAutoComplete-dropdown-in')
      }
    }
    targetInput.on("click", inputEvent);
    targetInput.on('focus', inputEvent)
    function autoCompleteHide() {
      show = false
      if (options.autoComplete) {
        dropdown.removeClass('tagsInputAutoComplete-dropdown-in')
        dropdown.addClass('tagsInputAutoComplete-dropdown-out')
        dropdown.find('.tagsInputAutoComplete-dropdown-item').each(function (i) {
          $(this).removeClass('tagsInputAutoComplete-dropdown-item-active')
        })
        clearTimeout(classTimeId);
        classTimeId = setTimeout(function () {
          dropdown.addClass('tagsInputAutoComplete-dropdown-hidden')
          options.keyboard && options.firstActived && dropdown.find('.tagsInputAutoComplete-dropdown-item:first').addClass('tagsInputAutoComplete-dropdown-item-active')
        }, 500)
      }
    }
    targetInput.on('blur', function (event) {
      $(this).parent(inputWarperClass).removeClass('tagsInputAutoComplete-input-wraper-focus')
      autoCompleteHide()
    })
    tagCloseable && $(elem + ' ' + inputWarperClass).on('click', 'i', function (event) {
      var parant = $(this).parent()
      var text = parant.find('span').text()
      parant.remove()
      options.tagClose && options.tagClose(text, that.getInputValue(), event)
      options.tagRemove && options.tagRemove(text, that.getInputValue(), 'tagClose', event)
      return false
    })
    tagClickable && $(elem + ' ' + inputWarperClass).on('click', 'div.tagsInputAutoComplete-spans', function (event) {
      var text = $(this).find('span').text()
      options.tagClick && options.tagClick(text, that.getInputValue(), event)
    })
    function addSelected(val) {
      if (!options.dropdownSelectedStatus) {
        return
      }
      var dropdown = $('.tagsInputAutoComplete-dropdown.' + uuid)
      dropdown.find(itemClass).each(function (i) {
        if ($(this).text() == val) {
          $(this).addClass('tagsInputAutoComplete-dropdown-item-selected')
        }
      })
    }
    function removeSelected(val) {
      if (!options.dropdownSelectedStatus) {
        return
      }
      var dropdown = $('.tagsInputAutoComplete-dropdown.' + uuid)
      dropdown.find(itemClass).each(function (i) {
        if ($(this).text() == val) {
          $(this).removeClass('tagsInputAutoComplete-dropdown-item-selected')
        }
      })
    }
    function tagshandler(val) {
      addSelected(val)
      var span = $('<span class="tagsInputAutoComplete-span">' + val + '</span>')
      tagClassName && (tagClassName = $.trim(tagClassName))
      tagClassName && (tagClassName = tagClassName.indexOf('.') ? tagClassName : tagClassName.substr(1))
      var tag = $('<div class="tagsInputAutoComplete-spans"></div>')
      tagClassName && tag.addClass(tagClassName)
      tag.append(span)
      tagClickable && tag.addClass('tagsInputAutoComplete-spans-clickable')
      tagCloseable && tag.append('<i class="layui-icon">&#x1006;</i>')
      targetInput.before(tag)
      !dropdownonce && inputEvent()
      targetInput.val('')
    }

    Class.prototype.addTag = tagshandler;

    function selecthandler($this) {
      var val = ($this.children().length > 1) ? ($this.children()[0].textContent) : ($this.text())
      var has = $this.hasClass('tagsInputAutoComplete-dropdown-item-selected')
      if (dropdownMode == 'list' || dropdownMode == 'group') {
        if (options.inputMode == 'tags') {
          if (!has) {
            options.dropdownSelectedStatus && $this.addClass('tagsInputAutoComplete-dropdown-item-selected')
            tagshandler(val)
          } else {
            var spans = $(elem + ' .tagsInputAutoComplete-spans').find('span')
            if (options.tagsMode == 'toggle') {
              $this.removeClass('tagsInputAutoComplete-dropdown-item-selected')
              spans.each(function () {
                if ($(this).text() == val) {
                  $(this).parent().remove()
                  options.tagRemove && options.tagRemove(val, that.getInputValue(), 'toggle', event)
                }
              })
            } else if (options.tagsMode == 'replace') {
              spans.each(function () {
                if ($(this).text() == val) {
                  var parent = $(this).parent()
                  parent.remove()
                  targetInput.before(parent)
                  options.tagRemove && options.tagRemove(val, that.getInputValue(), 'replace', event)
                }
              })
            } else {
              tagshandler(val)
            }
          }
        } else {
          options.dropdownSelectedStatus && $this.addClass('tagsInputAutoComplete-dropdown-item-selected')
          options.textAppend ? targetInput.val(targetInput.val() + val) : targetInput.val(val)
        }
      }
      options.select && options.select(val, that.getInputValue(), event)
    }
    targetInput.keydown(function (event) {
      var keyCode = (event.keyCode ? event.keyCode : event.which)
      //回车事件
      var val = targetInput.val();
      if (keyCode == '13') {
        event.preventDefault();
        var trimval = $.trim(val);
        if (show && autoComplete) {
          var dropdown = $('.tagsInputAutoComplete-dropdown.' + uuid)
          var activeone = dropdown.find(activeClass)
          if (options.inputMode == 'tags') {

            if (dropdownMode == 'list' || dropdownMode == 'group') {
              var val = activeone.text()
              activeone[0] ? selecthandler(activeone)
                : (trimval && tagshandler(trimval));
              options.enter && options.enter(val, that.getInputValue(), 'select', event)
            }
          } else {
            selecthandler(activeone)
          }
        } else {
          if (trimval && options.inputMode == 'tags') {
            tagshandler(trimval)
          }
          options.enter && options.enter(val, that.getInputValue(), 'tags', event)
        }
        options.dropdownonce && show && autoCompleteHide()

        //退格事件
      } else if (keyCode == '8') {
        if (options.inputMode == 'tags' && options.backable) {
          if (!val) {
            var span = $(elem + ' div.tagsInputAutoComplete-spans:last')
            if (!span[0]) return
            var text = span.find('span').text()
            var flag = true
            $(elem + ' div.tagsInputAutoComplete-spans').each(function (i) {
              var _text = $(this).find('span').text();
              ($(this)[0] != span[0] && _text == text) && (flag = false)
            })
            flag && removeSelected(text)
            span.remove()
            options.backspace && options.backspace(text, that.getInputValue(), event)
            options.tagRemove && options.tagRemove(text, that.getInputValue(), 'backspace', event)
          }
        }

        //下
      } else if (options.keyboard && keyCode == '40') {
        if (autoComplete) {
          if (!show) {
            inputEvent()
          }
          var dropdown = $('.tagsInputAutoComplete-dropdown.' + uuid)
          var items = dropdown.find(itemClass)
          var index = 0
          items.each(function (i) {
            if ($(this).hasClass('tagsInputAutoComplete-dropdown-item-active')) {
              $(this).removeClass('tagsInputAutoComplete-dropdown-item-active')
              index = i + 1
              return
            }
          })
          $(items[index % items.length]).addClass('tagsInputAutoComplete-dropdown-item-active')
        }
        //上
      } else if (options.keyboard && keyCode == '38') {
        if (autoComplete) {
          if (show) event.preventDefault();
          var dropdown = $('.tagsInputAutoComplete-dropdown.' + uuid)
          var items = dropdown.find(itemClass)
          var index = 0
          items.each(function (i) {
            if ($(this).hasClass('tagsInputAutoComplete-dropdown-item-active')) {
              $(this).removeClass('tagsInputAutoComplete-dropdown-item-active')
              index = i + -1
              return
            }
          })
          index = ~index ? index : index + items.length
          $(items[index]).addClass('tagsInputAutoComplete-dropdown-item-active')
        }
      }
    })
    targetInput.on('input propertychange', function (event) {
      var dropdown = $('.tagsInputAutoComplete-dropdown.' + uuid)
      dropdown.find('.tagsInputAutoComplete-dropdown-item').each(function (i) {
        $(this).removeClass('tagsInputAutoComplete-dropdown-item-active')
      })
      inputEvent()
      var val = targetInput.val();
      clearTimeout(timeId);
      timeId = setTimeout(function () {
        if (options.dropdownSelectedStatus) {
          var item = dropdown.find(itemClass).each(function (i) {
            if (options.inputMode == 'tags') {
              // 暂不做处理
              // this.getInputValue()
            } else {
              if ($(this).text() == val) {
                $(this).addClass('tagsInputAutoComplete-dropdown-item-selected')
              } else {
                $(this).removeClass('tagsInputAutoComplete-dropdown-item-selected')
              }
            }
          })

        }
        options.inputchange && options.inputchange(val, that.getInputValue(), event)
      }, options.frequency || 0)
    })
    var dropdown = $('.tagsInputAutoComplete-dropdown.' + uuid)
    var dropdownItem = $(itemClass)
    autoComplete && dropdown.on('mouseenter', itemClass, function () {
      $(this).addClass('tagsInputAutoComplete-dropdown-item-active')
    })

    autoComplete && dropdown.on('mouseleave', itemClass, function () {
      $(this).removeClass('tagsInputAutoComplete-dropdown-item-active')
    })
    !options.dropdownonce && dropdown.on('mousedown', false)
    autoComplete && dropdown.on('click', itemClass, function (event) {
      selecthandler($(this))
    })
    // $('#tags').on('click', '.close', function () {
    //   var Thisremov = $(this).parent('span').remove(),
    //     ThisText = $(Thisremov).find('em').text();
    //   options.content.splice($.inArray(ThisText, options.content), 1)
    // })

  };
  Class.prototype.getInputValue = function () {
    var that = this
      , options = that.config,
      elem = options.elem,
      inputMode = options.inputMode,
      valueList = [];
    if (inputMode == 'tags') {
      $(elem + ' .tagsInputAutoComplete-spans').children('span').each(function () {
        valueList.push($(this).text())
      })
      return valueList
    }
    return $(elem + ' input').val()
  }
  //渲染视图
  Class.prototype.render = function (reload) {
    var that = this
      , options = that.config
      , autoComplete = options.autoComplete
      , autoCompleteData = options.autoCompleteData || []
      , listTemplate = options.listTemplate
      , dropdownMode = options.dropdownMode
      , list = ''
      , uuid = options.elem.substr(1);
    if (autoComplete) {
      var dropdown = $('.tagsInputAutoComplete-dropdown.' + uuid)
      dropdown.empty()
      if (dropdownMode == 'list') {
        autoCompleteData.forEach(function (item, index) {
          var div = '<div class="tagsInputAutoComplete-dropdown-item">' + laytpl(listTemplate).render(item) + '</div>'
          if (!index && options.firstActived && options.keyboard) {
            div = '<div class="tagsInputAutoComplete-dropdown-item tagsInputAutoComplete-dropdown-item-active">' + laytpl(listTemplate).render(item) + '</div>'
          }
          list += div
        })
        if (!list) {
          list = '<p style="text-align:center">暂无数据</p>'
        }
        dropdown.append(list)

      }
      if (dropdownMode == 'group') {
        autoCompleteData.forEach(function (item, index) {
          var itemList = item.list
          var wrap = $('<div class="tagsInputAutoComplete-dropdown-group"></div>')
          var groupTitle = $(laytpl(options.groupTemplate).render(item))
          groupTitle.addClass('tagsInputAutoComplete-dropdown-group-title')
          wrap.append(groupTitle)
          itemList.forEach(function (item) {
            var div = '<div class="tagsInputAutoComplete-dropdown-item">' + laytpl(listTemplate).render(item) + '</div>'
            if (!index && options.firstActived && options.keyboard) {
              div = '<div class="tagsInputAutoComplete-dropdown-item tagsInputAutoComplete-dropdown-item-active">' + laytpl(listTemplate).render(item) + '</div>'
            }
            wrap.append(div)
          })
          dropdown.append(wrap)
        })
        if (!autoCompleteData.length) {
          var list = '<p style="text-align:center">暂无数据</p>'
          dropdown.append(list)
        }

      }
      if (reload) {
        var dropdown = $('.tagsInputAutoComplete-dropdown.' + uuid)
        dropdown.find('.tagsInputAutoComplete-dropdown-item').each(function (i) {
          $(this).removeClass('tagsInputAutoComplete-dropdown-item-active')
        })
        var targetInput = $(options.elem + ' input');
        var val = targetInput.val();
        if (options.dropdownSelectedStatus) {
          dropdown.find('.tagsInputAutoComplete-dropdown-item').each(function (i) {
            if (options.inputMode == 'tags') {
            } else {
              if ($(this).text() == val) {
                $(this).addClass('tagsInputAutoComplete-dropdown-item-selected')
              } else {
                $(this).removeClass('tagsInputAutoComplete-dropdown-item-selected')
              }
            }
          })
        }
      }
    }
  }
  tagsInputAutoComplete.reload = function (id, options) {
    var targetIns = findIns(id)
    targetIns.reload(options)
  }
  tagsInputAutoComplete.getInputValue = function (id, options) {
    var targetIns = findIns(id)
    return targetIns.getInputValue(options)
  }
  //核心入口
  tagsInputAutoComplete.render = function (options) {

    var ins = new Class(options);
    ins.init();
    var wrapIns = thisIns.call(ins);
    Object.defineProperty(tagsInputAutoComplete, options.elem, {
      enumerable: false,
      configurable: false,
      writable: true,
      value: wrapIns
    })
    return wrapIns;
  };

  //加载组件所需样式
  layui.link('layui/js/modules/tagsInputAutoComplete.css');
  exports('tagsInputAutoComplete', tagsInputAutoComplete);
});