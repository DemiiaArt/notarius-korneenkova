from rest_framework import serializers
from .models import Header, BackgroundVideo, AboutMe, Services, ServiceDescription, ServicesFor, Application, VideoInterview



class HeaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Header
        fields = [
            'email', 
            'phone_number', 
            'phone_number_2', 
            'address_ua', 
            'address_en', 
            'address_ru'
        ]

class BackgroundVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackgroundVideo
        fields = ['id', 'video_name', 'video']

class AboutMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutMe
        fields = [
            'id', 
            'subtitle_uk', 'subtitle_en', 'subtitle_ru',
            'title_uk', 'title_en', 'title_ru',
            'text_uk', 'text_en', 'text_ru',
            'photo'
        ]


class ServiceDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceDescription
        fields = [
            'id',
            'text_uk', 'text_en', 'text_ru'
        ]


class ServicesSerializer(serializers.ModelSerializer):
    descriptions = ServiceDescriptionSerializer(source='servicedescription_set', many=True, read_only=True)

    class Meta:
        model = Services
        fields = [
            'id',
            'title_uk', 'title_en', 'title_ru',
            'image',
            'descriptions'
        ]


class ServicesForSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicesFor
        fields = [
            'id',
            'title_uk', 'title_en', 'title_ru',
            'subtitle_uk', 'subtitle_en', 'subtitle_ru',
            'description_uk', 'description_en', 'description_ru'
        ]


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            'id',
            'name',
            'phone_number',
            'created_at',
            'is_processed'
        ]
        read_only_fields = ['id', 'created_at', 'is_processed']


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['name', 'phone_number']


class VideoInterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoInterview
        fields = [
            'id',
            'title_video_uk', 'title_video_en', 'title_video_ru',
            'text_video_uk', 'text_video_en', 'text_video_ru',
            'video'
        ]