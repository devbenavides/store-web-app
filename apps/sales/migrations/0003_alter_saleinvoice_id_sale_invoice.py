# Generated by Django 5.0.4 on 2024-11-05 01:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sales', '0002_alter_sale_id_sale_alter_sale_sale_invoices_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='saleinvoice',
            name='id_sale_invoice',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
