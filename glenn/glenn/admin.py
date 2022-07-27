from django.contrib import admin

from .models import GroceryItemReference, CurrentGroceryList, UsualGroceryItem, UnpurchasedGroceryItem, FavoriteGroceryList

admin.site.register(GroceryItemReference)
admin.site.register(CurrentGroceryList)
admin.site.register(UsualGroceryItem)
admin.site.register(UnpurchasedGroceryItem)
admin.site.register(FavoriteGroceryList)
