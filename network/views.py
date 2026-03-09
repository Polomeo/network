import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
# TODO from django.core.paginator import Paginator
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Post, Follower, PostLike

#region AUTH VIEWS
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
#endregion

#region LOAD AND CREATE POST
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

#endregion

#region FOLLOWERS

def followers(request, profile_id):
    # Returns a JSON with a list of followers for profile_id
    followers = Follower.objects.filter(user = profile_id)

    if len(followers) == 0:
        return JsonResponse({"no_followers" : "The user has no followers"})
    else:
        return JsonResponse([follower.serialize() for follower in followers], safe=False)

@csrf_exempt
@login_required
def follow(request, profile_to_follow_id : int):
    # If the user is already following, unfollow
    profile_user = User.objects.get(id = profile_to_follow_id)

    if request.method != "POST":
        return JsonResponse({
            "error": "POST method required.",
        }, status=400)
    
    # Check if already following
    try:
        follow = Follower.objects.get(user = profile_user, followed_by = request.user)
        follow.delete()
        return JsonResponse({
            "unfollowed" : "User has succesfully unfollow this profile.",
        }, status=201)
    
    # If not, follow
    except Follower.DoesNotExist:
        new_follower = Follower(
            user = profile_user,
            followed_by = request.user,
        )
        new_follower.save()
        return JsonResponse({
            "followed" : "User has succesfully follow this profile.",
        }, status=201)


def following(request, profile_id):
    # Returns a JSON with a list of followings for profile_id

    followings = Follower.objects.filter(followed_by = profile_id)

    if len(followings) == 0:
        return JsonResponse({"no_followings" : "No user follows this profile."})
    else:
        return JsonResponse([following.serialize() for following in followings], safe=False)

#endregion

#region POST LIKES
@csrf_exempt
@login_required
def like_post(request, post_id : int):

    # Must be a POST request
    if request.method != "POST":
        return JsonResponse({
            "error": "POST method required.",
        }, status=400)
    
    # If the user is already following, unfollow
    post_to_like = Post.objects.get(id = post_id)
    
    # Check if already likes this post
    try:
        post_liked = PostLike.objects.get(post = post_to_like, liked_by = request.user)
        post_liked.delete()
        return JsonResponse({
            "unliked" : "User has succesfully unliked this post.",
        }, status=201)
    
    # If not, like
    except PostLike.DoesNotExist:
        new_like = PostLike(
            post = post_to_like,
            liked_by = request.user,
        )
        new_like.save()
        return JsonResponse({
            "liked" : "User has succesfully liked this post.",
        }, status=201)

def get_post_likes(request, post_id):
    likes = PostLike.objects.filter(post = post_id)

    if len(likes) == 0:
        return JsonResponse({"no_likes" : "This post has no likes."})
    else:
        return JsonResponse([like.serialize() for like in likes], safe=False)


#endregion