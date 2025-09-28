from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from django.urls import reverse
from .models import Header, BackgroundVideo, AboutMe, ServiceCategory
from .serializer import HeaderSerializer, BackgroundVideoSerializer, AboutMeSerializer, ServiceCategorySerializer

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
        """
        Возвращает структуру услуг в том же формате, что и nav-tree.js
        """
        try:
            # Получаем корневые категории (без родителя)
            root_categories = ServiceCategory.objects.filter(parent__isnull=True)
            
            if not root_categories.exists():
                return Response({
                    "id": "root",
                    "kind": "section", 
                    "label": {"ua": "", "ru": "", "en": ""},
                    "slug": {"ua": "", "ru": "", "en": ""},
                    "showInMenu": False,
                    "component": None,
                    "children": []
                })
            
            # Сериализуем корневые категории
            serializer = ServiceCategorySerializer(root_categories, many=True)
            
            # Формируем ответ в формате nav-tree.js
            response_data = serializer.data
            
            
            return Response(response_data)
            
        except Exception as e:
            return Response({
                "error": f"Ошибка при получении структуры услуг: {str(e)}"
            }, status=500)