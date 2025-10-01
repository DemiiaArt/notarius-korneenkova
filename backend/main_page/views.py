from django.shortcuts import render
from django.db.models import Count, Avg
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Header, BackgroundVideo, AboutMe, ServicesFor, Application, VideoInterview, Review
from .serializer import (
    HeaderSerializer, BackgroundVideoSerializer, AboutMeSerializer,
    ServicesForSerializer, ApplicationSerializer, ApplicationCreateSerializer, 
    VideoInterviewSerializer, ReviewSerializer, ReviewCreateSerializer
)

# Create your views here.

class HeaderView(generics.ListAPIView):
    """
    API endpoint для получения контактных данных для шапки профиля
    Включает адреса на трех языках: украинском, английском и русском
    """
    queryset = Header.objects.all()
    serializer_class = HeaderSerializer
    
    def list(self, request, *args, **kwargs):
        # Получаем первый объект Header (предполагаем, что он один)
        header_data = Header.objects.first()
        
        if header_data:
            serializer = self.get_serializer(header_data)
            return Response(serializer.data)
        else:
            return Response({
                'email': '',
                'phone_number': '',
                'phone_number_2': '',
                'address_ua': '',
                'address_en': '',
                'address_ru': ''
            })

class BackgroundVideoView(generics.ListAPIView):
    """
    API endpoint для получения фоновых видео
    """
    queryset = BackgroundVideo.objects.all()
    serializer_class = BackgroundVideoSerializer
    
    def list(self, request, *args, **kwargs):
        videos = BackgroundVideo.objects.all()
        serializer = self.get_serializer(videos, many=True)
        return Response(serializer.data)

class AboutMeView(generics.ListAPIView):
    """
    API endpoint для получения информации "О себе"
    Возвращает последнюю добавленную запись с мультиязычным контентом
    """
    queryset = AboutMe.objects.all()
    serializer_class = AboutMeSerializer
    
    def list(self, request, *args, **kwargs):
        # Получаем последнюю запись AboutMe (самую новую по ID)
        about_me_data = AboutMe.objects.last()
        
        if about_me_data:
            serializer = self.get_serializer(about_me_data)
            return Response(serializer.data)
        else:
            return Response({
                'subtitle_uk': '', 'subtitle_en': '', 'subtitle_ru': '',
                'title_uk': '', 'title_en': '', 'title_ru': '',
                'text_uk': '', 'text_en': '', 'text_ru': '',
                'photo': None
            })


class ServicesForListView(generics.ListAPIView):
    """
    Список категорий "Для кого услуги"
    """
    queryset = ServicesFor.objects.all()
    serializer_class = ServicesForSerializer


class ApplicationCreateView(generics.CreateAPIView):
    """
    Создание новой заявки
    """
    queryset = Application.objects.all()
    serializer_class = ApplicationCreateSerializer
    
    def perform_create(self, serializer):
        serializer.save()


class ApplicationListView(generics.ListAPIView):
    """
    Список всех заявок (только для админов)
    """
    queryset = Application.objects.all().order_by('-created_at')
    serializer_class = ApplicationSerializer


class ApplicationDetailView(generics.RetrieveUpdateAPIView):
    """
    Детальная информация о заявке и возможность обновления
    """
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


class VideoInterviewListView(generics.ListAPIView):
    """
    Список видео интервью
    """
    queryset = VideoInterview.objects.all()
    serializer_class = VideoInterviewSerializer


class VideoInterviewDetailView(generics.RetrieveAPIView):
    """
    Детальная информация о видео интервью
    """
    queryset = VideoInterview.objects.all()
    serializer_class = VideoInterviewSerializer


class ReviewCreateView(generics.CreateAPIView):
    """
    Создание нового отзыва
    После создания отзыв требует модерации (is_approved=False)
    """
    queryset = Review.objects.all()
    serializer_class = ReviewCreateSerializer
    
    def perform_create(self, serializer):
        # Сохраняем отзыв с is_approved=False (требует модерации)
        serializer.save(is_approved=False, is_published=False)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        # Временное логирование для отладки
        print(f"DEBUG: Received data: {request.data}")
        
        if not serializer.is_valid():
            print(f"DEBUG: Validation errors: {serializer.errors}")
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        
        return Response({
            'success': True,
            'message': 'Дякуємо! Ваш відгук з\'явиться після модерації'
        }, status=status.HTTP_201_CREATED)


class ReviewListView(generics.ListAPIView):
    """
    Список опубликованных отзывов
    Возвращает только одобренные отзывы (is_approved=True, is_published=True)
    """
    serializer_class = ReviewSerializer
    
    def get_queryset(self):
        # Возвращаем только одобренные и опубликованные отзывы
        return Review.objects.filter(is_approved=True, is_published=True).order_by('-created_at')


class ReviewStatsView(APIView):
    """
    Статистика рейтинга:
    - Средний рейтинг
    - Общее количество отзывов
    - Количество отзывов по каждой оценке (1-5 звезд)
    """
    def get(self, request):
        # Получаем только опубликованные отзывы
        approved_reviews = Review.objects.filter(is_approved=True, is_published=True)
        
        # Подсчет количества отзывов по каждому рейтингу
        rating_counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        
        for rating in range(1, 6):
            count = approved_reviews.filter(rating=rating).count()
            rating_counts[rating] = count
        
        # Общее количество отзывов
        total_reviews = approved_reviews.count()
        
        # Средний рейтинг
        if total_reviews > 0:
            avg_rating = approved_reviews.aggregate(Avg('rating'))['rating__avg']
            average_rating = round(avg_rating, 1) if avg_rating else 0
        else:
            average_rating = 0
        
        return Response({
            'average_rating': average_rating,
            'total_reviews': total_reviews,
            'rating_counts': rating_counts,
        })


class ReviewAdminListView(generics.ListAPIView):
    """
    Список всех отзывов для админ-панели (включая неодобренные)
    """
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Детальная информация об отзыве с возможностью редактирования и удаления
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer