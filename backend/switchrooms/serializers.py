from rest_framework import serializers
from .models import Switchroom, Photo

class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ['id', 'image', 'uploaded_at']

class SwitchroomSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)
    uploaded_photos = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Switchroom
        fields = ['id', 'name', 'description', 'area_type', 'coordinates', 'photos', 'uploaded_photos', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    def create(self, validated_data):
        uploaded_photos = validated_data.pop('uploaded_photos', [])
        switchroom = Switchroom.objects.create(**validated_data)

        for photo in uploaded_photos:
            Photo.objects.create(switchroom=switchroom, image=photo)

        return switchroom