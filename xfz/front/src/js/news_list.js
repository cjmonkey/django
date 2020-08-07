function CMSNewsList() {

}

CMSNewsList.prototype.initDatPicker = function () {
    var startPicker = $('#start-picker');
    var endpicker = $('#end-picker');
    var todayDate = new Date();
    var todayStr = todayDate.getFullYear() + '/' + (todayDate.getMonth() + 1) + '/' + todayDate.getDate();

    // var options = {
    //     'showButtonPanel': true, //显示今日、清除的按钮
    //     'format': 'yyyy/mm/dd', // 时间格式
    //     // 'startDate': '2020/08/01', // 开始的时间，建议是网站上线的时间
    //     // 'endDate': todayStr, // 结束时间，今天
    //     // 'language': 'zh-CN', // 语言
    //     'todayBtn': 'linked', // 显示今日的按钮
    //     'todayHighlight': true, // 时间选择器上,高亮显示今天的日期
    //     'clearBtn': true, // 清除按钮，清除输入框的数据
    //     'autoclose': true, // 自动关闭，选择日期之后自动关闭
    // };

    startPicker.datepicker();
    endpicker.datepicker();
};

CMSNewsList.prototype.listenDeleteEvent = function () {



    var deleteBtns = $('.delete-btn');

    deleteBtns.click(function () {
        console.log('-----delete---');
        var btn = $(this);

        // 获取要删除的id
        var news_id = btn.attr('data-news-id');
        xfzalert.alertConfirm({
            'text': '确定要删除么？',
            'confirmCallback': function () {
                xfzajax.post({
                    'url': '/cms/delete_news/',
                    'data': {
                        'news_id': news_id
                    },
                    'success': function (result) {
                        if (result['code'] == 200) {
                            window.location = window.location.href;

                            // 有兼容性
                            // window.location.reload();
                        }
                    }
                });
            }
        });
    });
};


CMSNewsList.prototype.run = function () {
    this.initDatPicker();
    this.listenDeleteEvent();
};

$(function () {
    var newsList = new CMSNewsList();
    newsList.run();
});