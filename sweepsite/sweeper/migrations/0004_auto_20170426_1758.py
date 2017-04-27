# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-26 21:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sweeper', '0003_tile_adjacent_mines'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='mines',
            field=models.PositiveSmallIntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='game',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='tile',
            name='adjacent_mines',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='tile',
            name='is_flagged',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='tile',
            name='is_visible',
            field=models.BooleanField(default=False),
        ),
    ]
