from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    author = models.ForeignKey(User,
                               on_delete=models.CASCADE,
                               related_name="posts")
    body = models.TextField()
    created_at = models.DateTimeField()


class PostLike(models.Model):
    post = models.ForeignKey(Post,
                             on_delete=models.CASCADE)
    liked_by = models.ForeignKey(User,
                                 on_delete=models.CASCADE,
                                 related_name='likes')


class Follower(models.Model):
    user = models.ForeignKey(User,
                             on_delete=models.CASCADE)
    followed_by = models.ForeignKey(User,
                                    on_delete=models.CASCADE,
                                    related_name="followers")
