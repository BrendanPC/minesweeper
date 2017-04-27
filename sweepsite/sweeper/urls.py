from django.conf.urls import url

from . import views

app_name = "sweeper"

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^(?P<game_id>[0-9]+)/$', views.display, name='display'),
    url(r'^(?P<game_id>[0-9]+)/discover_tile/', views.discover_tile, name='discover_tile'),
    url(r'^[0-9]+/new_game/$', views.new_game, name='new_game'),
]