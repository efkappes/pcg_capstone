from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings

from glenn.models import GroceryItemReference, GroceryList, GroceryListItems


class GroceryItemReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryItemReference
        fields = ('id', 'item_name', 'aisle')
        # fields = ('id', 'item_name', 'aisle')

class NestedGroceryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryList
        fields = ('id', 'user_id', 'list_name', 'owner', 'is_current', 'is_favorite', 'store_location_id')

class NestedGroceryListItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryListItems
        fields = ('id', 'item_name', 'aisle', 'usual', 'item_note', 'complete')

class CurrentGroceryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryList
        fields = ('id', 'user_id', 'list_name', 'owner', 'is_current', 'is_favorite', 'store_location_id')

class CurrentGroceryListItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryListItems
        fields = ('id', 'list_id', 'item_name', 'aisle', 'usual', 'item_note', 'complete')

class CurrentGroceryListAndItemsSerializer(serializers.ModelSerializer):
    # item_info = NestedGroceryListItemsSerializer(many=True, source='grocery_list_items', read_only=False)
    # item_info = NestedGroceryListItemsSerializer(many=True, read_only=False)
    # item_info = NestedGroceryListItemsSerializer(many=True, source='item_details', read_only=False)
    item_info = NestedGroceryListItemsSerializer(many=True, source='list_items', read_only=False)
    class Meta:
        model = GroceryList
        fields = ('id', 'user_id', 'list_name', 'owner', 'is_current', 'is_favorite', 'store_location_id', 'item_info')

class UserSerializer(serializers.ModelSerializer):
    list_info = NestedGroceryListSerializer(many=True, source='user_lists', read_only=False)
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'store_location_id', 'store_name', 'store_address_1', 'store_city', 'store_state', 'store_zip', 'list_info')

class FavoriteGroceryListSerializer(serializers.ModelSerializer):
    item_info = NestedGroceryListItemsSerializer(many=True, source='list_items', read_only=False)
    class Meta:
        model = GroceryList
        fields = ('id', 'user_id', 'list_name', 'owner', 'is_current', 'is_favorite', 'store_location_id', 'item_info')

class FavoriteGroceryListItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryListItems
        fields = ('id', 'list_id', 'item_name', 'aisle', 'usual', 'item_note', 'complete')