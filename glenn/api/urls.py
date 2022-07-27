from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('grocery_list', views.CurrentGroceryListViewSet, basename='grocery_list')

urlpatterns = router.urls + [
    path('current_user/', views.CurrentUserView.as_view())
]
