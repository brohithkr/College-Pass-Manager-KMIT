from PyQt5.QtWidgets import (
    QDialog, QTimeEdit, QDialogButtonBox, QLayout,
    QLabel, QHBoxLayout, QVBoxLayout
)
from PyQt5.QtGui import QKeyEvent, QCloseEvent
from PyQt5.QtCore import pyqtSignal, Qt 
from sys import exit
from datetime import datetime

from typing import List
import requests

from srvrcfg import SERVERURL

class LunchTimeDialog(QDialog):
    invalid = pyqtSignal()
    def __init__(self, parent =None):
        super().__init__(parent=parent)
        self.setWindowTitle("Set Lunch Time")

        if parent:
            parent.setDisabled(True)
            self.setEnabled(True)

        self.setWindowFlag(Qt.WindowContextHelpButtonHint, False)
        buttonBox = QDialogButtonBox(QDialogButtonBox.Ok, self)
        
        self.start: List[QTimeEdit]= []
        self.end: List[QTimeEdit] = [] 
        self.years: List[QHBoxLayout] = []
        self.label: List[QLabel] = []
        self.label2: List[QLabel] = []
        for i in range(3):
            self.start.append(QTimeEdit())
            self.end.append(QTimeEdit())
            self.years.append(QHBoxLayout())
            self.label.append(QLabel())
            self.label2.append(QLabel())
            self.label[i].setText(f"{i+1} year: ")
            self.label2[i].setText(" to ")
            self.years[i].addWidget(self.label[i])
            self.years[i].addWidget(self.start[i])
            self.years[i].addWidget(self.label2[i])
            self.years[i].addWidget(self.end[i])

        layout = QVBoxLayout(self)
        for i in range(3):
            layout.addLayout(self.years[i])
        layout.addWidget(buttonBox)

        self.layout().setSizeConstraint(QLayout.SetFixedSize)
        self.getLunchTime()

        buttonBox.accepted.connect(self.setLunchTime)

    def getLunchTime(self):
        # res = requests.get(f"{SERVERURL}/lunchtimes").json()
        if (msg:=res["msg"]) == "Invalid":
            self.parent().error(msg)
        res = [{"start": "12:10 PM", "end": "01:00 PM"},
                      {"start": "01:10 PM", "end": "02:00 PM"},
                      {"start": "01:10 PM", "end": "02:00 PM"}]
        for i in range(3):
            start = datetime.strptime(res[i]["start"], "%I:%M %p").time()
            end = datetime.strptime(res[i]["end"], "%I:%M %p").time()

            self.start[i].setTime(start)
            self.end[i].setTime(end)

    def setLunchTime(self):
        lunchtimes = []
        for i in range(3):
            lunchtimes.append({"start": self.start[i].time().toString("hh:mm A"),
                                "end": self.end[i].time().toString("hh:mm A")})
            # print("Start", i, ":", start)
            # print("End", i, ":", end)

        try :
            # res = requests.post(f"{SERVERURL}/lunchtimes", json=lunchtimes).status_code
            pass
        except (requests.ConnectionError, requests.Timeout):
            self.parent().error("Internet Error! Exiting.")
            exit()
        
        if True: #res == 200:
            self.close()
        else: 
            self.parent().error(f"Unexpected Error. {res}")

    def closeEvent(self, a0: QCloseEvent) -> None:
        if self.parent():
            self.parent().setEnabled(True)
        return super().closeEvent(a0)
    
    def keyPressEvent(self, e: QKeyEvent) -> None:
        if e.key() != Qt.Key.Key_Escape:
            QDialog.keyPressEvent(self, e)

