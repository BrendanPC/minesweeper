from django.db import models
import random

class GameManager(models.Manager):
    def build_minefield(self,height,width,mines):
        if mines >= height*width or mines < 1:
            mines = height*width // 3
        board = [ [0] * height for _ in range(width)]
        mines_placed = 0
        #TODO this is pretty inefficient - could be sped up with random.choose
        while mines_placed < mines:
            x = random.randint(0,width-1)
            y = random.randint(0,height-1)
            
            if board[x][y] < 9: # no mine yet
                board[x][y] += 8
                mines_placed += 1
                for x_offset in range(-1,2):
                    for y_offset in range(-1,2):
                        if x+x_offset >= 0 and x+x_offset < width and y+y_offset >=0 and y+y_offset < height:
                            board[x+x_offset][y+y_offset] += 1
        return board
    
    def create_game(self,height,width,mines):
        game = self.create(height=height, width=width, mines=mines)
        board = self.build_minefield(height,width,mines)
        for x in range(height):
            for y in range(width):
                to_be_mined = False
                adjacent_mines = board[x][y]
                if adjacent_mines > 8:
                    to_be_mined = True
                    adjacent_mines -= 9
                t = Tile(x=x,y=y,game=game,adjacent_mines=adjacent_mines,is_mined=to_be_mined)
                #TODO also slow
                t.save()
        return game


class Game(models.Model):
    height = models.PositiveSmallIntegerField()
    width = models.PositiveSmallIntegerField()
    is_active = models.BooleanField(default=True)
    mines = models.PositiveSmallIntegerField(default=1)
    
    objects = GameManager()
    
    def __str__(self):
        return str(self.id)

class Tile(models.Model):
    x = models.PositiveSmallIntegerField()
    y = models.PositiveSmallIntegerField()
    is_mined = models.BooleanField()
    is_flagged = models.BooleanField(default=False)
    is_visible = models.BooleanField(default=False)
    adjacent_mines = models.PositiveSmallIntegerField(default=0)
    game = models.ForeignKey(Game,  on_delete=models.CASCADE)
    
    def __str__(self):
        tags = ""
        if self.is_mined:
            tags+= "M"
        if self.is_flagged:
            tags+="F"
        if self.is_visible:
            tags+="V"
        return str(self.x) + "," + str(self.y) + tags
    


