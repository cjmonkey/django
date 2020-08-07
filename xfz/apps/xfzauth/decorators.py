from utils import restful
from django.shortcuts import redirect

def xfz_login_required(func):
    def wrapper(request, *args, **kwargs):
        # 用户已经登录
        if request.user.is_authenticated:
            return func(request, *args, **kwargs)
        else:
            # 用户没有登录，拦截到视图函数外面
            # 如果是ajax请求，就返回json数据
            if request.is_ajax():
                return restful.unauth(message='请先登录')
            else:
                # 重定向到首页
                return redirect('/')
    return wrapper

from functools import wraps
from django.http import Http404
def xfz_superuser_required(viewfunc):
    @wraps(viewfunc)
    def decorator(request, *args, **kwargs):
        if request.user.is_superuser:
            return viewfunc(request, *args, **kwargs)
        else:
            raise Http404
    return decorator
