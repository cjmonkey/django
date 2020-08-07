from django.shortcuts import render,redirect,reverse
from django.contrib.auth import login,logout,authenticate
from django.views.decorators.http import require_POST
from .forms import LoginForm
from utils import restful
from io import BytesIO

from utils.captcha.xfzcaptcha import Captcha

from django.http import HttpResponse

@require_POST
def login_view(request):


    # 接收数据，验证
    # 只需要处理post请求就可以了。
    form = LoginForm(request.POST)

    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        password = form.cleaned_data.get('password')
        remember = form.cleaned_data.get('remember')

        user = authenticate(request, username=telephone, password=password)
        if user:
            if user.is_active:
                # 登录
                login(request, user)

                if remember:
                    # None，默认的过期时间，2周
                    request.session.set_expiry(None)
                else:
                    # 浏览器关闭，立即过期
                    request.session.set_expiry(0)

                # message，有没有数据都传，避免前端进行判断
                return restful.ok()
            else:
                # 用户被拉黑
                return restful.unauth(message="账号被冻结，未授权")
        else:
            return restful.params_error(message="手机号码或密码错误")
    else:
        errors = form.get_errors()
        return restful.params_error(message=errors)

def logout_view(request):
    logout(request)
    return redirect(reverse('index'))



from django.core.cache import cache

def img_captcha(request):
    text,image = Captcha.gene_code()

    # image，需要放到流中放回，不能放到HTTPResponse中
    # BytesIO相当于一个管道，用来存储图片的流数据
    out = BytesIO()

    # 将数据写到BytesIO，类型是png
    image.save(out, 'png')

    # 移动文件指针
    out.seek(0)

    response = HttpResponse(content_type='image/png')

    # 从BytesIO中将数据读取出来，保存到 response 对象上
    response.write(out.read())

    # out.tell()获取当前指针的尾椎，就能知道文件大小
    response['Content-length'] = out.tell();

    # 保存到memcached中
    cache.set(text.lower(), text.lower(), 60*5);

    return response


from utils.aliyunsdk import aliyunsms
from utils import restful

def sms_captcha(request):
    # result = aliyunsms.send_sms('17343041099', '1234')
    # print(result)

    # str = {
    #     "Message": "OK",
    #     "RequestID": "C1B15D4A-D99A-4569-A771-EE4619061CA0",
    #     "BizId": "630810229902863787^0",
    #     "Code":"OK",
    # }
    #
    # result = str;
    # print(result)


    # 接收手机号
    # /sms_captcha/?telephone=xxx
    telephone = request.GET.get('telephone')

    # 生成验证码
    # 调用图片验证码中的四位验证码
    code = Captcha.gene_text()

    # result = aliyunsms.send_sms(telephone, code)

    print(telephone, code)

    # 返回json数据格式的信息
    print(restful.ok())

    # 保存到memcached中
    cache.set(telephone, code, 60 * 5);

    return restful.ok();

# 测试memcached中的数据能正常存储
def cache_test(request):
    cache.set('username', 'xxx', 60)
    result = cache.get('username');

    print(result)

    return HttpResponse(result)



from .forms import RegisterForm

# 获取User对象
from django.contrib.auth import get_user_model
User = get_user_model()

# 注册
@require_POST
def register(request):
    form = RegisterForm(request.POST)
    if form.is_valid():
        telephone = form.cleaned_data.get('telephone')
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')

        user = User.objects.create_user(telephone=telephone,username=username, password=password)

        # 直接让用户处于登录页面
        login(request, user)

        return restful.ok()
    else:
        print(form.get_errors())
        return restful.params_error(message=form.get_errors())