from sys import argv, stderr, exit
from platform import system
from os.path import join as joinpath

try: import PyInstaller.__main__ as pyinstaller
except ImportError:
    print("Pyinstaller needs to be installed to use this script")
    exit(1)

ostype = system()

extras = ''
delim = ':'
strip = 's'
iconext = 'png'
if ostype == "Windows": 
    extras = f"-i {joinpath('.', 'client', 'res', 'kmit.ico')} "
    delim = ';'
    strip = ''
    iconext = 'ico'
elif ostype == "Darwin":
    extras = f"-i {joinpath('.', 'client', 'res', 'kmit.icns')} "
    iconext = 'icns'

args = f"./pass-generator/main.py -Fw{strip} -n generator " + \
    f"--add-data {joinpath('.', 'client', 'res', 'design.ui')}{delim}data " + \
    f"--add-data {joinpath('.', 'client', 'res', 'Gear.jpg')}{delim}data " + \
    f"--add-data {joinpath('.', 'client', 'res', f'kmit.{iconext}')}{delim}data " \
    f"--upx-exclude kmit.{iconext}) " + extras + " ".join(argv[1:])

print("Building App:\n")
print("Running command:", "pyinstaller " + args + '\n', sep='\n', file=stderr)
pyinstaller.run(args.split())
