from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    author = models.ForeignKey(User,
                               on_delete=models.CASCADE,
                               related_name="posts")
    body = models.TextField()
    liked_by = models.ForeignKey(User,
                                 on_delete=models.CASCADE,
                                 related_name="likes",
                                 null=True,
                                 blank=True)
    created_at = models.DateTimeField()


class Comment(models.Model):
    post = models.ForeignKey(Post,
                             on_delete=models.CASCADE,
                             related_name="comments")
    author = models.ForeignKey(User,
                               on_delete=models.CASCADE,
                               related_name="comments_made")
    body = models.TextField()
    liked_by = models.ForeignKey(User,
                                 on_delete=models.CASCADE,
                                 null=True,
                                 blank=True)
    created_at = models.DateTimeField()
