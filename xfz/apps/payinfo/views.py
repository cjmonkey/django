from django.shortcuts import render,reverse
from .models import Payinfo,PayinfoOrder
from apps.xfzauth.decorators import xfz_login_required
from utils import restful
from django.http import FileResponse,Http404

from django.conf import settings
import os

# 排除csrf保护
from django.views.decorators.csrf import csrf_exempt



def index(request):
    payinfos = Payinfo.objects.all()

    context = {
        'payinfos' : payinfos
    }
    return render(request, 'payinfo/payinfo.html', context=context)

@xfz_login_required
def payinfo_order(request):
    payinfo_id = request.GET.get('payinfo_id')

    payinfo = Payinfo.objects.get(pk=payinfo_id)

    order = PayinfoOrder.objects.create(
        payinfo=payinfo,
        buyer=request.user,
        status=1,
        amount= payinfo.price
    )
    context = {
        'goods': {
            'thumbnail': 'http://kh30bug0mjmgeiu8qmw.exp.bcevod.com/mda-kh30ft40qns714fz/mda-kh30ft40qns714fz.jpg',
            'price': payinfo.price,
            'title': payinfo.title
        },
        'order': order,
        'notify_url': request.build_absolute_uri(reverse('payinfo:notify_view')),

        # 支付完成，跳转到下载页面
        'return_url': request.build_absolute_uri(reverse('payinfo:index'))
    }

    return render(request, 'course/course_order.html', context=context)

# 返回当前订单号
@csrf_exempt
def notify_view(request):
    orderid = request.POST.get('orderid')
    PayinfoOrder.objects.filter(pk=orderid).update(status=2)
    return restful.ok()

@xfz_login_required
def download(request):
    # 根据订单id去判断
    payinfo_id = request.GET.get('payinfo_id')
    order = PayinfoOrder.objects.filter(payinfo_id=payinfo_id, buyer=request.user, status=2).first()

    if order:
        payinfo = order.payinfo
        path = payinfo.path

        fp = open(os.path.join(settings.MEDIA_ROOT, path), 'rb')
        response = FileResponse(fp)

        response['Context-Type'] = 'image/jpeg'
        response['Content-Disposition'] = 'attachment;filename=%s' % path.split('/')[-1]

        return response
    else:
        return Http404()