from apps.forms import FormMixin

from django import forms
from apps.news.models import News
from apps.news.models import Banner

class EditNewsCategoryForm(forms.Form):
    pk = forms.IntegerField(error_messages={'required':'必须传入分类id'})
    name = forms.CharField(max_length=100)

class WriteNewsForm(forms.ModelForm, FormMixin):
    category = forms.IntegerField()

    class Meta:
        model = News
        exclude = ['category', 'author', 'pub_time']


class AddBannerForm(forms.ModelForm,FormMixin):
    class Meta:
        model = Banner
        fields = ('priority','link_to','image_url')

class EditBannerForm(forms.ModelForm,FormMixin):
    # 虽然在数据库中有id属性，但是在定义模型的时候，没有定义id属性，在这里就不能写id属性
    # 可以写，但是id在模型中没有定义，实际上和没写，是一样的。
    # id是函数，避免冲突，使用pk代替
    pk = forms.IntegerField()
    class Meta:
        model = Banner
        fields = ('priority','link_to','image_url')



class EditNewsForm(forms.ModelForm, FormMixin):
    category = forms.IntegerField()
    pk = forms.IntegerField()
    class Meta:
        model = News
        exclude = ['category', 'author', 'pub_time']

from apps.course.models import Course
class PubCourseForm(forms.ModelForm,FormMixin):
    category_id = forms.IntegerField()
    teacher_id = forms.IntegerField()
    class Meta:
        model = Course
        exclude = ("category",'teacher')