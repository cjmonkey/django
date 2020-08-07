from django.http import JsonResponse

class HttpCode(object):
    ok = 200
    paramserror = 400
    unauth = 401
    methoderror = 405
    servererror = 500

# 返回rest的结果
def result(code = HttpCode.ok, message="", data=None, kwargs=None):
    json_dict = {
        "code": code,
        "message": message,
        "data": data,
    }
    if kwargs and isinstance(kwargs, dict) and kwargs.keys():
        json_dict.update(kwargs)
    return JsonResponse(json_dict)

# 正常
def ok():
    return result()

# 处理参数错误
def params_error(message="", data=None):
    return result(code=HttpCode.paramserror, message=message, data=data)

# 未授权的错误
def unauth(message="", data=None):
    return result(code=HttpCode.unauth, message=message, data=data)

# 方法错误
def method_error(message="", data=None):
    return result(code=HttpCode.methoderror, message=message, data=data)

# 服务器内部错误
def server_error(message="", data=None):
    return result(code=HttpCode.servererror, message=message, data=data)