from os.path import dirname, abspath, isfile, join as joinpath
from sys import argv, exit, executable
from re import fullmatch
from requests import post as urlpost
from datetime import date
from base64 import b64decode as b64d
from configparser import ConfigParser

from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QMenu, QAction, QLineEdit, QComboBox, 
    QToolButton, QPushButton, QGraphicsScene, QGraphicsPixmapItem,
    QMessageBox
)
from PyQt5.QtGui import QIcon, QPixmap, QImage, QPainter
from PyQt5.QtPrintSupport import QPrinter, QPrintDialog, QPrinterInfo
from PyQt5.uic import loadUi
from PyQt5.QtCore import pyqtSlot, QSizeF

import sys

from setlunchtime import *
from gethistory import *
from srvrcfg import SERVERURL, headers

BASE_DIR = None
if getattr(sys, 'frozen', False):
    BASE_DIR = dirname(executable)
elif __file__:
    BASE_DIR = dirname(abspath(__file__))

DATE = date.today()
YEAR = int(str(DATE.year)[2:])
DATA_DIR = joinpath(dirname(abspath(__file__)), "res")

savedPageSize = False
cfg = ConfigParser()
if isfile(joinpath(BASE_DIR, '.config.ini')):
    cfg.read(joinpath(BASE_DIR, '.config.ini'))
    sections = cfg.sections()
    if "PageSize" in sections:
        savedPageSize = True
else:
    cfg["PageSize"] = {"height": "-1", "width": "-1"}


