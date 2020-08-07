function Banners() {

};


Banners.prototype.listenAddBannerEvent = function () {
    var self = this;
    var addBtn = $('#add-banner-btn');
    addBtn.click(function () {

        // 找到banner-item，找到里面的子元素，如果子元素数量大于6个，就已经超过6张，不能继续添加
        var bannerListGroup = $('.banner-list-group');
        var length = bannerListGroup.children().length;

        if (length >= 6) {
            window.messageBox.showInfo('最多只能添加6张轮播图');
            return;
        }

        self.createBannerItem();
    });
};

Banners.prototype.createBannerItem = function (banner) {
    var self = this;
    var tpl = template("banner-item", {"banner": banner})
    var bannerListGroup = $('.banner-list-group');

    var bannerItem = null;

    if (banner) {
        bannerListGroup.append(tpl);
        // 获取添加到浏览器中
        bannerItem = bannerListGroup.find(".banner-item:last");
    } else {
        // 必须将tpl追加到网页中，才能添加绑定事件
        bannerListGroup.prepend(tpl);
        bannerItem = bannerListGroup.find(".banner-item:first");
    }

    self.addImageSelectEvent(bannerItem);
    self.addRemoveBannerEvent(bannerItem);
    self.addSaveBannerEvent(bannerItem);
}

Banners.prototype.addImageSelectEvent = function (bannerItem) {
    var image = bannerItem.find('.thumbnail');
    var imageInput = bannerItem.find('.image-input')

    // 图片不能打开文件选择框，只能通过input，类型是file，才能打开
    // 点击图片的时候，先获取input标签，再手动执行点击事件
    image.click(function () {
        //拿到image本身，取出兄弟元素，就是image啦
        imageInput.click();
    });

    //绑定change事件
    imageInput.change(function () {
        var file = this.files[0];
        var formData = new FormData();
        formData.append("file", file);

        xfzajax.post({
            'url': '/cms/upload_file/',
            'data': formData,
            'processData': false,
            'contentType': false,
            'success': function (result) {
                if (result['code'] == 200) {
                    var url = result['data']['url'];

                    image.attr('src', url);
                }
            },
        });
    });
};

Banners.prototype.addRemoveBannerEvent = function (bannerItem) {
    var closeBtn = bannerItem.find('.banner-close-btn');

    closeBtn.click(function () {
        var bannerId = bannerItem.attr('data-banner-id');
        if (bannerId) {
            xfzalert.alertConfirm({
                'text': '您确定要删除这个轮播图吗?',
                'confirmCallback': function () {
                    xfzajax.post({
                        'url': '/cms/delete_banner/',
                        'data': {
                            'banner_id': bannerId
                        },
                        'success': function (result) {
                            if (result['code'] === 200) {
                                bannerItem.remove();
                                window.messageBox.showSuccess('轮播图删除才成功！');
                            }
                        }
                    });
                }
            });
        } else {
            bannerItem.remove();
        }
    });
};

Banners.prototype.addSaveBannerEvent = function (bannerItem) {
    var saveBtn = bannerItem.find('.banner-save-btn');
    var imageTag = bannerItem.find('.thumbnail');
    var priorityTag = bannerItem.find('input[name="priority"]');
    var linktoTag = bannerItem.find('input[name="link_to"]');
    var bannerId = bannerItem.attr('data-banner-id');
    var url = '';

    if (bannerId) {
        url = '/cms/edit_banner/';
    } else {
        url = '/cms/add_banner/';
    }

    saveBtn.click(function () {
        var image_url = imageTag.attr('src');
        var priority = priorityTag.val();
        var link_to = linktoTag.val();
        var prioritySpan = bannerItem.find('span[class="priority"]');

        xfzajax.post({
            'url': url,
            'data': {
                'image_url': image_url,
                'priority': priority,
                'link_to': link_to,
                'pk': bannerId, // 如果是新增，这里的pk也不影响
            },
            'success': function (result) {
                // 如果是新增，返回bannerid给前端
                // 如果是编辑，只返回ok，没有别的数据，因此，在这里，取bannerid，就取不到
                // 这个代码，在新增的时候才有用
                // 这里需要区分，是添加，还是修改
                if (result['code'] == 200) {
                    if (bannerId) {
                        window.messageBox.showSuccess('轮播图修改成功');
                    } else {
                        // 新增
                        bannerId = result['data']['banner_id'];
                        console.log(bannerId);

                        // 绑定到bannerItem上
                        bannerItem.attr('data-banner-id', bannerId);
                        window.messageBox.showSuccess('轮播图添加完成');
                    }
                    prioritySpan.text("优先级: " + priority); // 在任何地方都需要执行
                }
            },
        });
    });
}

//网页加载完，就加载banner列表
Banners.prototype.loadData = function () {
    var self = this;

    xfzajax.get({
        'url': '/cms/banner_list/',
        'success': function (result) {
            if (result['code'] == 200) {
                var banners = result['data'];
                for (var i = 0; i < banners.length; i++) {
                    var banner = banners[i];
                    self.createBannerItem(banner);
                }
            }
        },
    });
}

Banners.prototype.run = function () {
    var self = this;
    self.listenAddBannerEvent();
    self.loadData();
};

$(function () {
    var banners = new Banners();
    banners.run();
});