from django.urls import path
from . import views

# 应用命名空间
app_name = "payinfo"

urlpatterns = [
    path("", views.index, name='index'),
    path("notify_view/", views.notify_view, name='notify_view'),
    path("download/", views.download, name='download'),
    path("payinfo_order/", views.payinfo_order, name='payinfo_order'),
]