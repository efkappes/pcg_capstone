from django.conf import settings
from django.db import models
from django.forms import BooleanField

class GroceryItemReference(models.Model):
    item_name = models.CharField(max_length=200)
    aisle = models.IntegerField(default = 0)
    create_date_time = models.DateTimeField(auto_now_add=True)
    update_date_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.item_name

class CurrentGroceryList(models.Model):
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=200)
    aisle = models.IntegerField(default=0)
    usual = models.BooleanField(default=False)
    item_note = models.CharField(max_length=200, null=True, blank=True)
    complete = models.BooleanField(default=False)
    create_date_time = models.DateTimeField(auto_now_add=True)
    update_date_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user_id
    
    # class Meta:
    #     ordering = ['aisle']

class UsualGroceryItem(models.Model):
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=200)
    item_note = models.CharField(max_length=200, null=True, blank=True)
    create_date_time = models.DateTimeField(auto_now_add=True)
    update_date_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user_id

class UnpurchasedGroceryItem(models.Model):
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=200)
    item_note = models.CharField(max_length=200, null=True, blank=True)
    create_date_time = models.DateTimeField(auto_now_add=True)
    update_date_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user_id

class FavoriteGroceryList(models.Model):
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    list_name = models.CharField(max_length=200)
    item_name = models.CharField(max_length=200)
    item_note = models.CharField(max_length=200, null=True, blank=True)
    create_date_time = models.DateTimeField(auto_now_add=True)
    update_date_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user_id


# class UserListShare(models.Model):
#     list_owner_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     list_id = models.ForeignKey(CurrentGroceryList.id, FavoriteGroceryList.id, on_delete=models.CASCADE))
#     share_with_user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
#     create_date_time = models.DateTimeField(auto_now_add=True)
#     update_date_time = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return self.user_id
