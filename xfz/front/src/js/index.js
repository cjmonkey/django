function Banner() {
    this.bannerWidth = 798;
    this.bannerGroup = $("#banner-group");
    this.index = 1;
    this.leftArrow = $(".left-arrow");
    this.rightArrow = $(".right-arrow");
    this.bannerUl = $("#banner-ul");
    this.liList = this.bannerUl.children("li");
    this.bannerCount = this.liList.length;
    this.pageControl = $(".page-control");
}

Banner.prototype.initBanner = function () {
    var self = this;
    var firstBanner = self.liList.eq(0).clone();
    var lastBanner = self.liList.eq(self.bannerCount - 1).clone();
    self.bannerUl.append(firstBanner);
    self.bannerUl.prepend(lastBanner);
    self.bannerUl.css({"width": self.bannerWidth * (self.bannerCount + 2), 'left': -self.bannerWidth});
};

Banner.prototype.initPageControl = function () {
    var self = this;
    for (var i = 0; i < self.bannerCount; i++) {
        var circle = $("<li></li>");
        self.pageControl.append(circle);
        if (i === 0) {
            circle.addClass("active");
        }
    }
    self.pageControl.css({"width": self.bannerCount * 12 + 8 * 2 + 16 * (self.bannerCount - 1)});
};

Banner.prototype.toggleArrow = function (isShow) {
    var self = this;
    if (isShow) {
        self.leftArrow.show();
        self.rightArrow.show();
    } else {
        self.leftArrow.hide();
        self.rightArrow.hide();
    }
};

Banner.prototype.animate = function () {
    var self = this;
    self.bannerUl.stop().animate({"left": -798 * self.index}, 500);
    var index = self.index;
    if (index === 0) {
        index = self.bannerCount - 1;
    } else if (index === self.bannerCount + 1) {
        index = 0;
    } else {
        index = self.index - 1;
    }
    self.pageControl.children('li').eq(index).addClass("active").siblings().removeClass('active');
};

Banner.prototype.loop = function () {
    var self = this;
    this.timer = setInterval(function () {
        if (self.index >= self.bannerCount + 1) {
            self.bannerUl.css({"left": -self.bannerWidth});
            self.index = 2;
        } else {
            self.index++;
        }
        self.animate();
    }, 2000);
};


Banner.prototype.listenArrowClick = function () {
    var self = this;
    self.leftArrow.click(function () {
        if (self.index === 0) {
            // ==：1 == '1'：true
            // ==== 1 != '1'
            self.bannerUl.css({"left": -self.bannerCount * self.bannerWidth});
            self.index = self.bannerCount - 1;
        } else {
            self.index--;
        }
        self.animate();
    });

    self.rightArrow.click(function () {
        if (self.index === self.bannerCount + 1) {
            self.bannerUl.css({"left": -self.bannerWidth});
            self.index = 2;
        } else {
            self.index++;
        }
        self.animate();
    });
};

Banner.prototype.listenBannerHover = function () {
    var self = this;
    this.bannerGroup.hover(function () {
        // 第一个函数是，把鼠标移动到banner上会执行的函数
        clearInterval(self.timer);
        self.toggleArrow(true);
    }, function () {
        // 第二个函数是，把鼠标从banner上移走会执行的函数
        self.loop();
        self.toggleArrow(false);
    });
};

Banner.prototype.listenPageControl = function () {
    var self = this;
    self.pageControl.children("li").each(function (index, obj) {
        $(obj).click(function () {
            self.index = index;
            self.animate();
        });
    });
};


Banner.prototype.run = function () {
    this.initBanner();
    this.initPageControl();
    this.loop();
    this.listenBannerHover();
    this.listenArrowClick();
    this.listenPageControl();
};


function Index() {
    var self = this;
    self.page = 2;
    self.category_id = 0;
    self.loadBtn = $('#load-more-btn');
};

Index.prototype.listenLoadMoreEvent = function () {
    var self = this;
    var loadBtn = $('#load-more-btn');
    loadBtn.click(function () {
        console.log('listenLoadMoreEvent');
        var page = self.page;
        xfzajax.get({
            'url': '/news/news_list/',
            'data': {
                'p': page,
                'category_id': self.category_id,
            },
            'success': function (result) {
                if (result['code'] == 200) {
                    console.log(result['data'])

                    var newses = result['data']
                    if (newses.length > 0) {
                        var tpl = template("news-item", {"newses": newses});
                        var ul = $(".list-inner-group");
                        ul.append(tpl);
                        self.page += 1;
                    }else {
                        loadBtn.hide();
                    }
                }
            },
        });
    });
};

Index.prototype.listenCategorySwitchEvent = function(){
    var self = this;

    var tabGroup = $('.list-tab');
    tabGroup.children().click(function () {
        // this代表当前选中的li标签
        var li = $(this);

        // 获取选中的li标签的分类id
        var category_id = li.attr('data-category');

        // 获取第几页的数据
        var page = 1;

        xfzajax.get({
            'url': '/news/news_list/',
            'data': {
                'category_id': category_id,
                'p': page,
            },
            'success': function (result) {
                if (result['code'] == 200){
                    var newses = result['data'];
                    var tpl = template("news-item", {"newses": newses});

                    var newsListGroup = $('.list-inner-group');
                    // 清空切换之前，对应标签下的数据，然后在将对应分类的数据，追加到模板中
                    // empty()，可以将当前标签下的子元素，都删掉
                    newsListGroup.empty();
                    newsListGroup.append(tpl);

                    // 重置标签下的page，再次获取的时候，应该是第二页的数据了
                    self.page = 2;

                    // 修改当前所在的分类
                    self.category_id = category_id;

                    // 修改li标签的选中状态，其它兄弟节点，移除这个
                    li.addClass('active').siblings().removeClass();

                    self.loadBtn.show();
                }
            },
        });

    });
};

Index.prototype.run = function () {
    var self = this;
    self.listenLoadMoreEvent();
    self.listenCategorySwitchEvent();
};

$(function () {
    var banner = new Banner();
    banner.run();

    var index = new Index();
    index.run();
});