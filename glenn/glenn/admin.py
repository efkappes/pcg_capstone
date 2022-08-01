from django.contrib import admin

from .models import GroceryItemReference, GroceryList, GroceryListItems, UsualGroceryItem, UnpurchasedGroceryItem

admin.site.register(GroceryItemReference)
admin.site.register(GroceryList)
admin.site.register(GroceryListItems)
admin.site.register(UsualGroceryItem)
admin.site.register(UnpurchasedGroceryItem)
