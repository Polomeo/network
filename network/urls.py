
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("post/all", views.load_posts, name="posts"),
    path("post/<int:user_id", views.load_user_posts, name="user_posts"),
]
