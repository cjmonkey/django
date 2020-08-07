from haystack import indexes
from .models import News

class NewsIndex(indexes.SearchIndex, indexes.Indexable):
    # text属性
    # 作为索引的主要字段
    # 可以是其它名字，但需要在settings.py中设置
    text = indexes.CharField(document=True, use_template=True)

    # 索引是给哪个模型服务的
    # 设置给哪个模型服务
    def get_model(self):
        return News

    # 以后在从News中提取数据的时候，返回什么样的值
    def index_queryset(self, using=None):
        # 如果要在查询的时候根据时间排序，可以在这里指定
        return self.get_model().objects.all()