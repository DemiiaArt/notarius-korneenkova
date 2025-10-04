from django.shortcuts import render, get_object_or_404
from django.db.models import Count, Avg, Q
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from django.urls import reverse

from .models import (
    Header, BackgroundVideo, AboutMe, ServiceCategory, 
    ServicesFor, Application, VideoInterview, Review, FreeConsultation, ContactUs
)
from .serializer import (
    HeaderSerializer, BackgroundVideoSerializer, AboutMeSerializer,
    ServiceCategorySerializer, ServiceCategoryDetailSerializer,
    ServicesForSerializer, ApplicationSerializer, ApplicationCreateSerializer,
    VideoInterviewSerializer, ReviewSerializer, ReviewCreateSerializer,
    FreeConsultationSerializer, FreeConsultationCreateSerializer,
    ContactUsSerializer, ContactUsCreateSerializer
)


from .utils import inject_services, root_data
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


class CKEditorUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.data.get('upload') or request.FILES.get('upload')
        if not file_obj:
            return Response({"error": {"message": "No file uploaded"}}, status=400)

        saved_path = default_storage.save(f"uploads/{file_obj.name}", ContentFile(file_obj.read()))
        file_url = settings.MEDIA_URL + saved_path
        return Response({
            # CKEditor SimpleUploadAdapter expects this shape
            "url": file_url
        })


class ServicesCategoryView(APIView):
    """
    API endpoint для получения структуры услуг в формате nav-tree.js
    Возвращает иерархическую структуру категорий услуг из базы данных
    """
    
    def get(self, request, *args, **kwargs):

        try:
            # Получаем корневые категории (без родителя)
            root_categories = ServiceCategory.objects.filter(parent__isnull=True, show_in_menu=True).order_by('order')
            
            if not root_categories.exists():
                return Response(root_data)
            
            
            serializer = ServiceCategorySerializer(root_categories, many=True)            
            response_data = serializer.data
            
            # Отладка
            print(f"DEBUG: root_categories count: {root_categories.count()}")
            print(f"DEBUG: response_data length: {len(response_data)}")
            print(f"DEBUG: response_data IDs: {[item['id'] for item in response_data]}")
            
            merged_children = inject_services(root_data, response_data)
            
            return Response(merged_children)
            
        except Exception as e:
            print(f"DEBUG: Exception in ServicesCategoryView: {e}")
            return Response(root_data)


class ServiceCategoryDetailView(APIView):
    """
    Детальный просмотр категории услуг по URL-пути из slug'ов (1-3 уровня).
    Возвращает только титулы и описания на 3 языках.
    """

    def get(self, request, slug1=None, slug2=None, slug3=None):
        path_slugs = [s for s in (slug1, slug2, slug3) if s]
        parent = None
        current = None
        try:
            for s in path_slugs:
                current = ServiceCategory.objects.filter(parent=parent).filter(
                    Q(slug_ua=s) | Q(slug_ru=s) | Q(slug_en=s)
                ).order_by('order').first()
                if not current:
                    return Response({"detail": "Not found."}, status=404)
                parent = current
        except Exception:
            return Response({"detail": "Not found."}, status=404)

        serializer = ServiceCategoryDetailSerializer(current)
        return Response(serializer.data)
    

# class ServiceCategoryDetailView(APIView):
#     """
#     API для получения конкретной категории по цепочке slug'ов (до 3 уровней)
#     """

#     def get(self, request, slug1=None, slug2=None, slug3=None):
#         # формируем список slug'ов (убираем None)
#         slugs = [s for s in [slug1, slug2, slug3] if s]

#         # ищем категорию по цепочке
#         category = None
#         parent = None

#         for slug in slugs:
#             category = get_object_or_404(ServiceCategory, parent=parent, slug_ua=slug)
#             parent = category

#         serializer = ServiceCategorySerializer(category)
#         return Response(serializer.data)
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


class FreeConsultationCreateView(generics.CreateAPIView):
    """
    Создание новой заявки на бесплатную консультацию
    После создания заявка появляется в админке с is_processed=False
    """
    queryset = FreeConsultation.objects.all()
    serializer_class = FreeConsultationCreateSerializer
    
    def perform_create(self, serializer):
        # Сохраняем заявку с is_processed=False (требует обработки)
        serializer.save(is_processed=False)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        # Временное логирование для отладки
        print(f"DEBUG: Received consultation data: {request.data}")
        
        if not serializer.is_valid():
            print(f"DEBUG: Validation errors: {serializer.errors}")
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        
        return Response({
            'success': True,
            'message': 'Дякуємо! Ваша заявка прийнята. Ми зв\'яжемося з вами найближчим часом.'
        }, status=status.HTTP_201_CREATED)


class FreeConsultationListView(generics.ListAPIView):
    """
    Список всех заявок на бесплатную консультацию (только для админов)
    """
    queryset = FreeConsultation.objects.all().order_by('-created_at')
    serializer_class = FreeConsultationSerializer


class FreeConsultationDetailView(generics.RetrieveUpdateAPIView):
    """
    Детальная информация о заявке на консультацию и возможность обновления
    """
    queryset = FreeConsultation.objects.all()
    serializer_class = FreeConsultationSerializer


class ContactUsCreateView(generics.CreateAPIView):
    """
    Создание новой заявки через форму контактов
    После создания заявка появляется в админке с is_processed=False
    """
    queryset = ContactUs.objects.all()
    serializer_class = ContactUsCreateSerializer
    
    def perform_create(self, serializer):
        # Сохраняем заявку с is_processed=False (требует обработки)
        serializer.save(is_processed=False)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        # Временное логирование для отладки
        print(f"DEBUG: Received contact form data: {request.data}")
        
        if not serializer.is_valid():
            print(f"DEBUG: Validation errors: {serializer.errors}")
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        
        return Response({
            'success': True,
            'message': 'Дякуємо за звернення! Ми зв\'яжемося з вами найближчим часом.'
        }, status=status.HTTP_201_CREATED)


class ContactUsListView(generics.ListAPIView):
    """
    Список всех обращений через форму контактов (только для админов)
    """
    queryset = ContactUs.objects.all().order_by('-created_at')
    serializer_class = ContactUsSerializer


class ContactUsDetailView(generics.RetrieveUpdateAPIView):
    """
    Детальная информация об обращении и возможность обновления
    """
    queryset = ContactUs.objects.all()
    serializer_class = ContactUsSerializer
