# Generated by Django 4.0.6 on 2022-07-30 23:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('glenn', '0006_grocerylist_is_favorite'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grocerylistitems',
            name='list_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='list_items', to='glenn.grocerylist'),
        ),
    ]
