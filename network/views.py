import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
# TODO from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Post, Follower


def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


def load_posts(request):

    # Load all posts
    posts = Post.objects.all()
    
    if len(posts) == 0:
        return JsonResponse({"no-posts": "There are no post yet."}, status=200)
    else:
        posts = posts.order_by("-created_at").all()
        return JsonResponse([post.serialize() for post in posts], safe=False)


def load_user_posts(request, user_id):
    posts = Post.objects.filter(author_id = user_id)
    
    if len(posts) == 0:
        return JsonResponse({"no_posts": "There are no post yet."}, status=200)
    else:
        posts = posts.order_by("-created_at").all()
        return JsonResponse([post.serialize() for post in posts], safe=False)

@csrf_exempt
@login_required
def new_post(request):
    # Creating a new post must be done via POST
    if request.method != "POST":
        return JsonResponse({"error" : "POST request required"}, status=400)

    # Create Post object and save
    data = json.loads(request.body)

    post_body = data.get("body", "")
    new_post = Post(
        author=request.user,
        body=post_body
    )
    new_post.save()
    
    return JsonResponse({"message" : "Post created successfully."}, status=201)

def following(request, profile_id):
    # Returns a JSON with a list of followers for profile_id
    followers = Follower.objects.filter(user = profile_id)

    if len(followers) == 0:
        return JsonResponse({"no_followers" : "The user has no followers"})
    else:
        # followers = followers.order_by("followed_by__user__username").all()
        print(followers)
        return JsonResponse([follower.serialize() for follower in followers], safe=False)

