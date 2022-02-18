function draw(semesterLabel, courseInfo, semester, passScore) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(semesterLabel));

    var legendData = [],
        xAxisData = [],
        series = [],
        logData = {};

    semesterScore = {};
    seriesData = {};
    for (const category in semester[semesterLabel]) {
        if (semester[semesterLabel].hasOwnProperty(category)) {
            seriesData[category] = [];
        }
    }

    for (const category in semester[semesterLabel]) {
        if (semester[semesterLabel].hasOwnProperty(category)) {
            const categoryPercentage = semester[semesterLabel][category][0];
            const categoryTitles = semester[semesterLabel][category][1];
            var categoryScore = 0;
            for (const title in categoryTitles) {
                if (categoryTitles.hasOwnProperty(title)) {
                    const titlePercentage = categoryTitles[title];
                    key_cur = [courseInfo.code, semesterLabel, category, title, 'curScore'].join('.').replace(/ /g,'');
                    key_tol = [courseInfo.code, semesterLabel, category, title, 'totalScore'].join('.').replace(/ /g,'');
                    // console.log(key_cur, key_tol);
                    titleScore = 0;
                    if (localStorage.hasOwnProperty(key_cur)) {
                        titleScore = 100*localStorage.getItem(key_cur)/localStorage.getItem(key_tol);
                        logData[title] = [localStorage.getItem(key_cur), localStorage.getItem(key_tol)];
                    };
                    categoryScore += titleScore*titlePercentage;

                    for (const category2 in seriesData) {
                        if (seriesData.hasOwnProperty(category2)) {
                            if (category2 === category)
                                seriesData[category2].push(titleScore.toFixed(2));
                            else
                                seriesData[category2].push(0);
                        }
                    }
                    xAxisData.push(title);
                }
            }
            legendData.push(category);
            for (const category2 in seriesData) {
                if (seriesData.hasOwnProperty(category2)) {
                    if (category2 === category)
                        seriesData[category2].push(categoryScore.toFixed(2));
                    else
                        seriesData[category2].push(0);
                }
            }
            xAxisData.push(category);
            semesterScore[category] = categoryScore*categoryPercentage;
        }
    }

    var totalScore = 0;
    for (const category in seriesData) {
        if (seriesData.hasOwnProperty(category)) {
            seriesData[category].push(semesterScore[category].toFixed(2));
            totalScore += semesterScore[category];
        }
    }
    xAxisData.push('Total');

    for (const key in legendData) {
        if (legendData.hasOwnProperty(key)) {
            const category = legendData[key];
            series.push({
                name: category,
                type: 'bar',
                stack: 'stack',
                data: seriesData[category]
            });
        }
    }

    series[0]["markPoint"] = {
        data: [{
            value: totalScore.toFixed(2),
            xAxis: xAxisData.length-1,
            yAxis: totalScore
        }]
    }

    if (passScore) {
        series[0]["markLine"] = {
            label: {formatter: "Pass: "+passScore, position: 'start'},
            data: [{
                name: 'Pass',
                yAxis: passScore
            }]
        }
    }

    // 指定图表的配置项和数据
    option = {
        color: ['#dd6b66','#759aa0','#e69d87','#8dc1a9','#ea7e53','#eedd78','#73a373','#73b9bc','#7289ab', '#91ca8c','#f49f42'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: "shadow"
            },
            formatter: function (params) {
                if (params[0].axisValue === 'Total') {
                    let res = "";
                    for (let i = 0; i < params.length; i++) {
                        let series2 = params[i];
                        if (typeof(series2.data) === "string")
                            // res = series2.axisValue + "<br/>" + series2.marker + series2.seriesName + ":" + series2.data + "<br/>";
                            res += series2.marker + series2.seriesName + " : " + series2.data + "% (占比"+(semester[semesterLabel][series2.seriesName][0]*100).toFixed(0)+"%)<br/>";
                    }
                    return res;
                };

                for (let i = 0; i < params.length; i++) {
                    let series2 = params[i];
                    if (typeof(series2.data) === "string")
                        // res = series2.axisValue + "<br/>" + series2.marker + series2.seriesName + ":" + series2.data + "<br/>";
                        if (logData.hasOwnProperty(series2.axisValue)) return series2.marker + series2.axisValue + " : " + series2.data + "% (" + logData[series2.axisValue][0] + '/' + logData[series2.axisValue][1] + ")<br/>";
                        else return series2.marker + series2.axisValue + " : " + series2.data + "%<br/>";
                }
            },
        },
        legend: {
            data: legendData,
            show: false
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxisData,
                
                axisLabel: {
                    interval:0, //坐标刻度之间的显示间隔，默认就可以了（默认是不重叠）
                    rotate:20   //调整数值改变倾斜的幅度（范围-90到90）
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                min: 0,
                max: 100,
                minInterval: 25
            }
        ],
        series: series
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}