
# 官方文档
# https://docs.djangoproject.com/en/2.0/howto/custom-management-commands/
#

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group,Permission,ContentType
from apps.news.models import News,NewsCategory,Banner,Comment
from apps.course.models import Course,CourseCategory,Teacher
from apps.payinfo.models import Payinfo

from apps.course.models import CourseOrder
from apps.payinfo.models import PayinfoOrder


# 必须继承BaseCommand
class Command(BaseCommand):

    # 处理逻辑的代码

    # 权限在auth_permission表中，这些权限是根据模型自动生成的
    # auth_permission表中content_type_id是一个外键，在django_content_type表中
    # django_content_type表中保存了app和模型的关系
    #
    # 可以先在django_content_type中找到模型，根据模型，在找到对应的权限
    def handle(self, *args, **options):
        # self.stdout.write(self.style.SUCCESS('helllo world'))

        # 1、编辑组（管理新闻、课程、评论、轮播图）
        #
        edit_content_types = [
            ContentType.objects.get_for_model(News),
            ContentType.objects.get_for_model(NewsCategory),
            ContentType.objects.get_for_model(Banner),
            ContentType.objects.get_for_model(Comment),
            ContentType.objects.get_for_model(Course),
            ContentType.objects.get_for_model(CourseCategory),
            ContentType.objects.get_for_model(Teacher),
            ContentType.objects.get_for_model(Payinfo),
        ]
        # 根据编辑组的content_type，找到所有的权限
        edit_primissions = Permission.objects.filter(content_type__in=edit_content_types)

        # 找到权限后，创建分组
        #
        # Group中的两个属性
        #
        # name = models.CharField(_('name'), max_length=80, unique=True)
        # permissions = models.ManyToManyField(
        #     Permission,
        #     verbose_name=_('permissions'),
        #     blank=True,
        # )
        #
        # permissions和Group是多对多的关系，这是一个属性，不是一个字段
        #
        editGroup = Group.objects.create(name='编辑')

        # 将权限添加到分组中
        editGroup.permissions.set(edit_primissions)
        editGroup.save()
        self.stdout.write(self.style.SUCCESS('[编辑]分组创建完成！'))

        # 2、财务组（管理课程订单、付费资讯订单）
        finance_content_types = [
            ContentType.objects.get_for_model(CourseOrder),
            ContentType.objects.get_for_model(PayinfoOrder),
        ]
        finance_primissions = Permission.objects.filter(content_type__in=finance_content_types)
        financeGroup = Group.objects.create(name='财务')
        financeGroup.permissions.set(finance_primissions)
        financeGroup.save()
        self.stdout.write(self.style.SUCCESS('[财务]分组创建完成！'))

        # 3、管理员组（编辑组+财务组）
        # 将edit_content_types和finance_content_types合在一起，就是管理员的权限了
        # edit_content_types和finance_content_types都是filter返回的QueryS对象，可以通过union方法结合在一起
        admin_permissions = edit_primissions.union(finance_primissions)
        adminGroup = Group.objects.create(name='管理员')
        adminGroup.permissions.set(admin_permissions)
        adminGroup.save()
        self.stdout.write(self.style.SUCCESS('[管理员]分组创建完成！'))

        # 4、超级管理员
        # 一个字段就能表示了，不用单独创建


