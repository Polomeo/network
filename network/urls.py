
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("register/", views.register, name="register"),

    # API Routes
    path("posts/all/<int:page>", views.load_posts, name="posts"),
    path("posts/<int:user_id>/<int:page>", views.load_user_posts, name="user_posts"),
    path("posts/new", views.new_post, name="new_post"),
    path("posts/followers/<int:profile_id>", views.followers, name="followers"),
    path("posts/follow/<int:profile_to_follow_id>", views.follow, name="follow"),
    path("posts/following/<int:profile_id>", views.following, name="following"),
    path("posts/like/<int:post_id>", views.like_post, name="like-post"),
    path("posts/get_likes/<int:post_id>", views.get_post_likes, name="post-likes"),
    path("posts/following_posts/<int:page_number>", views.load_following_posts, name="following-posts"),
]
