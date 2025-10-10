from django.urls import path
from . import views

urlpatterns = [
    path('notarialni-blog/', views.BlogListView.as_view(), name='blog-list'),
    path('notarialni-blog/home/', views.BlogHomeView.as_view(), name='blog-home'),
    path('notarialni-blog/<slug:slug>/', views.BlogDetailView.as_view(), name='blog-detail'),
]

