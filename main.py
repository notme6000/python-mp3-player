import webview
import os
import pygame
from tkinter import filedialog
import json

config_file = "static/config.json"

class API:
    def __init__(self):
        pygame.mixer.init()
        self.playlist = []
        self.current_track = 0
        self.is_playing = False
        self.music_dir = self.load_config()

        if self.music_dir:
            self.load_playlist(self.music_dir)

    def load_config(self):
        if os.path.exists(config_file):
            with open(config_file, "r") as f:
                config = json.load(f)
                return config.get("music_dir", "")
        return ""

    def save_config(self):
        with open(config_file, "w") as f:
            json.dump({"music_dir": self.music_dir},f)

    def load_playlist(self,folder):
        self.playlist = [os.path.join(folder, f) for f in os.listdir(folder) if f.endswith(".mp3")]
        self.current_track = 0

    def open_folder(self):
        folder = filedialog.askdirectory()
        if folder:
            self.music_dir = folder
            self.save_config()
            self.load_playlist(folder)    
            return json.dumps(self.playlist)
        return json.dumps([])
    
    def play_pause(self):
        if self.playlist:
            if pygame.mixer.music.get_busy():
                pygame.mixer.music.pause()
                self.is_playing = False
            else:
                if not self.is_playing:
                    pygame.mixer.music.load(self.playlist[self.current_track])
                    pygame.mixer.music.play()
                else:
                    pygame.mixer.music.unpause()
                self.is_playing = True
        return self.is_playing

    def next_track(self):
        if self.playlist:
            self.current_track = (self.current_track + 1) % len(self.playlist)
            pygame.mixer.music.load(self.playlist[self.current_track])
            pygame.mixer.music.play()
            self.is_playing = True
        return self.current_track

    def prev_track(self):
        if self.playlist:
            self.current_track = (self.current_track - 1) % len(self.playlist)
            pygame.mixer.music.load(self.playlist[self.current_track])
            pygame.mixer.music.play()
            self.is_playing = True
        return self.current_track

    def get_playlist(self):
        return json.dumps(self.playlist)

api = API() 
webview.create_window("mp3 player", "static/ui.html", width=450, height=600,js_api=api)

webview.start()
