# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2017-04-26 14:11
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sweeper', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tile',
            old_name='is_visibile',
            new_name='is_visible',
        ),
    ]
