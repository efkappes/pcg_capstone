# Generated by Django 4.0.6 on 2022-07-28 22:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('glenn', '0005_grocerylist_grocerylistitems_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='grocerylist',
            name='is_favorite',
            field=models.BooleanField(default=False),
        ),
    ]
