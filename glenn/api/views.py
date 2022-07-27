from rest_framework import generics, viewsets, permissions

from glenn.models import CurrentGroceryList
from .serializers import CurrentGroceryListSerializer, UserSerializer

class CurrentGroceryListViewSet(viewsets.ModelViewSet):
    # queryset = CurrentGroceryList.objects.all() # returns all grocery items regardless of user
    serializer_class = CurrentGroceryListSerializer

    # FS: override base QuerySet to filter CurrentGroceryList records on current user
    def get_queryset(self):
        user = self.request.user
        return CurrentGroceryList.objects.filter(user_id=user.id)

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    def get_object(self):
        return self.request.user

