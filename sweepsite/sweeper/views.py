from django.template import loader
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
import json
from django.db.models import Q

from .models import Game
from .models import Tile


def index(request):
    latest_game_list = Game.objects.order_by('height')[:5]
    context = {
        'latest_game_list': latest_game_list,
    }
    return render(request, 'sweeper/index.html', context)

def display(request, game_id):
    game = get_object_or_404(Game, pk=game_id)
    
    board = [ [None] * game.height for _ in range(game.width)]
    visible_tiles = game.tile_set.filter(Q(is_visible=True) | Q(is_flagged=True))

    for tile in visible_tiles:
        if tile.is_flagged:
            board[tile.x][tile.y] = "F"
        elif tile.is_visible:
            if tile.is_mined:
                board[tile.x][tile.y] = "M"
            else:
                board[tile.x][tile.y] = tile.adjacent_mines
    
    return render(request, 'sweeper/display.html', {'game': game, 'board': json.dumps(board)})