class MainWin(QMainWindow):
    def __init__(self, parent=None):
        super(MainWin, self).__init__(parent)
        
        self.details: QLabel
        self.rno: QLineEdit
        self.PassType: QComboBox
        self.Tools: QToolButton
        self.GenPassBtn: QPushButton
        self.PrintBtn: QPushButton

        ui_file_path = joinpath(DATA_DIR, 'design.ui')
        loadUi(ui_file_path, self)

        self.status = QLabel()
        self.status.setAlignment(Qt.AlignmentFlag.AlignRight)
        self.status.setStyleSheet("padding-right: 12px; padding-bottom: 3px")
        self.status.setText("Waiting for data...")

        self.statusBar().addWidget(self.status, 1)

        self.rno.editingFinished.connect(lambda: self.rno.setText(self.rno.text().upper()))
        self.rno.textChanged.connect(self.handleRollNo)
        self.rno.returnPressed.connect(lambda: self.PassType.setFocus())

        self.GenPassBtn.pressed.connect(self.generatePass)
        self.PrintBtn.pressed.connect(self.printQR)

        self.setupOptions()
        self.handleRollNo("")

    @pyqtSlot(str)
    def handleRollNo(self, _):
        rno = self.rno.text().upper()
        if not fullmatch("\d{2}BD1A\d{2}[A-HJ-NP-RT-Z0-9]{2}", rno):
            self.PassType.setDisabled(True)
            self.GenPassBtn.setDisabled(True)
            self._SetPASSimg()
            self.details.setText("## ...")
            self.details.setAlignment(Qt.AlignmentFlag.AlignCenter)
            self.status.setText("Invalid Roll No." if len(rno)==10 else "Waiting for data")
            return
        
        self.updateDetails()
        self.GenPassBtn.setEnabled(True)
        self._SetPASSimg("Processing")

        admn_yr = int(rno[:2])

        if admn_yr > YEAR-3 or (admn_yr == YEAR-3 and DATE.month < 6):
            self.PassType.setEnabled(True)
            self.PassType.model().item(2).setEnabled(False)
        elif admn_yr < YEAR-3 or (admn_yr == YEAR-3 and DATE.month > 6):
            self.PassType.setEnabled(True)
            self.PassType.model().item(2).setEnabled(True)

    def updateDetails(self):
        # details = {"name": None, "section": None, "year": None} # urlget("http://localhost:3000/details").json()
        # self.details.setText(f"#### Name:\n##### {details['name']}\n---\n##### Section: {details['section']}\n##### Year: {details['year']}\n")
        # self.details.setAlignment(Qt.AlignmentFlag.AlignLeft|Qt.AlignmentFlag.AlignVCenter)
        ...

    def printQR(self):
        Printer = QPrinter(QPrinterInfo.defaultPrinter())
        saved_size = None
        if savedPageSize:
            saved_size = (float(cfg["PageSize"]["width"]), float(cfg["PageSize"]["height"]))
            Printer.setPageSizeMM(QSizeF(*saved_size))
        Printer.setPageMargins(5,5,5,5, QPrinter.Millimeter)
        
        painter = QPainter()
        printdlg = QPrintDialog(Printer)
        printdlg.exec()

        painter.begin(Printer)
        res = min(Printer.width(), Printer.height())
        painter.drawImage(0,0,self.PassImg.scaled(res, res))
        painter.end()

        pagesize = Printer.pageSizeMM()
        if saved_size != (wd:=pagesize.width(), ht:=pagesize.height()):
            cfg["PageSize"]["width"], cfg["PageSize"]["height"] = str(wd), str(ht)
            with open(joinpath(BASE_DIR , '.config.ini'), "w") as f:
                cfg.write(f)

    def setupOptions(self):
        settingsMenu = QMenu(self)
        settingsMenu.addAction('Set Lunch time', self.setLunchTime)
        settingsMenu.addAction('Download history', self.dloadMonthHistory)

        self.Tools.setMenu(settingsMenu)
        self.Tools.setDefaultAction(QAction(self))

        icon = QIcon()
        icon.addPixmap(QPixmap(joinpath(DATA_DIR, "Gear.jpg")), 
                       QIcon.Normal, QIcon.On)
        self.Tools.setIcon(icon)
        self.Tools.setText(None)

    def setLunchTime(self):
        dlg = LunchTimeDialog(self)
        dlg.show()

    def dloadMonthHistory(self):
        dlg = GetHistoryDialog(self)
        dlg.show()

    def _SetPASSimg(self, img: bytes | str | None = None) -> None:
        self.passScene = QGraphicsScene()
        self.PASSimgbox = QGraphicsPixmapItem()
        if type(img) != bytes:
            self.passScene.addText("Enter Data" if img == None else img)
            self.PrintBtn.setDisabled(True)
        else: 
            self.PassImg = QImage.fromData(b64d(img), 'PNG')
            self.PassPixMap = QPixmap.fromImage(self.PassImg).scaled(360, 360)
            self.PASSimgbox.setPixmap(self.PassPixMap)
            self.passScene.addItem(self.PASSimgbox)
            self.PrintBtn.setEnabled(True)
        self.Pass.setScene(self.passScene)
        self.Pass.setAlignment(Qt.AlignmentFlag.AlignCenter)

    @pyqtSlot()
    def generatePass(self):
        if (passtype:=self.PassType.currentIndex()) > 0:
            res = urlpost(f"{SERVERURL}/gen_pass", headers=headers, json={"rollno": self.rno.text().upper(), 
                                                                        "pass_type": "one_time" if passtype == 0 else
                                                                                    "daily" if passtype == 1 else
                                                                                    "alumni" }).content.decode()
        if res.startswith("Error:"):
            self.error(res.split(":", 1)[1])
        else:
            passimg = None
            data = res.split("\n")
            if res.startswith("Warning:"):
                self.error(data[0])
                passimg = data[1]
            else:
                passimg = res
            self._SetPASSimg(passimg.encode())

    @pyqtSlot(str)
    def error(self, msg):
        QMessageBox.critical(self.parent(), "Error!", msg)
        self.show()

    @pyqtSlot()
    def success(self):
        QMessageBox.information(self.parent(), "Success", "Lunch Times Modified.")

    @pyqtSlot(int)
    def crash(self, response):
        QMessageBox.critical(self.parent(), "Server Error!!", f"Unexpected server-side error occured.\nResponse code: {response}")
        exit()


if __name__ == '__main__':
    prg = QApplication(argv)
    win = MainWin()
    win.show()
    exit(prg.exec())