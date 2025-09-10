from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from .models import Header, BackgroundVideo, AboutMe
from .serializer import HeaderSerializer, BackgroundVideoSerializer, AboutMeSerializer

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
