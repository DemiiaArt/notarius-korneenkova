from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from .models import BlogPost
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer


class BlogPagination(PageNumberPagination):
    page_size = 1


class BlogListView(generics.ListAPIView):
    queryset = BlogPost.objects.published().order_by('-published_at', '-created_at')
    serializer_class = BlogPostListSerializer
    pagination_class = BlogPagination


class BlogDetailView(generics.RetrieveAPIView):
    queryset = BlogPost.objects.published()
    serializer_class = BlogPostDetailSerializer
    lookup_field = 'slug_ua' # ВРЕМЕННО
    lookup_url_kwarg = 'slug'
