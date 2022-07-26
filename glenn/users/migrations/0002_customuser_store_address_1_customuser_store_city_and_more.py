# Generated by Django 4.0.6 on 2022-07-26 17:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='store_address_1',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='store_city',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='store_location_id',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='store_name',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='store_state',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='store_zip',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]
