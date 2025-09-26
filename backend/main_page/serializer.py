from rest_framework import serializers
from .models import Header, BackgroundVideo, AboutMe, Services, ServiceDescription



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