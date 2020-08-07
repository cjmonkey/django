//用来处理导航条
function FrontBase() {
}

FrontBase.prototype.listenAuthBOxHover = function () {
    var authBox = $('.auth-box');
    var user_more_box = $('.user-more-box');

    authBox.hover(function () {
        user_more_box.show();
    }, function () {
        user_more_box.hide();
    });
}

FrontBase.prototype.run = function () {
    var self = this;
    self.listenAuthBOxHover();
};


$(function () {
    var frontbase = new FrontBase();
    frontbase.run();
})

//用来处理用户登录
function Auth() {
    var self = this;
    self.maskWrapper = $('.mask-wrapper');
}

// 显示方法
Auth.prototype.showEvent = function () {
    var self = this;
    self.maskWrapper.show();
};

//隐藏方法
Auth.prototype.hideEvent = function () {
    var self = this;
    self.maskWrapper.hide();
};

// 监听点击事件
Auth.prototype.listenShowHideEvent = function () {

    console.log('listenShowHideEvent');

    var self = this;
    var login = $('.login-btn');
    var register = $('.register-btn');
    var close = $('.close-btn');
    var scroll_wrapper = $('.scroll-wrapper')

    login.click(function () {
        scroll_wrapper.css({"left": 0})
        self.showEvent();
        console.log('login');
    });

    register.click(function () {
        scroll_wrapper.css({"left": -400})
        self.showEvent();
        console.log('register');
    });

    close.click(function () {
        self.hideEvent();
        console.log('close');
    });
}

Auth.prototype.listenSwitchEvent = function () {
    var self = this;

    var switcher = $('.switch');

    switcher.click(function () {
        var scrollWrapper = $(".scroll-wrapper");
        var currentLeft = scrollWrapper.css("left");
        currentLeft = parseInt(currentLeft);
        if (currentLeft < 0) {
            scrollWrapper.animate({"left": '0'});
        } else {
            scrollWrapper.animate({"left": "-400px"});
        }
    });
};


// 监听登录事件
Auth.prototype.listenLoginEvent = function () {
    var self = this;

    var signin_group = $('.signin-group');

    var telephoneInput = signin_group.find("input[name='telephone']");
    var passwordInput = signin_group.find("input[name='password']");
    var rememberInput = signin_group.find("input[name='remember']");

    // 点击立即登录的时候，才提取数据

    var submitBtn = signin_group.find(".submit-btn");
    submitBtn.click(function () {
        var telephone = telephoneInput.val();
        var password = passwordInput.val();
        var remember = rememberInput.prop('checked');

        // Ajax发送请求
        // 需要解决csrf问题
        xfzajax.post({
            'url': '/account/login/',
            'data': {
                'telephone': telephone,
                'password': password,
                'remember': remember ? 1 : 0,
            },
            'success': function (result) {
                /**
                 * 登录成功，关闭窗口，重新加载页面
                 */
                if (result['code'] == 200) {
                    self.hideEvent();
                    window.location.reload();
                } else {
                    var messageObject = result['message'];
                    if (typeof messageObject == 'string' || messageObject.constructor == String) {
                        console.log(messageObject);
                    } else {
                        // {'password':['密码长度不能超过20位','xxx'], 'telephone':['xxx': 'xx']}
                        for (var key in messageObject) {
                            var messages = messageObject[key];
                            var message = messages[0];
                            console.log(message);
                        }
                    }
                }
                console.log(result);
            },
            'fail': function (error) {
                console.log(error);
            },
        });

    });
};

Auth.prototype.listenImgCaptchaEvent = function () {
    console.log('listenImgCaptchaEvent');
    // var imgCaptcha = $('.input-group-addon').find('.img_captcha');
    var imgCaptcha = $('.img_captcha');

    imgCaptcha.click(function () {
        // 给个随机数
        // /account/img_captcha/
        imgCaptcha.attr("src", "/account/img_captcha/" + "?random" + Math.random())
    });

};


