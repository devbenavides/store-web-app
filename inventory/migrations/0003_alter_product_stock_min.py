# Generated by Django 5.0.4 on 2024-06-25 21:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0002_product_stock_min_alter_product_code_product'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='stock_min',
            field=models.IntegerField(),
        ),
    ]
