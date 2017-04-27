from django.template import loader
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
import json
from django.db.models import Q

from .models import Game


def index(request):
    latest_game_list = Game.objects.order_by('-id')[:15]
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
    
    # TODO trouble with gigantic boards (10 000 tiles)
    return render(request, 'sweeper/display.html', {'game': game, 'board': json.dumps(board)})

def _get_adjacent_empties(game,base_tile):
    tiles = list(game.tile_set.filter(Q(is_flagged=False) & Q(is_mined=False) & Q(is_visible=False)))
    search_list = [base_tile]
    found_list = [base_tile]
    tiles.remove(base_tile)
    
    while len(search_list) > 0:
        current_tile = search_list.pop()
        for tile in tiles[:]:
            if abs(tile.x - current_tile.x) <= 1 and abs(tile.y - current_tile.y) <= 1:
                found_list.append(tile)
                tiles.remove(tile)
                if tile.adjacent_mines == 0:
                    search_list.append(tile)
    
    # big speed gain over individual saves()
    # sqlite has trouble with huge updates
    id_list = list(obj.id for obj in found_list)
    for i in range(0,len(id_list), 500):
        chunk = id_list[i:i+500]
        update_queryset = game.tile_set.filter(pk__in=chunk)
        update_queryset.update(is_visible=True)
    
    # make json friendly                
    final_list = []
    for tile in found_list:
        final_list.append({'x':tile.x, 'y':tile.y, 'adj':tile.adjacent_mines})
    return final_list

def _check_for_victory(game):
    return game.tile_set.filter(Q(is_visible=False) & Q(is_mined=False)).count() == 0
        

def discover_tile(request, game_id):
    game = get_object_or_404(Game, pk=game_id)
    x, y = request.GET.get('x'), request.GET.get('y')
    if not game.is_active or not x in range(game.width) and y in range(game.height):
        return HttpResponse(status=400)
    
    tile = game.tile_set.filter(Q(x=x) & Q(y=y))
    if len(tile) == 1:
        tile = tile[0]
    else:
        return HttpResponse(status=500)
    
    if tile.is_mined:
        response = 9
        tile.is_visible = True
        tile.save()
        game.is_active = False
        game.save()
    elif tile.adjacent_mines == 0:
        response=json.dumps(_get_adjacent_empties(game,tile))
    else:
        response = tile.adjacent_mines
        tile.is_visible = True
        tile.save()
   
    if _check_for_victory(game):
        game.is_active = False
        game.save()
        #TODO inform client of victory
        
    return HttpResponse(response)

def new_game(request):
    game = Game.objects.create_game(int(request.POST['Height']), int(request.POST['Width']), int(request.POST['Mines']))
    return display(request, game.id)
#return redirect('sweeper.display', request=request, game_id=game.id, permanent=True)