// 短信发送事件
Auth.prototype.smsSuccessEvent = function () {
    var self = this;

    // 获取短信验证码按钮
    var smsCaptcha = $('.sms-captcha-btn');

    messageBox.showSuccess('短信验证码发送成功!');
    smsCaptcha.addClass('disabled');

    // 倒计时
    var count = 3;

    // 取消绑定的点击事件
    smsCaptcha.unbind('click');

    var timer = setInterval(function () {
        smsCaptcha.text(count + 's')
        count--;
        if (count <= 0) {
            clearInterval(timer);
            smsCaptcha.removeClass('disabled');
            smsCaptcha.text('发送验证码')
            // 重新绑定点击事件
            self.listenSmsCaptchaEvent();
        }
    }, 1000)
};


// 短信验证码
Auth.prototype.listenSmsCaptchaEvent = function () {
    var self = this;

    // 手机按钮输入框
    var telephoneInput = $('.signup-group input[name="telephone"]');

    // 获取短信验证码按钮
    var smsCaptcha = $('.sms-captcha-btn');

    // 获取手机号码
    smsCaptcha.click(function () {
        var telephone = telephoneInput.val();
        if (!telephone) {
            messageBox.showInfo('请输入手机号码!');
            return self.listenSmsCaptchaEvent();
        }
        xfzajax.get({
            'url': '/account/sms_captcha/',
            'data': {
                'telephone': telephone
            },
            'success': function (result) {
                //短信验证码发送成功
                if (result['code'] == 200) {
                    smsCaptcha.addClass('disabled');
                    self.smsSuccessEvent();
                }
            },
            'fail': function (error) {
                console.log(error);
            },
        });
    });
};

// 注册
Auth.prototype.listenRegisterEvent = function () {
    var signupGroup = $('.signup-group');
    var submitBtn = signupGroup.find('.submit-btn');
    submitBtn.click(function (event) {
        console.log('listenRegisterEvent');

        // 阻止默认行为
        // 表单的默认行为
        event.preventDefault();

        // 获取输入框的内容，通过ajax发送给后台
        // 获取输入框
        var telephoneInput = signupGroup.find('input[name=telephone]')
        var usernameInput = signupGroup.find("input[name='username']");
        var imgCaptchaInput = signupGroup.find("input[name='img_captcha']");
        var password1Input = signupGroup.find("input[name='password1']");
        var password2Input = signupGroup.find("input[name='password2']");
        var smsCaptchaInput = signupGroup.find("input[name='sms_captcha']");

        var telephone = telephoneInput.val();
        var username = usernameInput.val();
        var img_captcha = imgCaptchaInput.val();
        var password1 = password1Input.val();
        var password2 = password2Input.val();
        var sms_captcha = smsCaptchaInput.val();

        console.log('ajax');

        xfzajax.post({
            'url': '/account/register/',
            'data': {
                'telephone': telephone,
                'username': username,
                'img_captcha': img_captcha,
                'password1': password1,
                'password2': password2,
                'sms_captcha': sms_captcha
            },
            'success': function (result) {
                window.location.reload();
            }
        });
    });
};

Auth.prototype.run = function () {
    var self = this;
    self.listenShowHideEvent();
    self.listenSwitchEvent();
    self.listenLoginEvent();
    self.listenImgCaptchaEvent();
    self.listenSmsCaptchaEvent();
    self.listenRegisterEvent();
};

$(function () {
    var auth = new Auth();
    auth.run()
});

$(function () {
    if (template) {
        template.defaults.imports.timeSince = function (dataValue) {
            var date = new Date(dataValue);

            //获取毫秒
            var datets = date.getTime();

            // 获取当前时间戳
            var nowts = (new Date()).getTime();

            // 得到秒数
            var timestamp = (nowts - datets) / 1000;

            if (timestamp < 60) {
                return '刚刚';
            } else if (timestamp >= 60 && timestamp < 60 * 60) {
                minutes = parseInt(timestamp / 60);
                return minutes + '分钟前';
            } else if (timestamp >= 60 * 60 && timestamp < 60 * 60 * 24) {
                hours = parseInt(timestamp / 60 / 60);
                return hours + '小时前';
            } else if (timestamp >= 60 * 60 * 24 && timestamp < 60 * 60 * 24 * 30) {
                days = parseInt(timestamp / 60 / 60 / 24);
                return days + '天前';
            } else {
                var year = date.getFullYear();
                var month = date.getMonth();
                var day = date.getDay();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();

                return year + '/' + month + '/' + day + ' ' + hour + '/' + minute + '/' + second;
            }

        };
    };
});