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
from rest_framework.permissions import AllowAny

from .models import (
    Header, BackgroundVideo, AboutMe, ServiceCategory, 
    ServicesFor, Application, VideoInterview, Review, FreeConsultation, ContactUs,
    FrequentlyAskedQuestion
)
from .serializer import (
    HeaderSerializer, BackgroundVideoSerializer, AboutMeSerializer,
    ServiceCategorySerializer, ServiceCategoryDetailSerializer,
    ServicesForSerializer, ApplicationSerializer, ApplicationCreateSerializer,
    VideoInterviewSerializer, ReviewSerializer, ReviewCreateSerializer,
    FreeConsultationSerializer, FreeConsultationCreateSerializer,
    ContactUsSerializer, ContactUsCreateSerializer, FrequentlyAskedQuestionSerializer
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
        
        # Получаем язык из query параметра, по умолчанию 'ua'
        lang = request.GET.get('lang', 'ua')
        if lang not in ['ua', 'ru', 'en']:
            lang = 'ua'
        
        if header_data:
            serializer = self.get_serializer(header_data, context={'lang': lang})
            return Response(serializer.data)
        else:
            return Response({
                'email': '',
                'phone_number': '',
                'phone_number_2': '',
                'address': ''
            })


class ContactsView(APIView):
    """
    Совместимый с фронтендом endpoint контактов:
    - GET /api/contacts/ -> возвращает email/phones/address
    - POST /api/contacts/update/ -> обновляет/создаёт запись
    """
    permission_classes = [AllowAny]

    def get(self, request):
        header = Header.objects.first()
        if not header:
            # Возвращаем пустые значения, чтобы фронт не падал
            return Response({
                'email': '',
                'phone_number': '',
                'phone_number_2': '',
                'address': ''
            })

        # Язык как в HeaderView
        lang = request.GET.get('lang', 'ua')
        serializer = HeaderSerializer(header, context={'lang': lang})
        return Response(serializer.data)

    def post(self, request):
        """Обновление контактов (используется фронтендом в /contacts/update/)."""
        data = request.data or {}
        header = Header.objects.first()
        if not header:
            header = Header.objects.create(
                email=data.get('email', ''),
                phone_number=data.get('phone_number', ''),
                phone_number_2=data.get('phone_number_2', ''),
                address_ua=data.get('address', ''),
                address_en=data.get('address', ''),
                address_ru=data.get('address', ''),
            )
        else:
            header.email = data.get('email', header.email)
            header.phone_number = data.get('phone_number', header.phone_number)
            header.phone_number_2 = data.get('phone_number_2', header.phone_number_2)
            # Одно поле address приходит с фронта — пишем во все языки
            addr = data.get('address')
            if addr is not None:
                header.address_ua = addr
                header.address_en = addr
                header.address_ru = addr
            header.save()

        serializer = HeaderSerializer(header, context={'lang': request.GET.get('lang', 'ua')})
        return Response(serializer.data)

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

        # Определяем язык из query параметра
        lang = request.GET.get('lang', 'ua')
        if lang not in ['ua', 'ru', 'en']:
            lang = 'ua'
        
        if about_me_data:
            serializer = self.get_serializer(about_me_data, context={'lang': lang, 'request': request})
            return Response(serializer.data)
        else:
            return Response({
                'subtitle': '',
                'title': '',
                'text': '',
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
            root_categories = ServiceCategory.objects.filter(parent__isnull=True).order_by('order')
            
            if not root_categories.exists():
                # Возвращаем пустую структуру вместо 404, чтобы фронт корректно отработал
                return Response({"children": []}, status=200)
            
            
            serializer = ServiceCategorySerializer(root_categories, many=True)            
            response_data = serializer.data            
            
            return Response(response_data)
            
        except Exception as e:
            return Response({
                "error": f"Ошибка при получении структуры услуг: {str(e)}"
                }, status=500)


class ServiceCategoryDetailView(APIView):
    """
    Детальный просмотр категории услуг по URL-пути из slug'ов (1-3 уровня).
    Возвращает титулы, описания, hero_image и особенности услуг на выбранном языке.
    Поддерживает параметр lang в query string (ua/ru/en, по умолчанию ua).
    """

    def get(self, request, slug1=None, slug2=None, slug3=None):
        # Получаем язык из query параметра, по умолчанию 'ua'
        lang = request.GET.get('lang', 'ua')
        
        # Валидация языка
        if lang not in ['ua', 'ru', 'en']:
            lang = 'ua'
        
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

        # Передаем язык в контекст сериализатора
        serializer = ServiceCategoryDetailSerializer(current, context={'lang': lang})
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

    def list(self, request, *args, **kwargs):
        # Определяем язык из query параметра
        lang = request.GET.get('lang', 'ua')
        if lang not in ['ua', 'ru', 'en']:
            lang = 'ua'

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={'lang': lang})
        return Response(serializer.data)


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

    def list(self, request, *args, **kwargs):
        # Определяем язык из query параметра
        lang = request.GET.get('lang', 'ua')
        if lang not in ['ua', 'ru', 'en']:
            lang = 'ua'

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={'lang': lang})
        return Response(serializer.data)


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

class ReviewListWithStatsView(APIView):
    """
    Комбинированный endpoint для получения отзывов и статистики рейтинга
    Поддерживает GET для получения данных и POST для создания отзыва
    """
    def get(self, request):
        """Получение отзывов и статистики"""
        # Получаем опубликованные отзывы
        reviews = Review.objects.filter(is_approved=True, is_published=True).order_by('-created_at')
        reviews_serializer = ReviewSerializer(reviews, many=True)
        
        # Получаем статистику рейтинга
        stats = self._calculate_rating_stats()
        
        return Response({
            'reviews': reviews_serializer.data,
            'rating_stats': stats
        })
    
    def post(self, request):
        """Создание нового отзыва"""
        serializer = ReviewCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            # Сохраняем отзыв с is_approved=False (требует модерации)
            review = serializer.save(is_approved=False, is_published=False)
            
            return Response({
                'success': True,
                'message': 'Отзыв успешно отправлен и будет опубликован после модерации',
                'data': ReviewSerializer(review).data
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def _calculate_rating_stats(self):
        """Расчет статистики рейтинга"""
        # Получаем все одобренные отзывы для статистики
        approved_reviews = Review.objects.filter(is_approved=True, is_published=True)
        
        if not approved_reviews.exists():
            return {
                'averageRating': 0,
                'totalVotes': 0,
                'ratingCounts': {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
            }
        
        # Подсчитываем количество отзывов по каждой оценке
        rating_counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
        total_votes = 0
        total_rating = 0
        
        for review in approved_reviews:
            rating = review.rating
            if rating in rating_counts:
                rating_counts[rating] += 1
                total_votes += 1
                total_rating += rating
        
        # Вычисляем средний рейтинг
        average_rating = round(total_rating / total_votes, 1) if total_votes > 0 else 0
        
        return {
            'averageRating': average_rating,
            'totalVotes': total_votes,
            'ratingCounts': rating_counts
        }

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


class FrequentlyAskedQuestionListView(generics.ListAPIView):
    """
    Список опубликованных частых вопросов. Поддерживает параметр lang (ua/ru/en).
    """
    serializer_class = FrequentlyAskedQuestionSerializer

    def get_queryset(self):
        return FrequentlyAskedQuestion.objects.filter(is_published=True).order_by('order', 'created_at')

    def list(self, request, *args, **kwargs):
        lang = request.GET.get('lang', 'ua')
        if lang not in ['ua', 'ru', 'en']:
            lang = 'ua'
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True, context={'lang': lang})
        return Response(serializer.data)
