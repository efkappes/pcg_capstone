from rest_framework import generics, viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend

from glenn.models import GroceryList, GroceryListItems, GroceryItemReference
from .serializers import GroceryItemReferenceSerializer, CurrentGroceryListSerializer, CurrentGroceryListItemsSerializer, CurrentGroceryListAndItemsSerializer, UserSerializer, FavoriteGroceryListSerializer, FavoriteGroceryListItemsSerializer

class GroceryItemReferenceViewSet(viewsets.ModelViewSet):
    serializer_class = GroceryItemReferenceSerializer
    queryset = GroceryItemReference.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('item_name',)

class CurrentGroceryListViewSet(viewsets.ModelViewSet):
    # queryset = CurrentGroceryList.objects.all() # returns all grocery items regardless of user
    serializer_class = CurrentGroceryListSerializer

    # override base QuerySet to filter GroceryList records on current user
    def get_queryset(self):
        user = self.request.user
        return GroceryList.objects.filter(user_id=user.id)
        # return GroceryList.objects.filter(user_id=user.id).filter(is_current=True)

class CurrentGroceryListItemsViewSet(viewsets.ModelViewSet):
    serializer_class = CurrentGroceryListItemsSerializer
    queryset = GroceryListItems.objects.all()
    # queryset = GroceryListItems.objects.filter(id)

class CurrentGroceryListAndItemsViewSet(viewsets.ModelViewSet):
    serializer_class = CurrentGroceryListAndItemsSerializer
    queryset = GroceryListItems.objects.all()
    filter_backends = (DjangoFilterBackend,)
    filterset_fields = ('id',)

    # override base QuerySet to filter GroceryList records on current user
    def get_queryset(self):
        user = self.request.user
        return GroceryList.objects.filter(user_id=user.id)
        # return GroceryList.objects.filter(user_id=user.id).filter(is_current=True)
        # return GroceryList.objects.filter(user_id=user.id).filter(is_current=True).order_by('aisle')

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    def get_object(self):
        return self.request.user

class FavoriteGroceryListViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteGroceryListSerializer

    # override base QuerySet to filter GroceryList records on current user
    def get_queryset(self):
        user = self.request.user
        return GroceryList.objects.filter(user_id=user.id).filter(is_favorite=True)

class FavoriteGroceryListItemsViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteGroceryListItemsSerializer
    queryset = GroceryListItems.objects.all()
    # queryset = GroceryListItems.objects.filter(id)
