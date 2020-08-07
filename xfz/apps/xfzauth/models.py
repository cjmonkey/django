from django.db import models

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from shortuuidfield import ShortUUIDField
from django.db import models


class UserManager(BaseUserManager):
    def _create_user(self, telephone, username, password, **kwargs):
        if not telephone:
            raise ValueError("请输入手机号码")
        if not username:
            raise ValueError("请输入用户名")
        if not password:
            raise ValueError("请输入密码")

        # password是加密以后传入的
        user = self.model(telephone=telephone, username=username, **kwargs)
        user.set_password(password)

        user.save()

        return user

    def create_user(self, telephone, username, password, **kwargs):
        kwargs['is_superuser'] = False
        return self._create_user(telephone, username, password, **kwargs)

    def create_superuser(self, telephone, username, password, **kwargs):
        kwargs['is_superuser'] = True
        kwargs['is_staff'] = True
        return self._create_user(telephone, username, password, **kwargs)


class User(AbstractBaseUser, PermissionsMixin):
    # 我们不使用默认的自增长的主键
    # 使用id，容易泄露公司机密，例如注册用户数
    # 使用uuid作为主键
    # 使用shortuuid：pip install django-shortuuidfield
    #
    uid = ShortUUIDField(primary_key=True)

    telephone = models.CharField(max_length=11, unique=True)
    email = models.EmailField(unique=True, null=True)
    username = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # auto_now_add=True
    # 将模型保存到数据库中的时候会自动记录当前的时间
    data_joined = models.DateTimeField(auto_now_add=True)

    # 设置用于验证时使用的字段
    USERNAME_FIELD = 'telephone'

    # 调用CreateSuperUser的时候，就会需要填这个属性中指定的字段
    # 也会将USERNAME_FIELD，提示，进行输入
    # password，也会提示，进行输入
    #
    # 所以以后注册的时候，会输入三个字段：username，telephone，password
    #
    REQUIRED_FIELDS = ['username']

    # 作用不大，给指定用户发送邮件的，会根据这个字段去发送
    #
    EMAIL_FIELD = 'email'

    objects = UserManager()

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username