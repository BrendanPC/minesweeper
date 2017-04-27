from django.contrib import admin

from .models import Game
from .models import Tile

class TileInline(admin.StackedInline):
    model = Tile


class GameAdmin(admin.ModelAdmin):
    inlines = [TileInline]

admin.site.register(Game,GameAdmin)
admin.site.register(Tile)