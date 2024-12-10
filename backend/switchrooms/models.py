from django.db import models
from django.contrib.postgres.fields import ArrayField

class Switchroom(models.Model):
    AREA_TYPES = [
        ('POINT', 'Point'),
        ('POLYGON', 'Polygon'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    area_type = models.CharField(max_length=10, choices=AREA_TYPES)
    coordinates = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Photo(models.Model):
    switchroom = models.ForeignKey(Switchroom, related_name='photos', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='switchroom_photos/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo for {self.switchroom.name}"