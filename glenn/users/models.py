from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    store_location_id = models.IntegerField(null=True, blank=True)
    store_name = models.CharField(max_length=200, null=True, blank=True)
    store_address_1 = models.CharField(max_length=200, null=True, blank=True)
    store_city = models.CharField(max_length=100, null=True, blank=True)
    store_state = models.CharField(max_length=30, null=True, blank=True)
    store_zip = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.username
