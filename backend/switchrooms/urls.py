from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SwitchroomViewSet

router = DefaultRouter()
router.register(r'switchrooms', SwitchroomViewSet, basename='switchroom')

urlpatterns = [
    path('', include(router.urls)),
]