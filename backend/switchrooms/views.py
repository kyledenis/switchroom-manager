from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Switchroom, Photo
from .serializers import SwitchroomSerializer
import json

class SwitchroomViewSet(viewsets.ModelViewSet):
    queryset = Switchroom.objects.all().prefetch_related('photos')
    serializer_class = SwitchroomSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in list view: {str(e)}")  # Debug log
            return Response(
                {'detail': 'Failed to fetch switchrooms'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def create(self, request, *args, **kwargs):
        try:
            # Extract data from request
            data = {
                'name': request.data.get('name'),
                'description': request.data.get('description'),
                'area_type': request.data.get('area_type'),
                'coordinates': json.loads(request.data.get('coordinates', '[]')),
            }

            # Handle photos
            photos = request.FILES.getlist('photos')
            if photos:
                data['uploaded_photos'] = photos

            # Create serializer and validate
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        except json.JSONDecodeError:
            return Response(
                {'detail': 'Invalid coordinates format'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(f"Error in create view: {str(e)}")  # Debug log
            return Response(
                {'detail': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )