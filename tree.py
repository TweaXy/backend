import seedir as sd
import os

def my_style(item):
    outdict = {}
    
    ext = os.path.splitext(item)[1]
    basname = os.path.basename(item)
    return os.path.basename(path) + ' ' + os.path.dirname(path)
path = './'


    
sd.seedir(path, exclude_folders=['node_modules', '.git'], style='emoji')
