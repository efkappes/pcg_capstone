from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings

from glenn.models import CurrentGroceryList

class CurrentGroceryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrentGroceryList
        fields = ('id', 'user_id', 'item_name', 'aisle', 'usual', 'item_note', 'complete')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'store_location_id', 'store_name', 'store_address_1', 'store_city', 'store_state', 'store_zip')
