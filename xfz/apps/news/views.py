from django.shortcuts import render
from .models import News,NewsCategory
from django.conf import settings
from utils import restful
from .serializers import NewsSerializer
from django.http import Http404
from .forms import PublicCommentForm
from .models import Comment
from .serializers import CommentSerializer
from apps.xfzauth.decorators import xfz_login_required

from .models import Banner

def index(request):
    count = settings.ONE_PAGE_NEWS_COUNT

    # 切片（排序）
    newses = News.objects.select_related('category', 'author').all()[0:count]

    # 可以将新闻分类，放到缓存中
    categories = NewsCategory.objects.all()

    context = {
        'newses': newses,
        'categories': categories,
        'banners': Banner.objects.all()
    }
    return render(request, 'news/index.html', context=context)





def news_list(request):
    # 通过 p 参数，来指定获取的是第几页的数据
    # 并且，这个p参数，是通过查询字符串的方式，传过来的

    # 默认返回第一页的数据
    page = int(request.GET.get('p', 1))

    # 分类为0，表示不进行任何分类，直接按照时间倒序排序
    category_id = int(request.GET.get('category_id', 0))

    # 第一页，0,1
    # 第一页，2,3
    start = (page - 1) * settings.ONE_PAGE_NEWS_COUNT
    end = start + settings.ONE_PAGE_NEWS_COUNT

    if category_id == 0:
        # QuerySet对象，调用values()，得到列表，列表里面是字典
        # 这个不符合要求，有缺陷
        newses = News.objects.select_related('category', 'author').all()[start:end]
    else:
        newses = News.objects.select_related('category', 'author').filter(category_id=category_id)[start:end]

    serializer = NewsSerializer(newses, many=True)
    data = serializer.data

    print(data)

    # 将数据，返回给用户
    return restful.result(data=data)
    # return restful.ok()

def news_detail(request, news_id):
    try:
        # 第一次：将news下的所有common全部取出
        # 第二次：将commen下面的所有author一次取出
        news = News.objects.select_related('category', 'author').prefetch_related('comments__author').get(pk=news_id)
        # 通过news对象，拿到所有的评论信息
    except News.DoesNotExist:
        raise Http404

    context = {
        'news': news
    }

    return render(request, "news/news_detail.html", context=context)

@xfz_login_required
def public_comment(request):
    form = PublicCommentForm(request.POST)
    if form.is_valid():
        news_id = form.cleaned_data.get('news_id')
        content = form.cleaned_data.get('content')
        news = News.objects.get(pk=news_id)
        comment = Comment.objects.create(content=content, news=news,author=request.user)
        serializer = CommentSerializer(comment)
        return restful.result(data=serializer.data)
    else:
        return restful.params_error(message=form.get_errors())

from django.db.models import Q
def search(request):
    q = request.GET.get('q')
    context = {}

    if q:
        newses = News.objects.filter(Q(title__icontains=q) | Q(content__icontains=q))

        context['newses'] = newses

    return render(request, 'search/search.html', context=context)