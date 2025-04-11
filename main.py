import webview
import os
import pygame
from tkinter import filedialog
import json
import threading
import time
import random

config_file = "static/config.json"
playlist_file = "static/playlist.json"


class API:
    def __init__(self):
        pygame.mixer.init()
        self.playlist = []
        self.current_track = 0
        self.is_playing = False
        self.music_dir = self.load_config()
        self.shuffle = False
        self.repeat = False
        threading.Thread(target=self.track_watcher, daemon=True).start()



        if os.path.exists(playlist_file):
            with open(playlist_file, "r") as pf:
                self.playlist = json.load(pf)
                self.current_track = 0
        elif self.music_dir:
            self.load_playlist(self.music_dir)


    def toggle_shuffle(self):
        self.shuffle = not self.shuffle
        print("shuffle is on")
        return self.shuffle

    def toggle_repeat(self):
        self.repeat= not self.repeat
        print("repeat is on")
        return self.repeat


    def track_watcher(self):
        while True:
            if self.is_playing and not pygame.mixer.music.get_busy():
                time.sleep(1)
                self.next_track()
            time.sleep(0.5)

    def save_playlist(self):
        with open(playlist_file , "w") as pf:
            json.dump(self.playlist, pf)

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
        self.save_playlist()

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
            if self.shuffle:
                next_index = self.current_track
                while next_index == self.current_track and len(self.playlist) > 1:
                    next_index = random.randint(0, len(self.playlist) - 1)
                self.current_track = next_index
            elif self.repeat:
                pass
            else:
                self.current_track = (self.current_track + 1) % len(self.playlist)



            pygame.mixer.music.load(self.playlist[self.current_track])
            pygame.mixer.music.play()
            self.is_playing = True

            webview.windows[0].evaluate_js(f'updateCurrentTrack({self.current_track})')

        return self.current_track

    def prev_track(self):
        if self.playlist:
            self.current_track = (self.current_track - 1) % len(self.playlist)
            pygame.mixer.music.load(self.playlist[self.current_track])
            pygame.mixer.music.play()
            self.is_playing = True
        return self.current_track

    def get_playlist(self):
        return json.dumps({"playlist": self.playlist,"current_track":self.current_track})

api = API() 
webview.create_window("mp3 player", "static/ui.html", width=450, height=600,js_api=api)

webview.start(debug=False)
