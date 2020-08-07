function NewsCategory() {

};

NewsCategory.prototype.listenAddCategoryEvent = function () {
    var addBtn = $('#add-btn');

    addBtn.click(function () {
        xfzalert.alertOneInput({
            'title': '添加新闻分类',
            'placeholder': '请输入新闻分类',
            'confirmCallback': function (inputValue) {
                xfzajax.post({
                    'url': '/cms/add_news_category/',
                    'data': {
                        'name': inputValue,
                    },
                    'success': function (result) {
                        if (result['code'] == 200) {
                            console.log(result);
                            window.location.reload();
                        } else {
                            xfzalert.close();
                        }
                    },
                });
            },
        })
    });
};

NewsCategory.prototype.listenEditNewsCategoryEvent = function () {
    self = this;
    var editbtn = $('.edit-btn');
    editbtn.click(function () {
        var currentbtn = $(this);
        var tr = currentbtn.parent().parent();
        var pk = tr.attr('data-pk');
        var name = tr.attr('data-name')

        // 弹出对话框
        xfzalert.alertOneInput({
            'title': '修改分类名称',
            'placeholder': '请输入分类名称',
            'value': name,
            'confirmCallback': function (inputValue) {
                console.log(inputValue);
                xfzajax.post({
                    'url': '/cms/edit_news_category/',
                    'data': {
                        'pk': pk,
                        'name': inputValue
                    },
                    'success': function (result) {
                        if (result['code'] == 200) {
                            window.location.reload();
                        } else {
                            xfzalert.close();
                        }
                    }
                });
            },
        });
    });
};
NewsCategory.prototype.listenDeleteNewsCategoryEvent = function () {
    var deleteBtn = $('.delete-btn');
    deleteBtn.click(function () {
        var currentBtn = $(this);
        var tr = currentBtn.parent().parent();
        var pk = tr.attr('data-pk');
        console.log(pk);
        xfzalert.alertConfirm({
            'title': '确定删除?',
            'confirmCallback': function () {
                xfzajax.post({
                    'url': '/cms/delete_news_category/',
                    'data': {
                        'pk': pk,
                    },
                    'success': function (result) {
                        if (result['code'] == 200) {
                            window.location.reload();
                        } else {
                            xfzalert.close();
                        }
                    },
                });
            }
        });
    });
};

NewsCategory.prototype.run = function () {
    var self = this;
    self.listenAddCategoryEvent();
    self.listenEditNewsCategoryEvent();
    self.listenDeleteNewsCategoryEvent();
};

$(function () {
    var category = new NewsCategory();
    category.run();
});