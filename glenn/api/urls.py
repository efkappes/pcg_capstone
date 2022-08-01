from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('grocery_list', views.CurrentGroceryListViewSet, basename='grocery_list')
router.register('grocery_list_items', views.CurrentGroceryListItemsViewSet, basename='grocery_list_items')
router.register('grocery_list_and_items', views.CurrentGroceryListAndItemsViewSet, basename='grocery_list_and_items')
# router.register('store_location', views.CurrentUserView, basename='store_location')
router.register('favorite_lists', views.FavoriteGroceryListViewSet, basename='favorite_lists')
router.register('favorite_list_items', views.FavoriteGroceryListItemsViewSet, basename='favorite_list_items')

urlpatterns = router.urls + [
    path('current_user/', views.CurrentUserView.as_view())
]
